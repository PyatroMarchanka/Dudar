import * as Tone from "tone";

const sampler = new Tone.Sampler({
  urls: {
    "A#2": "samples/A2.mp3",
    "A#3": "samples/A3.mp3",
    "A#4": "samples/A4.mp3",
    "A#5": "samples/A5.mp3",
  },
  baseUrl: "",
  onload: () => {
    // sampler.triggerAttackRelease(["C3"],4);
  },
}).toDestination();

export const playNote = (note?: string) => {
  if (note) {
    sampler.triggerAttack([note]);
  }
};

export const stopNote = (note?: string) => {
  if (note) {
    sampler.triggerRelease([note]);
  }
};
