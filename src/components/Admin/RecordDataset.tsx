import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import styled from 'styled-components';
import * as Tone from 'tone';
import { adminSongsApi } from '../../api/adminSongs';
import { songApi } from '../../api/songClient';
import { store } from '../../context';
import { bagpipes } from '../../dataset/bagpipes';
import { Song, SongListBySongType } from '../../dataset/songs/interfaces';
import { BagpipeTypes, SharpNotes } from '../../interfaces';
import { prepareAudioForPlayback } from '../../utils/audioContext';
import {
  canWriteToFolder,
  chooseFolder,
  downloadTake,
  saveTakeToFolder,
  TakeInfo,
} from '../../utils/audioToMidi/datasetTake';
import {
  countTakesInFolder,
  folderPermission,
  loadLocalCounts,
  recallFolder,
  rememberFolder,
  saveLocalCounts,
  TakeCounts,
} from '../../utils/audioToMidi/datasetFolder';
import { createMetronomeRecorder, MetronomeRecording } from '../../utils/audioToMidi/recorder';
import { encodeWav } from '../../utils/audioToMidi/wav';
import {
  isMelodyRoll,
  keyToTranspose,
  MAX_ROLL_BPM,
  MelodyRoll,
  MIN_ROLL_BPM,
  transposeToKey,
} from '../../utils/midiUtils/melodyRoll';
import { midiToRoll } from '../../utils/midiUtils/midiToRoll';
import { loadSampler, playNoteFor, stopAllNotes } from '../../utils/midiUtils/sampler';
import { pitchToNoteName } from '../MelodyEditor/usePreview';
import { MidiPlayer } from '../../utils/MidiPlayer';
import { sortSongsBySongType } from '../../utils/songlistUtils';
import { convertMidiPitchToNote } from '../../utils/midiUtils';
import { useRollSong } from '../../hooks/useRollSong';
import { useDimensions } from '../../hooks/useDimensions';
import { BackCanvas } from '../Canvas/BackCanvas';
import { DynamicCanvas } from '../Canvas/DynamicCanvas';
import { StaticCanvas } from '../Canvas/StaticCanvas';
import { mainColors } from '../../utils/theme';

const KEY_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const SETUP_KEY = 'datasetSetup';
const NEEDED_KEY = 'datasetTakesNeeded';
const HELP_CLOSED_KEY = 'datasetHelpClosed';
const DEFAULT_TAKES_NEEDED = 2;
const SCHEDULE_AHEAD_SECONDS = 0.3;
// Recording goes on this long after the last note, for it to die away
const TAIL_SECONDS = 1.5;

type Phase = 'idle' | 'starting' | 'recording' | 'review' | 'saving';

interface Take {
  recording: MetronomeRecording;
  info: Omit<TakeInfo, 'setup' | 'dronesOn' | 'recording'>;
  settings: { dronesOn: boolean };
  audioUrl: string;
}

const loadRoll = async (song: Song, fallbackBagpipe: BagpipeTypes): Promise<MelodyRoll> => {
  if (song.source === 'melody') {
    const full = song.melody?.roll || !song._id ? song : await adminSongsApi.get(song._id);
    if (full.melody?.format !== 'roll' || !isMelodyRoll(full.melody.roll)) {
      throw new Error('This melody is stored as ABC, not as notes, so it can not be used here.');
    }
    return full.melody.roll;
  }
  const file = await songApi.getSong(song);
  return midiToRoll(await file.arrayBuffer(), {
    bagpipeType: song.bagpipesToPlay?.[0] ?? fallbackBagpipe,
    timeSignature: song.timeSignature,
    bpm: song.originalTempo ? Math.round(Number(song.originalTempo) / 2) : undefined,
  }).roll;
};

const readNeeded = () => {
  try {
    const value = Number(localStorage.getItem(NEEDED_KEY));
    return value >= 1 && value <= 10 ? value : DEFAULT_TAKES_NEEDED;
  } catch (error) {
    return DEFAULT_TAKES_NEEDED;
  }
};

const readHelpOpen = () => {
  try {
    return localStorage.getItem(HELP_CLOSED_KEY) !== '1';
  } catch (error) {
    return true;
  }
};

const readSetup = () => {
  try {
    return localStorage.getItem(SETUP_KEY) ?? '';
  } catch (error) {
    return '';
  }
};

