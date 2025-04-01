import { useContext, useEffect, useState } from "react";
import { store } from "../context";
import { bagpipes } from "../dataset/bagpipes";
import { NotesMap } from "../utils/drawUtils/drawBagpipe";
import { getSongNotesWithOctaveFromMidi, transposeNoteWithOctave } from "../utils/midiUtils";
import { SharpNotesEnum } from "../interfaces";

export const useNotesNames = () => {
  const {
    state: { transpose, midiData, bagpipeType, isMusicSheets },
    setSongNotes,
  } = useContext(store);

  const [notesNamesMap, setNotesNamesMap] = useState<{
    bagpipeNotes: SharpNotesEnum[];
    notesMap: NotesMap;
  }>([] as any);
  const linesYpositions = bagpipes[bagpipeType].holesPositions.linesYPositions;

  useEffect(() => {
    if (!midiData) {
      return;
    }

    const bagpipeNotes = getSongNotesWithOctaveFromMidi(midiData!);
    const transposedNotes = bagpipeNotes.map((note) => transposeNoteWithOctave(note, transpose));

    const notesMap = bagpipeNotes.reduce((acc, cur, i) => {
      acc.push({
        note: transposedNotes[i].slice(0, -1),
        yPos: linesYpositions[bagpipes[bagpipeType].notesToLines[cur]],
      });
      return acc;
    }, [] as NotesMap);
    setNotesNamesMap({ notesMap, bagpipeNotes });
    setSongNotes(transposedNotes);
  }, [midiData, transpose, bagpipeType, isMusicSheets]);

  return notesNamesMap;
};
