import { AllNotes } from "../../dataset/notes";
import { Notes, SharpMap, SharpNotes, SharpNotesEnum } from "../../interfaces";

export function transposeNote(note: SharpNotes, step: number): SharpNotes {
  let indexOfNote = AllNotes.indexOf(note);
  if (step < 0) {
    const index = (indexOfNote + step) % AllNotes.length;

    return AllNotes[index >= 0 ? index : 12 + index];
  }

  return AllNotes[(indexOfNote + step) % AllNotes.length];
}

export function transposeNoteWithOctave(note: SharpNotesEnum, step: number): SharpNotesEnum {
  let pitch = note.slice(0, -1);
  let octave = +note.slice(-1);
  let indexOfNote = AllNotes.indexOf(pitch as SharpNotes);
  const newIndexOfNote = indexOfNote + step;

  if (newIndexOfNote < 0) {
    octave -= 1;
  }
  if (newIndexOfNote > 11) {
    octave += 1;
  }

  if (step < 0) {
    const index = (indexOfNote + step) % AllNotes.length;

    return (AllNotes[index >= 0 ? index : 12 + index] + octave) as SharpNotesEnum;
  }

  return (AllNotes[(indexOfNote + step) % AllNotes.length] + octave) as SharpNotesEnum;
}

export const convertMidiPitchToNote = (midiPitch: number) => {
  const note = midiPitch % 12;
  const octave = Math.floor(midiPitch / 12) - 1;
  return { note: AllNotes[note], octave };
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
