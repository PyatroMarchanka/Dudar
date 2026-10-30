import { BagpipeTypes } from "./../../interfaces/index";
import * as Tone from "tone";
import { onAudioContextReset, resumeAudio, watchAudioContext } from "../audioContext";

const openDudaUrls = {
  A3: "samples/A2.mp3",
  "D#3": "samples/D#2.mp3",
  A4: "samples/A3.mp3",
  C5: "samples/C4.mp3",
  E5: "samples/E4.mp3",
  A5: "samples/A4.mp3",
};

const belTradUrls = {
  "A#4": "samples/bd/A#3.mp3",
  A5: "samples/bd/A4.mp3",
  B5: "samples/bd/B4.mp3",
  C4: "samples/bd/C3.mp3",
  C5: "samples/bd/C4.mp3",
  D5: "samples/bd/D4.mp3",
  E5: "samples/bd/E4.mp3",
  F5: "samples/bd/F4.mp3",
  G4: "samples/bd/G3.mp3",
  G5: "samples/bd/G4.mp3",
};

const dudelsackUrls = {
  "A#4": "samples/ddl/A#4.mp3",
  A4: "samples/ddl/A4.mp3",
  B4: "samples/ddl/B4.mp3",
  "C#5": "samples/ddl/C#5.mp3",
  C5: "samples/ddl/C5.mp3",
  "D#5": "samples/ddl/D#5.mp3",
  D5: "samples/ddl/D5.mp3",
  E5: "samples/ddl/E5.mp3",
  "F#5": "samples/ddl/F#5.mp3",
  G2: "samples/ddl/G3.mp3",
  G5: "samples/ddl/G5.mp3",
};

const polishUrls = {
  "A#4": "samples/polish-duda/A#3.mp3",
  B4: "samples/polish-duda/B3.mp3",
  E5: "samples/polish-duda/E4.mp3",
  "C#5": "samples/polish-duda/C#4.mp3",
  "D#5": "samples/polish-duda/D#4.mp3",
  "F#4": "samples/polish-duda/F#3.mp3",
  "F#5": "samples/polish-duda/F#4.mp3",
  B3: "samples/polish-duda/B1.mp3",
  'G#5': "samples/polish-duda/G#4.mp3",
};

const fluteUrls = {
  F4: "samples/flute-samples/F4.mp3",
  "G#4": "samples/flute-samples/G#4.mp3",
  C5: "samples/flute-samples/C5.mp3",
  G5: "samples/flute-samples/G5.mp3",
  "A#5": "samples/flute-samples/A#5.mp3",
  "D#6": "samples/flute-samples/D#6.mp3",
};

const samplerUrls = {
  openDuda: openDudaUrls,
  belTrad: belTradUrls,
  dudelsack: dudelsackUrls,
  polish: polishUrls,
  flute: fluteUrls,
};

type SamplerKey = keyof typeof samplerUrls;

type SamplerEntry = { sampler: Tone.Sampler; loaded: Promise<void> };

// Samplers are made on first use, one per bagpipe sound set, so only the
// samples of the chosen bagpipe are downloaded. Loading every set at once
// (about 15 MB) made the chosen one arrive late on a slow connection and the
// first notes of a song played silently.
let samplers: Partial<Record<SamplerKey, SamplerEntry>> = {};

const createSampler = (key: SamplerKey): SamplerEntry => {
  let sampler: Tone.Sampler;
  const loaded = new Promise<void>((resolve) => {
    sampler = new Tone.Sampler({
      urls: samplerUrls[key],
      baseUrl: "/",
      onload: () => resolve(),
      onerror: () => resolve(),
    }).toDestination();
  });
  return { sampler: sampler!, loaded };
};

const getSamplerKey = (bagpipeType: BagpipeTypes): SamplerKey => {
  switch (bagpipeType) {
    case BagpipeTypes.BelarusianTraditionalDuda:
      return "belTrad";
    case BagpipeTypes.Dudelsack:
    case BagpipeTypes.Highlander:
      return "dudelsack";
    case BagpipeTypes.Polish:
      return "polish";
    case BagpipeTypes.TinWhistle:
      return "flute";
    default:
      return "openDuda";
  }
};

