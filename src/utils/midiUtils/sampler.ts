import { BagpipeTypes } from "./../../interfaces/index";
import * as Tone from "tone";

const sampler = new Tone.Sampler({
  urls: {
    A3: "samples/A2.mp3",
    "D#3": "samples/D#2.mp3",
    A4: "samples/A3.mp3",
    C5: "samples/C4.mp3",
    E5: "samples/E4.mp3",
    A5: "samples/A4.mp3",
  },
  baseUrl: "/",
}).toDestination();

const belTradSamplerSampler = new Tone.Sampler({
  urls: {
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
  },
  baseUrl: "/",
}).toDestination();

const dudelsackSamplerSampler = new Tone.Sampler({
  urls: {
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
  },
  baseUrl: "/",
}).toDestination();


const polishSampler = new Tone.Sampler({
  urls: {
    "A#4": "samples/polish-duda/A#3.mp3",
    B4: "samples/polish-duda/B3.mp3",
    E5: "samples/polish-duda/E4.mp3",
    "C#5": "samples/polish-duda/C#4.mp3",
    "D#5": "samples/polish-duda/D#4.mp3",
    "F#4": "samples/polish-duda/F#3.mp3",
    "F#5": "samples/polish-duda/F#4.mp3",
    B3: "samples/polish-duda/B1.mp3",
    'G#5': "samples/polish-duda/G#4.mp3",
  },
  baseUrl: "/",
}).toDestination();

const resume = async (sampler: Tone.Sampler) => {
  if (sampler.context.state !== "running") {
    sampler.context.resume();
  }
};
export const playNote = (
  bagpipeType: BagpipeTypes,
  note?: string,
  volume = 0.5
) => {
  if (!note) {
    return;
  }

  switch (bagpipeType) {
    case BagpipeTypes.BelarusianTraditionalDuda:
      resume(belTradSamplerSampler);
      belTradSamplerSampler.triggerAttack([note], undefined, 1);
      break;
    case BagpipeTypes.BelarusianOpenDuda:
      resume(sampler);
      sampler.triggerAttack([note], undefined, volume);
      break;
    case BagpipeTypes.Dudelsack:
      resume(dudelsackSamplerSampler);
      dudelsackSamplerSampler.triggerAttack([note], undefined, volume);
      break;
    case BagpipeTypes.Highlander:
      resume(dudelsackSamplerSampler);
      dudelsackSamplerSampler.triggerAttack([note], undefined, volume);
      break;
    case BagpipeTypes.Polish:
      resume(polishSampler);
      polishSampler.triggerAttack([note], undefined, volume + 1);
      break;
    default:
      sampler.triggerAttack([note], undefined, volume);
  }
};

export const stopNote = (bagpipeType: BagpipeTypes, note?: string) => {
  if (!note) {
    return;
  }

  switch (bagpipeType) {
    case BagpipeTypes.BelarusianTraditionalDuda:
      belTradSamplerSampler.triggerRelease([note]);
      break;
    case BagpipeTypes.BelarusianOpenDuda:
      sampler.triggerRelease([note]);
      break;
    case BagpipeTypes.Dudelsack:
      dudelsackSamplerSampler.triggerRelease([note]);
      break;
    case BagpipeTypes.Highlander:
      dudelsackSamplerSampler.triggerRelease([note]);
      break;
    case BagpipeTypes.Polish:
      polishSampler.triggerRelease([note]);
      break;
    default:
      sampler.triggerRelease([note]);
  }
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
