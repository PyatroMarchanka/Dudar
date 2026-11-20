import { TimeSignatures } from '../../dataset/songs/interfaces';
import { BagpipeTypes } from '../../interfaces';
import { MelodyRoll } from '../midiUtils/melodyRoll';
import { MetronomeRecording } from './recorder';
import { createZip } from './zip';
import { encodeWav } from './wav';

// One recorded take of the training dataset: the audio and what was played,
// known from the song, so the notes are labelled without any hand work. The
// times in labels.json are seconds from the start of audio.wav. They are where
// the app asked for each note; the player's own timing differs a little, which
// the alignment step before training corrects.

export interface TakeInfo {
  songId: string;
  songName: string;
  songType: string;
  // The bagpipe being played into the microphone
  bagpipeType: BagpipeTypes;
  // The pipe's key: pitch class of its tonic (9 = A)
  tonic: number;
  // Semitones from the written notes (for an A pipe) to this pipe
  keyTranspose: number;
  bpm: number;
  timeSignature: TimeSignatures;
  countInBars: number;
  guideMelody: boolean;
  clicksDuringTune: boolean;
  dronesOn: boolean;
  // Free text: which microphone, which room
  setup: string;
  roll: MelodyRoll;
  recording: MetronomeRecording;
  // Seconds into the recording where the first click was played, and the
  // seconds the melody was due to start after it
  firstClickSeconds: number;
  tuneStartSeconds: number;
}

const slug = (text: string) =>
  text
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
    .slice(0, 40) || 'song';

const stamp = (date: Date) => {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}-${pad(date.getHours())}${pad(
    date.getMinutes()
  )}${pad(date.getSeconds())}`;
};

export const takeName = (info: Pick<TakeInfo, 'songName' | 'bagpipeType'>, date = new Date()) =>
  `${slug(info.songName)}-${info.bagpipeType}-${stamp(date)}`;

export const buildLabels = (info: TakeInfo, recordedAt = new Date()) => {
  const { roll, recording, bpm, keyTranspose } = info;
  const secondsPerTick = 60 / (bpm * roll.ppq);
  return {
    version: 1,
    recordedAt: recordedAt.toISOString(),
    song: { id: info.songId, name: info.songName, type: info.songType },
    bagpipeType: info.bagpipeType,
    tonic: info.tonic,
    keyTranspose: info.keyTranspose,
    bpm,
    timeSignature: info.timeSignature,
    ppq: roll.ppq,
    countInBars: info.countInBars,
    guideMelody: info.guideMelody,
    clicksDuringTune: info.clicksDuringTune,
    dronesOn: info.dronesOn,
    setup: info.setup,
    audio: {
      file: 'audio.wav',
      sampleRate: recording.sampleRate,
      seconds: recording.samples.length / recording.sampleRate,
    },
    firstClickSeconds: info.firstClickSeconds,
    tuneStartSeconds: info.tuneStartSeconds,
    // The output latency of the browser at the time: where the player heard the click
    latencySeconds: recording.latencySeconds,
    // pitch: MIDI pitch written for an A pipe, like the catalog files;
    // sounding: what the pipe plays (pitch + keyTranspose)
    notes: roll.notes.map(([pitch, tick, duration]) => ({
      pitch,
      sounding: pitch + keyTranspose,
      startTick: tick,
      durationTicks: duration,
      start: info.tuneStartSeconds + tick * secondsPerTick,
      end: info.tuneStartSeconds + (tick + duration) * secondsPerTick,
    })),
  };
};

export const canWriteToFolder = () => typeof (window as any).showDirectoryPicker === 'function';

export const chooseFolder = async (): Promise<any> => (window as any).showDirectoryPicker({ mode: 'readwrite' });

const writeFile = async (directory: any, name: string, data: Blob | string) => {
  const handle = await directory.getFileHandle(name, { create: true });
  const writable = await handle.createWritable();
  await writable.write(data);
  await writable.close();
};

// Writes the take as a folder `<name>/` with audio.wav and labels.json inside the chosen folder
export const saveTakeToFolder = async (folder: any, info: TakeInfo) => {
  const name = takeName(info);
  const directory = await folder.getDirectoryHandle(name, { create: true });
  await writeFile(directory, 'audio.wav', encodeWav(info.recording.samples, info.recording.sampleRate));
  await writeFile(directory, 'labels.json', JSON.stringify(buildLabels(info), null, 2));
  return name;
};

// Downloads the take as `<name>.zip`
export const downloadTake = async (info: TakeInfo) => {
  const name = takeName(info);
  const encoder = new TextEncoder();
  const wav = new Uint8Array(await encodeWav(info.recording.samples, info.recording.sampleRate).arrayBuffer());
  const zip = createZip([
    { name: `${name}/audio.wav`, data: wav },
    { name: `${name}/labels.json`, data: encoder.encode(JSON.stringify(buildLabels(info), null, 2)) },
  ]);
  const url = URL.createObjectURL(zip);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${name}.zip`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
  return name;
};
