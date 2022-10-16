import { AllNotes } from "./../dataset/notes";
import { SharpNotes, convertToSharp, Notes } from "./../interfaces/index";
import { Midi } from "@tonejs/midi";
import { Note } from "@tonejs/midi/dist/Note";

export const transposeMidi = (
  midi: Midi,
  fromTone: SharpNotes,
  toTone: SharpNotes
) => {
  const result = midi?.tracks?.[0].notes.map((note: Note) => {});
};

const getLowestNoteInMidi = (midi: Midi) => {
  let lowest: { octave: number; note: SharpNotes };

  midi?.tracks?.[0].notes.forEach((note: Note) => {
    const sharpNote = convertToSharp(note.pitch as Notes);

    if (
      !lowest ||
      note.octave < lowest.octave ||
      (AllNotes.indexOf(sharpNote) < AllNotes.indexOf(lowest.note) &&
        note.octave === lowest.octave)
    ) {
      const newLowest = {
        note: sharpNote,
        octave: Number(note.octave),
      };
      lowest = newLowest;
    }
  });

  return lowest!;
};

const getHighestNoteInMidi = (midi: Midi) => {
  let highest: { octave: number; note: SharpNotes };

  midi?.tracks?.[0].notes.forEach((note: Note) => {
    const sharpNote = convertToSharp(note.pitch as Notes);

    if (
      !highest ||
      note.octave > highest.octave ||
      (AllNotes.indexOf(sharpNote) > AllNotes.indexOf(highest.note) &&
        note.octave === highest.octave)
    ) {
      const newLowest = {
        note: sharpNote,
        octave: Number(note.octave),
      };
      highest = newLowest;
    }
  });

  return highest!;
};

export const fixMidiDataOctaves = (midiData: Midi): Midi => {
  const octavesObject = {} as any;
  const notes = midiData?.tracks[0].notes;

  if (!notes) {
    return midiData;
  }

  notes.forEach((note) => {
    if (!(note.octave in octavesObject)) {
      octavesObject[note.octave] = note.octave;
    }
  });

  const octaves = Object.keys(octavesObject)
    .map((e) => +e)
    .sort((a: any, b: any) => a - b);

  if (octaves[0] !== 4 && octaves[1] !== 5) {
    midiData.tracks[0].notes = notes.map((note) => {
      if (octaves[0] < 4) {
        note.octave += 1;
        return note;
      } else {
        note.octave -= 1;
        return note;
      }
    });
  }

  return midiData;
};
