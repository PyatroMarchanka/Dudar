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

type SamplerUrls = { [note: string]: string };

const samplerUrls = {
  openDuda: openDudaUrls,
  belTrad: belTradUrls,
  dudelsack: dudelsackUrls,
  polish: polishUrls,
  flute: fluteUrls,
};

type SamplerKey = keyof typeof samplerUrls;

const createSampler = (urls: SamplerUrls) => new Tone.Sampler({ urls, baseUrl: "/" }).toDestination();

let samplers = {} as Record<SamplerKey, Tone.Sampler>;

// Samplers are tied to the AudioContext they were made on, so they are
// rebuilt whenever the context is replaced after the app was in the
// background. The samples come back from the browser cache.
const createSamplers = () => {
  Object.values(samplers).forEach((oldSampler) => oldSampler.dispose());
  samplers = (Object.keys(samplerUrls) as SamplerKey[]).reduce((acc, key) => {
    acc[key] = createSampler(samplerUrls[key]);
    return acc;
  }, {} as Record<SamplerKey, Tone.Sampler>);
};

createSamplers();
onAudioContextReset(createSamplers);
watchAudioContext();

const getSampler = (bagpipeType: BagpipeTypes): Tone.Sampler => {
  switch (bagpipeType) {
    case BagpipeTypes.BelarusianTraditionalDuda:
      return samplers.belTrad;
    case BagpipeTypes.Dudelsack:
    case BagpipeTypes.Highlander:
      return samplers.dudelsack;
    case BagpipeTypes.Polish:
      return samplers.polish;
    case BagpipeTypes.TinWhistle:
      return samplers.flute;
    default:
      return samplers.openDuda;
  }
};

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
