import { Note } from "@tonejs/midi/dist/Note";
import { useContext, useEffect, useState } from "react";
import { sizes } from "../constants/style";
import { store } from "../context";

const getNotesChunks = (notes: Note[], canvasWidth: number) => {
  const result: Note[][] = [[]];
  let min = 0;
  let max = canvasWidth / 2;
  const chunkSize = canvasWidth / 2;
  const buffer = chunkSize * 0.5; // 50% buffer for smooth transitions

  notes.forEach((note) => {
    const noteStart = note.ticks;
    const noteEnd = note.ticks + note.durationTicks;
    
    // Include note if:
    // 1. It starts within chunk range (with buffer)
    // 2. It extends into the chunk (even if it started earlier)
    // 3. It starts shortly after to prevent pop-in
    if (
      (noteStart >= min - buffer && noteStart <= max + buffer) || 
      (noteStart < min && noteEnd > min)
    ) {
      result[result.length - 1].push(note);
    } else if (noteStart > max + buffer) {
      // Move to next chunk
      min = max;
      max += chunkSize;
      result.push([]);
      
      // Check if this note belongs to the new chunk (with buffer)
      if (
        (noteStart >= min - buffer && noteStart <= max + buffer) || 
        (noteStart < min && noteEnd > min)
      ) {
        result[result.length - 1].push(note);
      }
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
