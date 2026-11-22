import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { store } from '../../context';
import { bagpipes } from '../../dataset/bagpipes';
import { TimeSignatures } from '../../dataset/songs/interfaces';
import { BagpipeTypes } from '../../interfaces';
import { routes } from '../../router/routes';
import { MAX_ROLL_BPM, MIN_ROLL_BPM, ROLL_TIME_SIGNATURES } from '../../utils/midiUtils/melodyRoll';
import { createMetronomeRecorder, MetronomeRecording } from '../../utils/audioToMidi/recorder';
import { decodeAudioFile, recognizeNotes } from '../../utils/audioToMidi/basicPitch';
import { Recognition } from '../../utils/audioToMidi/recognize';
import { estimateTempo, quantizeNotes } from '../../utils/audioToMidi/quantize';
import { encodeWav } from '../../utils/audioToMidi/wav';
import { loadDraft, NEW_DRAFT_KEY, saveDraft } from '../MelodyEditor/draft';

const KEY_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const MAX_RECORDING_SECONDS = 5 * 60;
const GRIDS = [
  { ticks: 240, label: '1/8' },
  { ticks: 120, label: '1/16' },
  { ticks: 60, label: '1/32' },
];
const DEFAULT_GRID = 120;
const DEFAULT_BPM = 80;
// Shorter sounds are not notes at all
const MIN_NOTE_SECONDS = 0.03;
const MAX_FILE_BYTES = 100 * 1024 * 1024;

type Phase = 'idle' | 'starting' | 'recording' | 'recognizing' | 'done';

interface Result {
  recording: MetronomeRecording;
  recognition: Recognition;
  // What it was recorded with
  bpm: number;
  // The tempo was found from the notes, not set
  tempoFound?: boolean;
  timeSignature: TimeSignatures;
  bagpipeType: BagpipeTypes;
  // Why it failed; absent when the melody was recognized
  error?: string;
  warnings: string[];
}