const getSamplerEntry = (bagpipeType: BagpipeTypes): SamplerEntry => {
  const key = getSamplerKey(bagpipeType);
  if (!samplers[key]) {
    samplers[key] = createSampler(key);
  }
  return samplers[key]!;
};

// The URLs a bagpipe's samples are fetched from, encoded the way Tone.js
// encodes them, so they can be saved for offline use under the same keys.
export const getSampleUrls = (bagpipeType: BagpipeTypes): string[] =>
  Object.values(samplerUrls[getSamplerKey(bagpipeType)]).map(
    (path) => "/" + path.split("/").map(encodeURIComponent).join("/")
  );

// Starts downloading the samples of a bagpipe, resolving once they are ready.
export const loadSampler = (bagpipeType: BagpipeTypes): Promise<void> => getSamplerEntry(bagpipeType).loaded;

// Samplers are tied to the AudioContext they were made on, so they are
// rebuilt whenever the context is replaced after the app was in the
// background. The samples come back from the browser cache.
const rebuildSamplers = () => {
  (Object.keys(samplers) as SamplerKey[]).forEach((key) => {
    samplers[key]!.sampler.dispose();
    samplers[key] = createSampler(key);
  });
};

onAudioContextReset(rebuildSamplers);
watchAudioContext();

const getSampler = (bagpipeType: BagpipeTypes): Tone.Sampler => getSamplerEntry(bagpipeType).sampler;

const getVelocity = (bagpipeType: BagpipeTypes, volume: number) => {
  switch (bagpipeType) {
    case BagpipeTypes.BelarusianTraditionalDuda:
      return 1;
    case BagpipeTypes.Polish:
      return volume + 1;
    default:
      return volume;
  }
};

export const playNote = (bagpipeType: BagpipeTypes, note?: string, volume = 0.5) => {
  const noteSampler = getSampler(bagpipeType);
  // A freshly rebuilt sampler is still loading its samples; triggering it
  // now would throw inside the player's event loop.
  if (!note || !noteSampler.loaded) {
    return;
  }
  if (noteSampler.context.state !== "running") {
    resumeAudio();
  }
  noteSampler.triggerAttack([note], undefined, getVelocity(bagpipeType, volume));
};

// Plays a note for a set time on the audio clock (the melody editor's preview).
// `time` is a Tone.js context time; nothing is played while samples still load.
export const playNoteFor = (bagpipeType: BagpipeTypes, note: string, time: number, duration: number, volume = 0.5) => {
  const noteSampler = getSampler(bagpipeType);
  if (!noteSampler.loaded) {
    return;
  }
  noteSampler.triggerAttackRelease(note, duration, time, getVelocity(bagpipeType, volume));
};

export const stopAllNotes = (bagpipeType: BagpipeTypes) => {
  getSampler(bagpipeType).releaseAll();
};

export const stopNote = (bagpipeType: BagpipeTypes, note?: string) => {
  if (!note) {
    return;
  }
  getSampler(bagpipeType).triggerRelease([note]);
};

export const bndDroneFileLengthMs = 60400;
export const bdDroneFileLengthMs = 33000;
export const ddlDroneFileLengthMs = 54000;
export const polishDroneFileLengthMs = 25000;

export const getDroneLength = (bagpipeType: BagpipeTypes) => {
  switch (bagpipeType) {
    case BagpipeTypes.BelarusianTraditionalDuda:
      return bdDroneFileLengthMs;
    case BagpipeTypes.BelarusianOpenDuda:
    case BagpipeTypes.BelarusianNONTraditionalDuda:
      return bndDroneFileLengthMs;
    case BagpipeTypes.Dudelsack:
      return ddlDroneFileLengthMs;
    case BagpipeTypes.Highlander:
      return ddlDroneFileLengthMs;
    case BagpipeTypes.Polish:
      return polishDroneFileLengthMs;
    default:
      return bndDroneFileLengthMs;
  }
};
