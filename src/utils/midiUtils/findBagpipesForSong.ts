import { Midi } from "@tonejs/midi";
import { BagpipeTypes, SharpNotes, SharpNotesEnum } from "../../interfaces";
import { bagpipes } from "../../dataset/bagpipes";

export const getSongNotesFromMidi = (midi: Midi): SharpNotes[] => {
  const notes = midi?.tracks.filter((track) => track.notes.length)[0].notes;
  const notesObject = {} as any;

  if (!notes) {
    return [];
  }

  notes.forEach((note) => {
    if (!(note.pitch in notesObject)) {
      notesObject[note.pitch] = note.pitch;
    }
  });

  return Object.keys(notesObject) as SharpNotes[];
};

export const getSongNotesWithOctaveFromMidi = (midi: Midi): SharpNotesEnum[] => {
  const notes = midi?.tracks.filter((track) => track.notes.length)[0].notes;
  const notesObject = {} as any;

  if (!notes) {
    return [];
  }

  notes.forEach((note) => {
    const noteWthOctave = note.pitch + note.octave;
    if (!(noteWthOctave in notesObject)) {
      notesObject[noteWthOctave] = noteWthOctave;
    }
  });

  return Object.keys(notesObject) as SharpNotesEnum[];
};

export const findBagpipesForSong = (midi: Midi): BagpipeTypes[] => {
  const notesFromMidi = getSongNotesWithOctaveFromMidi(midi);
  const bagpipeNotesMaps = Object.values(BagpipeTypes).map((bagpipeType) =>
    Object.entries(bagpipes[bagpipeType].notesMap)
  );
};
