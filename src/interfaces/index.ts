import { AllNotes } from "./../dataset/notes";

export enum Modes {
  Mixolidian = "mixolidian",
  Ionian = "ionian",
  Eolian = "eolian",
  Dorian = "dorian",
}

export type Notes =
  | "A"
  | "A#"
  | "Bb"
  | "B"
  | "C"
  | "C#"
  | "Db"
  | "D"
  | "D#"
  | "Eb"
  | "E"
  | "F"
  | "F#"
  | "Gb"
  | "G"
  | "G#"
  | "Ab";

export type SharpNotes =
  | "A"
  | "A#"
  | "B"
  | "C"
  | "C#"
  | "D"
  | "D#"
  | "E"
  | "F"
  | "F#"
  | "G"
  | "G#";
type SharpMap = {
  [key: string]: Notes;
};

export const convertToSharp = (note: Notes): SharpNotes => {
  const map: SharpMap = {
    Bb: "A#",
    Db: "C#",
    Eb: "D#",
    Gb: "F#",
    Ab: "G#",
  };

  return (note in map ? map[note as keyof SharpMap] : note) as SharpNotes;
};

export function transposeNote(note: SharpNotes, step: number): SharpNotes {
  let indexOfNote = AllNotes.indexOf(note);
  if (step < 0) {
    const index = (indexOfNote + step) % AllNotes.length;

    return AllNotes[index >= 0 ? index : 12 + index];
  }

  return AllNotes[(indexOfNote + step) % AllNotes.length];
}

export const convertMidiPitchToNote = (midiPitch: number) => {
  const note = midiPitch % 12;
  const octave = Math.floor(midiPitch / 12) - 1;
  return { note: AllNotes[note], octave };
};
