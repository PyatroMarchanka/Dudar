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
  const [nextToNextNotes, setNextToNextNotes] = useState<Note[] | undefined>(
    []
  );
  const [previousNotes, setPreviousNotes] = useState<Note[] | undefined>([]);

  useEffect(() => {
    if (!progress) {
      return;
    }

    const newIndex = progress
      ? Math.floor((chunkedNotes.length * (progress.percent - 1)) / 100)
      : 0;
    setCurrentChunkIndex(newIndex);
    setPreviousNotes(chunkedNotes[newIndex - 1] || []);
    setNextNotes(chunkedNotes[newIndex] || []);
    setNextToNextNotes(chunkedNotes[newIndex + 1] || []);
  }, [progress]);

  useEffect(() => {
    const lastNote = nextNotes?.[nextNotes.length - 1];
    if (lastNote?.ticks && lastNote?.ticks < tick - lastNote.durationTicks ) {
      setPreviousNotes(chunkedNotes[currentChunkIndex] || []);
      setNextNotes(chunkedNotes[currentChunkIndex + 1] || []);
      setNextToNextNotes(chunkedNotes[currentChunkIndex + 2] || []);
      setCurrentChunkIndex(currentChunkIndex + 1);
    }
  }, [tick, isPlaying]);

  useEffect(() => {
    if (midiData && isPlaying) {
      const tracks = midiData?.tracks.filter((track) => track.notes.length);
      const notes = tracks[0].notes;

      const chunks = getNotesChunks(
        notes,
        (screenSize.width < sizes.maxCanvasWidth
          ? screenSize.width
          : sizes.maxCanvasWidth) / sizes.notesScale
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
    previousNotes,
    nextNotes,
    nextToNextNotes,
    setNextNotes,
  };
};
