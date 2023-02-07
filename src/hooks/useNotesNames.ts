import { useContext, useEffect, useState } from "react";
import { store } from "../context";
import { bagpipes } from "../dataset/bagpipes";
import { NotesMap } from "../utils/drawUtils/drawBagpipe";
import {
  getSongNotesWithOctaveFromMidi,
  transposeNoteWithOctave,
} from "../utils/midiUtils";

export const useNotesNames = () => {
  const {
    state: { transpose, midiData, bagpipeType },
    setSongNotes,
  } = useContext(store);

  const [notesNamesMap, setNotesNamesMap] = useState<NotesMap>({});

  useEffect(() => {
    if (!midiData) {
      return;
    }

    const bagpipeNotes = getSongNotesWithOctaveFromMidi(midiData!);
    const transposedNotes = bagpipeNotes.map((note) =>
      transposeNoteWithOctave(note, transpose)
    );

    const notesMap = bagpipeNotes.reduce((acc, cur, i) => {
      acc[transposedNotes[i] as string] =
        bagpipes[bagpipeType].notesToLines[cur];
      return acc;
    }, {} as NotesMap);

    setNotesNamesMap(notesMap);
    setSongNotes(transposedNotes);
  }, [midiData, transpose, bagpipeType]);

  return notesNamesMap;
};
