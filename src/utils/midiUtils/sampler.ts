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

export const playNote = (note?: string, volume = 0.5) => {
  if (note) {
    sampler.triggerAttack([note], undefined, volume);
  }
};

export const stopNote = (note?: string) => {
  if (note) {
    sampler.triggerRelease([note]);
  }
};

export const droneFileLengthMs = 60400;
