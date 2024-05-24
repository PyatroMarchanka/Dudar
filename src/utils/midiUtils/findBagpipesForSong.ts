import { Midi } from "@tonejs/midi";
import { BagpipeTypes, SharpNotesEnum } from "../../interfaces";
import { bagpipes } from "../../dataset/bagpipes";
import _ from "lodash";

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

const bagpipeNotesMaps = Object.values(BagpipeTypes).map((bagpipeType) => ({
  bagpipeNotes: Object.keys(bagpipes[bagpipeType].notesMap),
  bagpipeType,
}));

export const findBagpipesForSong = (midi: Midi): BagpipeTypes[] => {
  const songNotesFromMidi = getSongNotesWithOctaveFromMidi(midi);
  const filteredBagpipesForSong = bagpipeNotesMaps.filter(
    ({ bagpipeNotes }) => !songNotesFromMidi.filter((note) => !bagpipeNotes.includes(note)).length
  );

  const bagpipesForSong = filteredBagpipesForSong.map(({ bagpipeType }) => bagpipeType);

  return bagpipesForSong;
};
