import { Note } from "@tonejs/midi/dist/Note";
import { useContext, useEffect, useState } from "react";
import { sizes } from "../constants/style";
import { store } from "../context";

const getNotesChunks = (notes: Note[], canvasWidth: number) => {
  const result: Note[][] = [[]];
  let min = 0;
  let max = canvasWidth / 2;

  notes.forEach((note) => {
    if (note.ticks >= min && note.ticks <= max) {
      result[result.length - 1].push(note);
    } else if (note.ticks > max) {
      min = max;
      max += canvasWidth;
      result.push([note]);
    }
  });

  return result;
};

export const useNotesMoving = () => {
  const {
    state: { midiData, isPlaying, progress, screenSize, loop },
  } = useContext(store);
  const [chunkedNotes, setChunkedNotes] = useState<Note[][]>([]);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [tick, setTick] = useState(0);
  const [nextNotes, setNextNotes] = useState<Note[] | undefined>([]);
  const [nextToNextNotes, setNextToNextNotes] = useState<Note[] | undefined>([]);

  useEffect(() => {
    const lastNote = nextNotes?.[nextNotes.length - 1];
    if (lastNote?.ticks && lastNote?.ticks < tick - lastNote.durationTicks) {
      const newIndex = chunkedNotes[currentChunkIndex + 1] ? currentChunkIndex + 1 : 0;
      setNextNotes(chunkedNotes[newIndex] || []);
      setNextToNextNotes(chunkedNotes[newIndex + 1] || []);
      setCurrentChunkIndex(newIndex);
    }
  }, [tick, isPlaying]);

  useEffect(() => {
    if (midiData && isPlaying) {
      const tracks = midiData?.tracks.filter((track) => track.notes.length);
      const notes = tracks[0].notes;
      const chunks = getNotesChunks(
        notes,
        (screenSize.width < sizes.maxCanvasWidth ? screenSize.width : sizes.maxCanvasWidth) /
          sizes.notesScale
      );
      setChunkedNotes(chunks);
      setNextNotes(chunks[0]);
      setNextToNextNotes(chunks[1]);
      setCurrentChunkIndex(0);
    }
  }, [midiData, isPlaying]);

  return {
    tick,
    setTick,
    nextNotes,
    nextToNextNotes,
    setNextNotes,
  };
};