// Admin page /admin/recognize: play a melody along with a metronome, the app
// finds its notes and opens them in the melody editor for checking.
export const RecognizeMelody = () => {
  const { t } = useTranslation('translation');
  const history = useHistory();
  const {
    state: { bagpipeType: settingsBagpipe, transpose },
  } = useContext(store);

  const [bagpipeType, setBagpipeType] = useState<BagpipeTypes>(settingsBagpipe);
  // Kept as typed, so the field can be cleared and retyped
  const [bpmText, setBpmText] = useState('80');
  const bpm = Math.min(MAX_ROLL_BPM, Math.max(MIN_ROLL_BPM, Math.round(Number(bpmText)) || DEFAULT_BPM));
  const [timeSignature, setTimeSignature] = useState<TimeSignatures>('4/4');
  const [gridTicks, setGridTicks] = useState(DEFAULT_GRID);
  const [phase, setPhase] = useState<Phase>('idle');
  const [beat, setBeat] = useState<{ beat: number; bar: number } | null>(null);
  const [level, setLevel] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [micError, setMicError] = useState<string>();
  const [fileError, setFileError] = useState<string>();
  const [resultBpmText, setResultBpmText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const recorderRef = useRef(createMetronomeRecorder());
  const startedAtRef = useRef(0);
  const stopRef = useRef<() => void>(() => {});

  useEffect(() => setBagpipeType(settingsBagpipe), [settingsBagpipe]);

  // Leaving the page stops the microphone and the metronome
  useEffect(() => {
    const recorder = recorderRef.current;
    return () => recorder.cancel();
  }, []);

  useEffect(() => {
    if (phase !== 'recording') return;
    const id = setInterval(() => {
      const seconds = (Date.now() - startedAtRef.current) / 1000;
      setElapsed(seconds);
      if (seconds >= MAX_RECORDING_SECONDS) stopRef.current();
    }, 250);
    return () => clearInterval(id);
  }, [phase]);

  const beatsPerBar = Number(timeSignature.split('/')[0]);
  const bagpipeName = (type: BagpipeTypes) => t(`dudas.${bagpipes[type]?.name}`);

  const record = async () => {
    setBpmText(String(bpm));
    setResult(null);
    setMicError(undefined);
    setBeat(null);
    setLevel(0);
    setElapsed(0);
    setPhase('starting');
    try {
      await recorderRef.current.start(bpm, timeSignature, {
        onBeat: (beatInBar, bar) => setBeat({ beat: beatInBar, bar }),
        onLevel: setLevel,
      });
      startedAtRef.current = Date.now();
      setPhase('recording');
    } catch (error: any) {
      console.log(error);
      recorderRef.current.cancel();
      setMicError(
        error?.name === 'NotAllowedError'
          ? 'The browser did not allow the microphone. Allow it for this site and try again.'
          : 'Could not start the microphone.'
      );
      setPhase('idle');
    }
  };

  const stop = async () => {
    setPhase('recognizing');
    setProgress(0);
    await recognize(await recorderRef.current.stop());
  };
  stopRef.current = stop;

  const chooseFile = async (file: File) => {
    setResult(null);
    setMicError(undefined);
    setFileError(undefined);
    if (file.size > MAX_FILE_BYTES) {
      setFileError('The file is too big (the limit is 100 MB).');
      return;
    }
    setPhase('recognizing');
    setProgress(0);
    try {
      const { samples, sampleRate } = await decodeAudioFile(file);
      if (samples.length / sampleRate > MAX_RECORDING_SECONDS * 2) {
        throw new Error('The audio is longer than 10 minutes.');
      }
      await recognize({ samples, sampleRate, firstBeatSeconds: 0, latencySeconds: 0 }, true);
    } catch (error: any) {
      console.log(error);
      setFileError(error?.message?.includes('10 minutes') ? error.message : 'Could not read that audio file.');
      setPhase('idle');
    }
  };

  // findTempo: the recording has no metronome, so the tempo is found from the notes
  const recognize = async (recording: MetronomeRecording, findTempo = false) => {
    const recognition = await recognizeNotes(recording.samples, recording.sampleRate, {
      bagpipeType,
      transpose,
      // Only blips are left out: grace notes stay and are written as 1/32 notes
      minNoteSeconds: MIN_NOTE_SECONDS,
      onProgress: setProgress,
    });
    const usedBpm = findTempo ? estimateTempo(recognition.notes, timeSignature) : bpm;
    setResultBpmText(String(usedBpm));
    setResult({
      recording,
      recognition,
      bpm: usedBpm,
      tempoFound: findTempo,
      timeSignature,
      bagpipeType,
      ...judge(recognition, recording, bagpipeName(bagpipeType)),
    });
    setPhase('done');
  };

  const roll = useMemo(
    () =>
      result && !result.error
        ? quantizeNotes(result.recognition.notes, {
            bagpipeType: result.bagpipeType,
            timeSignature: result.timeSignature,
            bpm: result.bpm,
            gridTicks,
            keyTranspose: result.recognition.keyTranspose,
          })
        : null,
    [result, gridTicks]
  );

  const recordingUrl = useMemo(
    () => (result ? URL.createObjectURL(encodeWav(result.recording.samples, result.recording.sampleRate)) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [result?.recording]
  );
  useEffect(
    () => () => {
      if (recordingUrl) URL.revokeObjectURL(recordingUrl);
    },
    [recordingUrl]
  );

  const existingDraft = useMemo(() => (phase === 'done' ? loadDraft(NEW_DRAFT_KEY) : null), [phase]);
  const replacesDraft = !!existingDraft && (existingDraft.roll.notes.length > 0 || !!existingDraft.title.trim());

  const openInEditor = () => {
    if (!roll) return;
    saveDraft(NEW_DRAFT_KEY, { title: `Recognized melody ${new Date().toLocaleString()}`, roll });
    history.push(routes.melodyEditor);
  };

  const busy = phase === 'starting' || phase === 'recording' || phase === 'recognizing';
  const recognition = result?.recognition;
  const cents = recognition ? Math.round(recognition.tuningOffset * 100) : 0;

  return (
    <Page>
      <h1>Recognize melody</h1>

      {phase === 'recording' || phase === 'starting' ? (
        <Recording>
          <Beats>
            {Array.from({ length: beatsPerBar }, (_, i) => (
              <span key={i} className={beat?.beat === i ? (i === 0 ? 'on accent' : 'on') : undefined} />
            ))}
          </Beats>
          <div className="status">
            {beat ? `Bar ${beat.bar + 1}` : 'Starting…'} · {formatTime(elapsed)}
          </div>
          <Level aria-label="Microphone level">
            <span style={{ width: `${Math.min(100, level * 100)}%` }} className={level > 0.98 ? 'clip' : undefined} />
          </Level>
          {level > 0.98 && <p className="warning">Too loud: move the microphone further away.</p>}
          <RoundButton className="stop" onClick={stop} disabled={phase !== 'recording'}>
            Stop
          </RoundButton>
        </Recording>
      ) : phase === 'recognizing' ? (
        <Recording>
          <div className="status">Recognizing… {Math.round(progress * 100)}%</div>
        </Recording>
      ) : (
        <Recording>
          <RoundButton className="record" onClick={record}>
            {phase === 'done' ? 'Record again' : 'Record'}
          </RoundButton>
          {micError && <p className="warning">{micError}</p>}
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg,.flac"
            hidden
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = '';
              if (file) chooseFile(file);
            }}
          />
          <button className="file" onClick={() => fileInputRef.current?.click()}>
            Or choose an audio file
          </button>
          {fileError && <p className="warning">{fileError}</p>}
        </Recording>
      )}

      {phase === 'done' && result && recognition && (
        <ResultBox className={result.error ? 'failed' : 'ok'}>
          {result.error ? (
            <>
              <h2>Could not recognize the melody</h2>
              <p>{result.error}</p>
              {recordingUrl && (
                <a className="download" href={recordingUrl} download="recording.wav">
                  Download the recording
                </a>
              )}
            </>
          ) : (
            roll && (
              <>
                <h2>Melody recognized</h2>
                <p>
                  {roll.notes.length} notes in {roll.bars} {roll.bars === 1 ? 'bar' : 'bars'}. Key{' '}
                  {KEY_NAMES[roll.tonic ?? 9]}
                  {cents ? `, the pipe is ${Math.abs(cents)} cents ${cents > 0 ? 'sharp' : 'flat'}` : ''}.
                  {recognition.ornaments > 0 &&
                    ` ${recognition.ornaments} grace ${recognition.ornaments === 1 ? 'note was' : 'notes were'} left out.`}
                </p>
                <label className="tempo">
                  {result.tempoFound ? 'Tempo found (change it if it is wrong)' : 'Tempo'}
                  <input
                    type="text"
                    inputMode="numeric"
                    value={resultBpmText}
                    onChange={(event) => {
                      const text = event.target.value.replace(/[^0-9]/g, '').slice(0, 3);
                      setResultBpmText(text);
                      const value = Number(text);
                      if (value >= MIN_ROLL_BPM && value <= MAX_ROLL_BPM) setResult({ ...result, bpm: value });
                    }}
                  />
                </label>
                {result.warnings.map((warning) => (
                  <p key={warning} className="warning">
                    {warning}
                  </p>
                ))}
                {replacesDraft && (
                  <p className="warning">This replaces the unsaved new melody that is open in the editor.</p>
                )}
                <div className="actions">
                  <button className="open" onClick={openInEditor}>
                    Open in editor
                  </button>
                  {recordingUrl && (
                    <a className="download" href={recordingUrl} download="recording.wav">
                      Download the recording
                    </a>
                  )}
                </div>
              </>
            )
          )}
        </ResultBox>
      )}

      <Settings>
        <label>
          Bagpipe
          <select
            value={bagpipeType}
            disabled={busy}
            onChange={(event) => setBagpipeType(event.target.value as BagpipeTypes)}
          >
            {Object.values(BagpipeTypes).map((type) => (
              <option key={type} value={type}>
                {bagpipeName(type)}
              </option>
            ))}
          </select>
        </label>
        <label>
          Tempo for recording (quarter notes per minute)
          <input
            type="text"
            inputMode="numeric"
            value={bpmText}
            disabled={busy}
            onChange={(event) => setBpmText(event.target.value.replace(/[^0-9]/g, '').slice(0, 3))}
            onBlur={() => setBpmText(String(bpm))}
          />
        </label>
        <label>
          Time signature
          <select
            value={timeSignature}
            disabled={busy}
            onChange={(event) => setTimeSignature(event.target.value as TimeSignatures)}
          >
            {ROLL_TIME_SIGNATURES.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>
        <label>
          Shortest note
          <select
            value={gridTicks}
            disabled={phase === 'recognizing'}
            onChange={(event) => setGridTicks(Number(event.target.value))}
          >
            {GRIDS.map((grid) => (
              <option key={grid.ticks} value={grid.ticks}>
                {grid.label}
              </option>
            ))}
          </select>
        </label>
      </Settings>
      <p className="hint">
        Press Record and play along with the metronome, or choose an audio file (mp3, wav, m4a...) of one bagpipe
        playing. For a file, set the bagpipe first: the tempo is found from the notes, and you can correct it. The app finds the notes and opens
        them in the melody editor, where you can fix them and save. Headphones keep the clicks out of the recording.
      </p>
    </Page>
  );
};

const formatTime = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;

// Whether the recognition can be trusted enough to open, and what to watch for
const judge = (recognition: Recognition, recording: MetronomeRecording, bagpipeName: string) => {
  const warnings: string[] = [];
  const seconds = recording.samples.length / recording.sampleRate;
  if (seconds < 1) return { error: 'The recording is too short.', warnings };
  if (recognition.soundingSeconds < 1) {
    return { error: 'No sound came from the microphone. Check that the right microphone is selected.', warnings };
  }
  if (recognition.fit < 0.5) {
    return {
      error: `What was played does not match the notes of the ${bagpipeName}. Check the bagpipe type and play closer to the microphone.`,
      warnings,
    };
  }
  if (recognition.notes.length < 3) return { error: 'Fewer than 3 notes were heard.', warnings };
  if (recognition.fit < 0.75) {
    warnings.push('Some of the sound did not match the bagpipe’s notes, so check the result carefully.');
  }
  return { warnings };
};

const green = '#009879';

const Page = styled.div`
  width: 100%;
  max-width: 640px;
  display: flex;
  flex-direction: column;
  align-items: stretch;

  h1 {
    text-align: center;
  }

  .hint {
    margin-top: 0;
    color: #555;
    line-height: 1.4;
  }

  .warning {
    color: #b45309;
  }
`;

const Settings = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin: 8px 0 16px;

  label {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 14px;
    color: #333;
  }

  select,
  input {
    font-size: 16px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 6px;
    background: white;
  }
`;

const Recording = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin: 0 0 16px;

  .status {
    font-size: 18px;
  }

  .file {
    padding: 8px 16px;
    border: 1px solid ${green};
    border-radius: 18px;
    background: white;
    color: ${green};
    font-size: 15px;
    cursor: pointer;
  }
`;

const RoundButton = styled.button`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;

  &.record {
    background: #d32f2f;
  }

  &.stop {
    background: #333;
  }

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

const Beats = styled.div`
  display: flex;
  gap: 10px;

  span {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: #ddd;
  }

  .on {
    background: ${green};
  }

  .accent {
    background: #d32f2f;
  }
`;

const Level = styled.div`
  width: 240px;
  height: 8px;
  border-radius: 4px;
  background: #eee;
  overflow: hidden;

  span {
    display: block;
    height: 100%;
    background: ${green};
    transition: width 0.1s;
  }

  .clip {
    background: #d32f2f;
  }
`;

const ResultBox = styled.div`
  border-radius: 10px;
  padding: 4px 16px 16px;
  margin-bottom: 32px;

  &.ok {
    background: #e7f6f2;
  }

  &.failed {
    background: #fdecea;
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 16px;
  }

  .download {
    color: ${green};
  }

  .tempo {
    display: flex;
    flex-direction: column;
    gap: 4px;
    max-width: 240px;
    margin-bottom: 12px;
    font-size: 14px;

    input {
      font-size: 16px;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 6px;
      background: white;
    }
  }

  .open {
    padding: 10px 18px;
    border: none;
    border-radius: 18px;
    background: ${green};
    color: white;
    font-size: 16px;
    cursor: pointer;
  }
`;