// Admin page /admin/dataset: records training takes. The app plays a catalog
// tune in the headphones (count-in, metronome, the melody), the admin plays it
// into the microphone, and each take is saved with the notes it was meant to
// contain, so no hand labelling is needed.
export const RecordDataset = () => {
  const { t } = useTranslation('translation');
  const {
    state: { bagpipeType, transpose, activeSong, midi, midiData, songLength, tempo, isSongUnavailable },
    setBagpipeType,
    setTranspose,
    setIsPlaying,
    setActiveSong,
    setMidi,
    setMidiData,
    setSongLength,
    setTempo,
    setIsSongUnavailable,
  } = useContext(store);
  const settingsBagpipe = bagpipeType;
  useDimensions();

  const [songs, setSongs] = useState<Song[]>([]);
  const [songsError, setSongsError] = useState<string>();
  const [search, setSearch] = useState('');
  const [song, setSong] = useState<Song | null>(null);
  const [roll, setRoll] = useState<MelodyRoll | null>(null);
  const [rollState, setRollState] = useState<'none' | 'loading' | 'ready' | 'error'>('none');
  const [rollError, setRollError] = useState<string>();

  const [bpmText, setBpmText] = useState('80');
  const [countInBars, setCountInBars] = useState(1);
  const [guideMelody, setGuideMelody] = useState(true);
  const [clicksDuringTune, setClicksDuringTune] = useState(true);
  const [dronesOn, setDronesOn] = useState(true);
  const [setup, setSetup] = useState(readSetup);

  const [phase, setPhase] = useState<Phase>('idle');
  const [beat, setBeat] = useState<{ beat: number; bar: number } | null>(null);
  const [level, setLevel] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [take, setTake] = useState<Take | null>(null);
  const [error, setError] = useState<string>();
  const [folder, setFolder] = useState<any>(null);
  // A folder from an earlier visit that the browser wants a click to open again
  const [pendingFolder, setPendingFolder] = useState<any>(null);
  const [saved, setSaved] = useState<string[]>([]);
  const [counts, setCounts] = useState<TakeCounts>(loadLocalCounts);
  const [counting, setCounting] = useState(false);
  const [takesNeeded, setTakesNeeded] = useState(readNeeded);
  const [onlyNeeded, setOnlyNeeded] = useState(false);
  const [helpOpen, setHelpOpen] = useState(readHelpOpen);

  const recorderRef = useRef<ReturnType<typeof createMetronomeRecorder>>();
  const startedAtRef = useRef(0);
  const cleanupRef = useRef<() => void>(() => {});
  const stopRef = useRef<() => void>(() => {});
  const [activeNote, setActiveNote] = useState<{ note: SharpNotes; octave: number } | null>(null);
  const ticksPerMsRef = useRef(0);
  // The canvases of the play screen follow a player's clock; this one is driven by the recording's
  const guidePlayer = useMemo(
    () => ({ handleNotesMoving: undefined, getTicksPerMs: () => ticksPerMsRef.current, setTick: () => {} }),
    []
  );

  const bpm = Math.min(MAX_ROLL_BPM, Math.max(MIN_ROLL_BPM, Math.round(Number(bpmText)) || roll?.bpm || 80));
  // The bagpipe and its key are the player's own settings, so the bricks and the notes' names match them
  const tonic = transposeToKey(transpose);
  const keyTranspose = keyToTranspose(tonic, transpose);
  ticksPerMsRef.current = roll ? (bpm * roll.ppq) / 60000 : 0;
  // The melody at the tempo set here, as the play screen's bricks
  const viewRoll = useMemo(() => (roll ? { ...roll, bpm } : undefined), [roll, bpm]);
  useRollSong(viewRoll, song?.name);
  const beatsPerBar = roll ? Number(roll.timeSignature.split('/')[0]) : 4;
  const bagpipeName = (type: BagpipeTypes) => t(`dudas.${bagpipes[type]?.name}`);

  useEffect(() => {
    adminSongsApi
      .list()
      .catch(() => songApi.getSongList())
      .then((list) => setSongs([...list].sort((a, b) => a.name.localeCompare(b.name))))
      .catch((err) => {
        console.log(err);
        setSongsError('Could not load the songs');
      });
  }, []);

  // Leaving the page stops the microphone, the metronome and the melody
  useEffect(
    () => () => {
      cleanupRef.current();
      recorderRef.current?.cancel();
    },
    []
  );

  // The page borrows the player's state (song, notes) to draw the bagpipe; put it back when leaving
  const previousRef = useRef({ activeSong, midi, midiData, songLength, tempo, isSongUnavailable });
  useEffect(
    () => () => {
      const previous = previousRef.current;
      setIsPlaying(false);
      setActiveSong(previous.activeSong);
      if (previous.midi) setMidi(previous.midi);
      if (previous.midiData) setMidiData(previous.midiData);
      if (previous.songLength !== undefined) setSongLength(previous.songLength);
      if (previous.tempo !== undefined) setTempo(previous.tempo);
      setIsSongUnavailable(!!previous.isSongUnavailable);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const selectSong = (selected: Song) => {
    setSong(selected);
    // The selected song and the Record button are at the top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setOpenGroups((value) => ({ ...value, [selected.type]: true }));
    setRoll(null);
    setRollError(undefined);
    setRollState('loading');
    loadRoll(selected, settingsBagpipe)
      .then((loaded) => {
        setRoll(loaded);
        setBpmText(String(loaded.bpm));
        setRollState('ready');
      })
      .catch((err) => {
        console.log(err);
        setRollError(err?.message || 'Could not load the song');
        setRollState('error');
      });
  };

  const tuneSeconds = useMemo(() => {
    if (!roll) return 0;
    const end = Math.max(0, ...roll.notes.map(([, tick, duration]) => tick + duration));
    return (end * 60) / (bpm * roll.ppq);
  }, [roll, bpm]);

  const record = async () => {
    if (!roll || !song) return;
    setError(undefined);
    setTake((previous) => {
      if (previous) URL.revokeObjectURL(previous.audioUrl);
      return null;
    });
    setBeat(null);
    setLevel(0);
    setElapsed(0);
    setPhase('starting');
    try {
      if (setup !== readSetup()) {
        try {
          localStorage.setItem(SETUP_KEY, setup);
        } catch (err) {}
      }
      // The melody plays through Tone's audio context, the recording and clicks use their own: the
      // recorder relates the two clocks
      await prepareAudioForPlayback(loadSampler(bagpipeType));
      const context = Tone.getContext().rawContext as AudioContext;
      const recorder = createMetronomeRecorder();
      recorderRef.current = recorder;
      const countInBeats = countInBars * beatsPerBar;
      const { firstClickTime, clickSeconds, contextOffset } = await recorder.start(bpm, roll.timeSignature, {
        syncWith: context,
        onBeat: (beatInBar, bar) => setBeat({ beat: beatInBar, bar }),
        onLevel: setLevel,
        muteClicksFromBeat: clicksDuringTune ? Infinity : countInBeats,
      });
      startedAtRef.current = Date.now();

      // The melody is handed to the audio clock a little ahead, so Stop never leaves much scheduled
      const secondsPerTick = 60 / (bpm * roll.ppq);
      // On Tone's clock, which is what the melody is scheduled on
      const tuneStart = firstClickTime + contextOffset + countInBeats * clickSeconds;
      const queue = guideMelody ? roll.notes : [];
      let next = 0;
      const schedule = () => {
        const horizon = context.currentTime + SCHEDULE_AHEAD_SECONDS;
        while (next < queue.length) {
          const [pitch, tick, duration] = queue[next];
          const time = tuneStart + tick * secondsPerTick;
          if (time > horizon) return;
          playNoteFor(bagpipeType, pitchToNoteName(pitch, keyTranspose), time, duration * secondsPerTick);
          next++;
        }
      };
      schedule();
      // What the play screen shows: the bricks moving with the melody and the hole that sounds now
      const ticksPerSecond = (bpm * roll.ppq) / 60;
      let noteIndex = 0;
      let shownNote: number | null = null;
      const showPosition = () => {
        // The picture is what the player hears, so the audio's output delay is taken off
        const tick = (context.currentTime - (context.outputLatency || 0) - tuneStart) * ticksPerSecond;
        (guidePlayer as any).handleNotesMoving?.(tick);
        while (noteIndex + 1 < roll.notes.length && roll.notes[noteIndex + 1][1] <= tick) noteIndex++;
        const current = roll.notes[noteIndex];
        const sounding = current && tick >= current[1] && tick < current[1] + current[2] ? noteIndex : null;
        if (sounding !== shownNote) {
          shownNote = sounding;
          setActiveNote(sounding === null ? null : convertMidiPitchToNote(roll.notes[sounding][0]));
        }
      };
      const timer = window.setInterval(() => {
        schedule();
        showPosition();
        setElapsed((Date.now() - startedAtRef.current) / 1000);
        if (context.currentTime > tuneStart + tuneSeconds + TAIL_SECONDS) stopRef.current();
      }, 40);
      cleanupRef.current = () => {
        window.clearInterval(timer);
        stopAllNotes(bagpipeType);
        (guidePlayer as any).handleNotesMoving?.(0);
        setActiveNote(null);
        setIsPlaying(false);
        cleanupRef.current = () => {};
      };
      setIsPlaying(true);
      setPhase('recording');
    } catch (err: any) {
      console.log(err);
      cleanupRef.current();
      recorderRef.current?.cancel();
      setError(
        err?.name === 'NotAllowedError'
          ? 'The browser did not allow the microphone. Allow it for this site and try again.'
          : 'Could not start the recording.'
      );
      setPhase('idle');
    }
  };

  const stop = async () => {
    const recorder = recorderRef.current;
    if (!recorder || !roll || !song) return;
    recorderRef.current = undefined;
    cleanupRef.current();
    const recording = await recorder.stop();
    const firstClickSeconds = recording.firstBeatSeconds - recording.latencySeconds;
    const clickSeconds = (60 / bpm) * (4 / Number(roll.timeSignature.split('/')[1]));
    setTake({
      recording,
      settings: { dronesOn },
      audioUrl: URL.createObjectURL(encodeWav(recording.samples, recording.sampleRate)),
      info: {
        songId: song.id || song._id || '',
        songName: song.name,
        songType: song.type,
        bagpipeType,
        tonic,
        keyTranspose,
        bpm,
        timeSignature: roll.timeSignature,
        countInBars,
        guideMelody,
        clicksDuringTune,
        roll,
        firstClickSeconds,
        tuneStartSeconds: firstClickSeconds + countInBars * beatsPerBar * clickSeconds,
      },
    });
    setPhase('review');
  };
  stopRef.current = stop;

  // Uses the folder from now on, and counts the takes already in it
  const adoptFolder = async (handle: any) => {
    setFolder(handle);
    setPendingFolder(null);
    setCounting(true);
    try {
      setCounts(await countTakesInFolder(handle));
    } catch (err) {
      console.log(err);
      setError('Could not read the takes in the folder.');
    }
    setCounting(false);
  };

  const pickFolder = async () => {
    try {
      const chosen = await chooseFolder();
      rememberFolder(chosen);
      await adoptFolder(chosen);
      return chosen;
    } catch (err: any) {
      // Closing the picker is not an error
      if (err?.name !== 'AbortError') setError('Could not open the folder.');
      return null;
    }
  };

  const reconnectFolder = async () => {
    if (pendingFolder && (await folderPermission(pendingFolder, true))) await adoptFolder(pendingFolder);
  };

  // The folder from the last visit, when the browser lets the page use it without asking
  useEffect(() => {
    if (!canWriteToFolder()) return;
    let cancelled = false;
    (async () => {
      const handle = await recallFolder();
      if (!handle || cancelled) return;
      if (await folderPermission(handle, false)) {
        if (!cancelled) adoptFolder(handle);
      } else {
        setPendingFolder(handle);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = async () => {
    if (!take) return;
    setError(undefined);
    const info: TakeInfo = { ...take.info, recording: take.recording, setup, dronesOn: take.settings.dronesOn };
    try {
      let target = folder;
      if (!target && canWriteToFolder()) {
        target = await pickFolder();
        if (!target) return;
      }
      setPhase('saving');
      const name = target ? await saveTakeToFolder(target, info) : await downloadTake(info);
      setSaved((list) => [name, ...list]);
      const next = { ...counts, [info.songId]: (counts[info.songId] ?? 0) + 1 };
      setCounts(next);
      if (!target) saveLocalCounts(next);
      URL.revokeObjectURL(take.audioUrl);
      setTake(null);
      setPhase('idle');
    } catch (err) {
      console.log(err);
      setError('Could not save the take. Try choosing the folder again.');
      setPhase('review');
    }
  };

  const discard = () => {
    if (take) URL.revokeObjectURL(take.audioUrl);
    setTake(null);
    setPhase('idle');
  };

  const takesOf = (item: Song) => counts[item.id || item._id || ''] ?? 0;
  // Takes that count towards the target: more than needed on a song don't make up for another song
  const countedTakes = (item: Song) => Math.min(takesOf(item), takesNeeded);
  const totalNeeded = songs.length * takesNeeded;
  const totalDone = songs.reduce((sum, item) => sum + countedTakes(item), 0);
  const songsDone = songs.filter((item) => takesOf(item) >= takesNeeded).length;

  // The catalog as in the player: by kind of song (country, origin), open the one you pick from
  const searching = search.trim() !== '';
  const groups = useMemo<SongListBySongType>(() => {
    const term = search.trim().toLowerCase();
    return sortSongsBySongType(
      songs.filter(
        (item) =>
          (!term || item.name.toLowerCase().includes(term)) &&
          (!onlyNeeded || (counts[item.id || item._id || ''] ?? 0) < takesNeeded)
      )
    );
  }, [songs, search, onlyNeeded, counts, takesNeeded]);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const busy = phase === 'starting' || phase === 'recording' || phase === 'saving';
  const countInBeats = countInBars * beatsPerBar;
  const inCountIn = beat ? beat.bar * beatsPerBar + beat.beat < countInBeats : false;

  return (
    <Page>
      <h1>Record for dataset</h1>

      <Top>
        {phase === 'recording' || phase === 'starting' ? (
          <div className="song">Recording…</div>
        ) : (
          <>
            <div className="song">
              {song ? (
                <>
                  <strong className="name">{song.name}</strong>
                  <div className="details">
                    {t(`genres.${song.type}`, song.type)}
                    {roll && (
                      <>
                        {' '}
                        · {roll.timeSignature} · {roll.notes.length} notes · about {formatTime(tuneSeconds)}
                      </>
                    )}
                  </div>
                  <div className="details">
                    Takes: {takesOf(song)} of {takesNeeded}
                    {takesOf(song) >= takesNeeded ? ' · done' : ''}
                  </div>
                </>
              ) : (
                'Choose a song below'
              )}
            </div>
            <RoundButton className="record" onClick={record} disabled={rollState !== 'ready' || phase === 'saving'}>
              {take ? 'Record again' : 'Record'}
            </RoundButton>
            {rollState === 'loading' && <p>Loading the song…</p>}
            {rollState === 'error' && <p className="warning">{rollError}</p>}
          </>
        )}
        {error && <p className="warning">{error}</p>}
      </Top>

      {(phase === 'recording' || phase === 'starting') && (
        <Overlay>
          <BackCanvas />
          <DynamicCanvas player={guidePlayer as unknown as MidiPlayer} />
          <StaticCanvas activeHole={activeNote} />
          <Shield />
          <Bar>
            <Beats>
              {Array.from({ length: beatsPerBar }, (_, i) => (
                <span key={i} className={beat?.beat === i ? (i === 0 ? 'on accent' : 'on') : undefined} />
              ))}
            </Beats>
            <div className="info">
              <div className="status">
                {!beat ? 'Starting…' : inCountIn ? 'Count-in' : `Play · bar ${beat.bar + 1 - countInBars}`} ·{' '}
                {formatTime(elapsed)}
              </div>
              <Level aria-label="Microphone level">
                <span
                  style={{ width: `${Math.min(100, level * 100)}%` }}
                  className={level > 0.98 ? 'clip' : undefined}
                />
              </Level>
              {level > 0.98 && <div className="warning">Too loud: move the microphone further away.</div>}
            </div>
            <RoundButton className="stop small" onClick={stop} disabled={phase !== 'recording'}>
              Stop
            </RoundButton>
          </Bar>
        </Overlay>
      )}

      {take && (phase === 'review' || phase === 'saving') && (
        <Review>
          <h2>Check the take</h2>
          <Waveform recording={take.recording} info={take.info} />
          <audio controls src={take.audioUrl} />
          {peak(take.recording.samples) < 0.01 && (
            <p className="warning">Almost no sound was recorded. Check the microphone.</p>
          )}
          <div className="actions">
            <button className="primary" onClick={save} disabled={phase === 'saving'}>
              {phase === 'saving' ? 'Saving…' : 'Save take'}
            </button>
            <button onClick={discard} disabled={phase === 'saving'}>
              Discard
            </button>
          </div>
          <p className="hint">
            Green lines are where the app asked for each note, the red line is the first click. The sound should follow
            the green lines closely.
          </p>
        </Review>
      )}

      <Accordion
        expanded={helpOpen}
        onChange={(_, open) => {
          setHelpOpen(open);
          try {
            localStorage.setItem(HELP_CLOSED_KEY, open ? '0' : '1');
          } catch (err) {}
        }}
        className="help"
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <strong>How to record</strong>
        </AccordionSummary>
        <AccordionDetails className="help-body">
          <div>
            <p>
              These takes teach the app to recognize bagpipe notes. You play a catalog tune along with the app, and
              because the app knows which notes it is, every take is labelled by itself.
            </p>
            <h4>One take, step by step</h4>
            <ol>
              <li>Put on headphones. If the app’s sound gets into the microphone, the take is spoiled.</li>
              <li>
                Check the settings: the bagpipe and the key of your pipe (the same as in the player’s settings), and the
                tempo.
              </li>
              <li>Pick a song in the list. The page scrolls up and shows the song, with its takes done of needed.</li>
              <li>
                Press <strong>Record</strong>. You hear a count-in, then the melody and the metronome. The bagpipe on
                screen shows what to play. Play along as written; it stops by itself after the last note.
              </li>
              <li>
                Check the take: the green lines are where the notes were due, and the sound should follow them. Press{' '}
                <strong>Save take</strong>, or <strong>Discard</strong> if you stopped, stumbled badly or there was a
                loud noise. Small slips are fine.
              </li>
            </ol>
            <h4>How many takes</h4>
            <ul>
              <li>
                <strong>{takesNeeded} takes of every song</strong> (you can change the number in the settings). The
                counter next to each song shows takes done / needed, and it turns green when the song is finished.
              </li>
              <li>
                Take 1 at the song’s own tempo. Take 2 about 15% slower or faster: change the Tempo field before it.
              </li>
              <li>
                About <strong>30 to 40 different songs</strong>, around 1.5 to 2 hours in total. More different songs is
                better than many takes of one song.
              </li>
              <li>Pick songs from different groups, and some quick and some slow.</li>
            </ul>
            <h4>How to play</h4>
            <ul>
              <li>
                Play with the drones on, as you normally do. For a few songs, record one take with the drones off.
              </li>
              <li>Play your usual ornaments and your usual style. Don’t try to play cleaner than normal.</li>
              <li>
                Play every note of the tune, as written. Don’t skip parts, and keep going when you make a small mistake.
              </li>
              <li>
                Now and then change the microphone or the room (phone, laptop, another room), and write it in
                “Microphone and place”.
              </li>
              <li>Play every bagpipe you have: change the bagpipe in the settings before you record it.</li>
            </ul>
            <h4>Where the takes go</h4>
            <p>
              Each take is saved in the folder you choose (Chrome or Edge), or downloaded as a zip in other browsers.
              Nothing goes to the server. After the first 10 to 15 takes, tell Claude in the project chat so the labels
              can be checked before you record the rest.
            </p>
          </div>
        </AccordionDetails>
      </Accordion>

      <Section>
        <h2>Settings</h2>
        <Settings>
          <label>
            Bagpipe you play (as in the player's settings)
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
            Key of your pipe
            <select
              value={tonic}
              disabled={busy}
              onChange={(event) => setTranspose(keyToTranspose(Number(event.target.value), transpose))}
            >
              {KEY_NAMES.map((name, value) => (
                <option key={name} value={value}>
                  {name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Tempo (quarter notes per minute)
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
            Count-in
            <select
              value={countInBars}
              disabled={busy}
              onChange={(event) => setCountInBars(Number(event.target.value))}
            >
              <option value={1}>1 bar of clicks</option>
              <option value={2}>2 bars of clicks</option>
            </select>
          </label>
          <label>
            Takes needed per song
            <select
              value={takesNeeded}
              disabled={busy}
              onChange={(event) => {
                const value = Number(event.target.value);
                setTakesNeeded(value);
                try {
                  localStorage.setItem(NEEDED_KEY, String(value));
                } catch (err) {}
              }}
            >
              {[1, 2, 3, 4, 5].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
          <label>
            Microphone and place (saved with each take)
            <input
              type="text"
              value={setup}
              placeholder="e.g. phone, living room"
              disabled={busy}
              onChange={(event) => setSetup(event.target.value)}
            />
          </label>
        </Settings>
        <Checks>
          <label>
            <input
              type="checkbox"
              checked={guideMelody}
              disabled={busy}
              onChange={(e) => setGuideMelody(e.target.checked)}
            />{' '}
            Play the melody in the headphones
          </label>
          <label>
            <input
              type="checkbox"
              checked={clicksDuringTune}
              disabled={busy}
              onChange={(e) => setClicksDuringTune(e.target.checked)}
            />{' '}
            Keep clicking while the melody plays
          </label>
          <label>
            <input type="checkbox" checked={dronesOn} disabled={busy} onChange={(e) => setDronesOn(e.target.checked)} />{' '}
            Drones are on
          </label>
        </Checks>
        <p className="hint">
          Wear headphones, so the app’s sound is not in the recording. Play the tune as written, in the key above (the
          notes are moved to your pipe’s key), with your usual ornaments.
        </p>

        <h3>Where takes are saved</h3>
        {canWriteToFolder() ? (
          <p>
            {folder ? (
              <>
                Folder: <strong>{folder.name}</strong>{' '}
              </>
            ) : pendingFolder ? (
              <>
                Your folder <strong>{pendingFolder.name}</strong> from the last visit:{' '}
                <button className="link" onClick={reconnectFolder} disabled={busy}>
                  open it again
                </button>{' '}
                (the takes in it are counted).{' '}
              </>
            ) : (
              'Not chosen yet: the browser asks when you save the first take. '
            )}
            <button className="link" onClick={pickFolder} disabled={busy}>
              {folder ? 'Change folder' : 'Choose folder'}
            </button>
          </p>
        ) : (
          <p>
            This browser can’t write to a folder, so each take downloads as a zip file. Chrome or Edge can save to a
            folder.
          </p>
        )}
        {saved.length > 0 && (
          <p className="hint">
            Saved in this visit: {saved.length}. Last: {saved[0]}
          </p>
        )}
      </Section>

      <Section>
        <h2>Song</h2>
        <input
          type="search"
          className="search"
          placeholder="Search songs"
          value={search}
          disabled={busy}
          onChange={(event) => setSearch(event.target.value)}
        />
        <p className="hint">
          {counting
            ? 'Counting the takes in the folder…'
            : `Takes done: ${totalDone} of ${totalNeeded}. Songs finished: ${songsDone} of ${songs.length}.`}
        </p>
        <label className="only">
          <input type="checkbox" checked={onlyNeeded} onChange={(event) => setOnlyNeeded(event.target.checked)} /> Only
          songs that still need takes
        </label>
        {songsError && <p className="warning">{songsError}</p>}
        {Object.keys(groups).map((type) => (
          <Accordion
            key={type}
            expanded={searching || !!openGroups[type]}
            onChange={(_, open) => setOpenGroups((value) => ({ ...value, [type]: open }))}
            className="group"
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <strong>{t(`genres.${type}`, type)}</strong>
              <span className="count" title="Takes done of takes needed in this group">
                {groups[type].reduce((sum, item) => sum + countedTakes(item), 0)} / {groups[type].length * takesNeeded}
              </span>
            </AccordionSummary>
            <AccordionDetails className="songs">
              {groups[type].map((item) => (
                <button
                  key={item._id || item.id}
                  className={song && (song._id || song.id) === (item._id || item.id) ? 'active' : undefined}
                  disabled={busy}
                  onClick={() => selectSong(item)}
                >
                  {item.name}
                  <span>
                    {item.timeSignature}
                    <b
                      className={takesOf(item) >= takesNeeded ? 'takes done' : 'takes'}
                      title="Takes done of takes needed"
                    >
                      {takesOf(item)} / {takesNeeded}
                    </b>
                  </span>
                </button>
              ))}
            </AccordionDetails>
          </Accordion>
        ))}
        {!Object.keys(groups).length && !songsError && (
          <p className="hint">{songs.length ? 'No songs found' : 'Loading…'}</p>
        )}
      </Section>
    </Page>
  );
};

const peak = (samples: Float32Array) => {
  let max = 0;
  for (let i = 0; i < samples.length; i += 16) max = Math.max(max, Math.abs(samples[i]));
  return max;
};

const formatTime = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;

// The recorded sound with a line at each note the app asked for
const Waveform = ({ recording, info }: { recording: MetronomeRecording; info: Take['info'] }) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const width = canvas.clientWidth * 2;
    const height = 120;
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context) return;
    const { samples, sampleRate } = recording;
    const seconds = samples.length / sampleRate;
    const perColumn = Math.max(1, Math.floor(samples.length / width));
    context.clearRect(0, 0, width, height);
    context.fillStyle = '#0a7c68';
    for (let x = 0; x < width; x++) {
      let max = 0;
      for (let i = x * perColumn; i < Math.min(samples.length, (x + 1) * perColumn); i += 4) {
        max = Math.max(max, Math.abs(samples[i]));
      }
      const h = Math.min(1, max * 1.5) * (height / 2);
      context.fillRect(x, height / 2 - h, 1, Math.max(1, h * 2));
    }
    const secondsPerTick = 60 / (info.bpm * info.roll.ppq);
    context.fillStyle = 'rgba(0, 170, 60, 0.9)';
    info.roll.notes.forEach(([, tick]) => {
      context.fillRect(Math.round(((info.tuneStartSeconds + tick * secondsPerTick) / seconds) * width), 0, 2, height);
    });
    context.fillStyle = 'rgba(211, 47, 47, 0.9)';
    context.fillRect(Math.round((info.firstClickSeconds / seconds) * width), 0, 2, height);
  }, [recording, info]);

  return <canvas ref={ref} style={{ width: '100%', height: 60, background: '#f4f4f4', borderRadius: 6 }} />;
};

const green = '#009879';

// The play screen's bagpipe with its bricks, over the whole window while recording
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1200;
  background-color: ${mainColors.lightestGrey};
`;

// Keeps touches off the bricks (they can be dragged on the play screen)
const Shield = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
`;

const Bar = styled.div`
  position: absolute;
  z-index: 2;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 10px 16px 16px;
  background: rgba(252, 247, 242, 0.92);

  .info {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 140px;
  }

  .status {
    font-size: 16px;
  }

  .warning {
    color: #b45309;
    font-size: 13px;
  }
`;

const Page = styled.div`
  width: 100%;
  max-width: 640px;
  display: flex;
  flex-direction: column;
  align-items: stretch;

  h1 {
    text-align: center;
  }

  h2 {
    font-size: 18px;
    margin: 0 0 8px;
  }

  h3 {
    font-size: 15px;
    margin: 16px 0 4px;
  }

  .warning {
    color: #b45309;
  }

  .hint {
    color: #555;
    font-size: 14px;
    line-height: 1.4;
  }

  .link {
    border: none;
    background: none;
    color: ${green};
    cursor: pointer;
    font-size: inherit;
    text-decoration: underline;
    padding: 0;
  }
`;

const Top = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;

  .status {
    font-size: 18px;
  }

  .song {
    text-align: center;
  }

  .song .name {
    font-size: 22px;
  }

  .song .details {
    margin-top: 4px;
    color: #555;
    font-size: 14px;
  }
`;

const Section = styled.section`
  margin: 12px 0 20px;

  .help {
    box-shadow: none;
    border: 1px solid #cfe5df;
    border-radius: 6px;
    background: #f1f7f5;
    margin-bottom: 8px;
  }

  .help::before {
    display: none;
  }

  .help-body {
    font-size: 14px;
    line-height: 1.45;
    color: #333;
  }

  .help-body p {
    margin: 0 0 8px;
  }

  .help-body h4 {
    margin: 12px 0 4px;
    font-size: 15px;
  }

  .help-body ul,
  .help-body ol {
    margin: 0 0 8px;
    padding-left: 20px;
  }

  .help-body li {
    margin-bottom: 4px;
  }

  .group {
    margin-top: 8px;
    box-shadow: none;
    border: 1px solid #ddd;
    border-radius: 6px;
  }

  .group::before {
    display: none;
  }

  .count {
    margin-left: 8px;
    color: #777;
  }

  .songs {
    display: flex;
    flex-direction: column;
    padding: 0;
  }

  .songs button {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    padding: 10px 16px;
    border: none;
    border-top: 1px solid #eee;
    background: white;
    font-size: 15px;
    text-align: left;
    cursor: pointer;
  }

  .songs button span {
    color: #777;
    font-size: 13px;
    white-space: nowrap;
  }

  .songs .takes {
    margin-left: 10px;
    font-weight: normal;
    color: #b45309;
  }

  .songs .takes.done {
    color: ${green};
  }

  .only {
    display: block;
    margin: 4px 0 8px;
    font-size: 14px;
  }

  .songs button.active {
    background: #e7f6f2;
    font-weight: bold;
  }

  .search {
    width: 100%;
    box-sizing: border-box;
    font-size: 16px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 6px;
  }
`;

const Review = styled.div`
  background: #f1f7f5;
  border-radius: 10px;
  padding: 12px 16px 8px;
  margin-bottom: 16px;

  audio {
    width: 100%;
    margin: 8px 0;
  }

  .actions {
    display: flex;
    gap: 12px;
  }

  button {
    padding: 10px 18px;
    border-radius: 18px;
    border: 1px solid ${green};
    background: white;
    color: ${green};
    font-size: 16px;
    cursor: pointer;
  }

  .primary {
    background: ${green};
    color: white;
  }

  button:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

const Settings = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;

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

const Checks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 12px 0 4px;
  font-size: 15px;
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

  &.small {
    width: 72px;
    height: 72px;
    font-size: 16px;
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
