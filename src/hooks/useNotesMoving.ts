import { Note } from "@tonejs/midi/dist/Note";
import { useContext, useEffect, useState, useMemo, useRef } from "react";
import { sizes } from "../constants/style";
import { store } from "../context";

const getNotesChunks = (notes: Note[], canvasWidth: number) => {
  const result: Note[][] = [[]];
  const chunkSize = canvasWidth / 2;
  const buffer = chunkSize * 0.5; // 50% buffer for smooth transitions
  
  let min = 0;
  let max = chunkSize;
  let minWithBuffer = -buffer;
  let maxWithBuffer = max + buffer;
  let currentChunk = 0;

  for (let i = 0; i < notes.length; i++) {
    const note = notes[i];
    const noteStart = note.ticks;
    const noteEnd = noteStart + note.durationTicks;
    
    // Move to next chunk if note is beyond current chunk
    while (noteStart > maxWithBuffer) {
      min = max;
      max += chunkSize;
      minWithBuffer = min - buffer;
      maxWithBuffer = max + buffer;
      currentChunk++;
      result.push([]);
    }
    
    // Include note if it's within range or extends into chunk
    if (
      (noteStart >= minWithBuffer && noteStart <= maxWithBuffer) || 
      (noteStart < min && noteEnd > min)
    ) {
      result[currentChunk].push(note);
    }
  }

  return result;
};

export const useNotesMoving = () => {
  const {
    state: { midiData, isPlaying, progress, screenSize, loop },
  } = useContext(store);
  const chunkedNotesRef = useRef<Note[][]>([]);
  const currentChunkIndexRef = useRef(0);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [tick, setTick] = useState(0);
  const [previousPreviousNotes, setPreviousPreviousNotes] = useState<Note[] | undefined>([]);
  const [previousNotes, setPreviousNotes] = useState<Note[] | undefined>([]);
  const [nextNotes, setNextNotes] = useState<Note[] | undefined>([]);
  const [nextToNextNotes, setNextToNextNotes] = useState<Note[] | undefined>([]);
  const [nextToNextToNextNotes, setNextToNextToNextNotes] = useState<Note[] | undefined>([]);
  
  // Keep ref in sync with state
  useEffect(() => {
    currentChunkIndexRef.current = currentChunkIndex;
  }, [currentChunkIndex]);

  useEffect(() => {
    const chunkedNotes = chunkedNotesRef.current;
    if (!progress || !chunkedNotes.length) {
      return;
    }

    const newIndex = Math.floor((chunkedNotes.length * (progress.percent - 1)) / 100);
    const currentIndex = currentChunkIndexRef.current;
    
    // Only update if index actually changed
    if (newIndex !== currentIndex) {
      setCurrentChunkIndex(newIndex);
      setPreviousPreviousNotes(chunkedNotes[newIndex - 2] || []);
      setPreviousNotes(chunkedNotes[newIndex - 1] || []);
      setNextNotes(chunkedNotes[newIndex] || []);
      setNextToNextNotes(chunkedNotes[newIndex + 1] || []);
      setNextToNextToNextNotes(chunkedNotes[newIndex + 2] || []);
    }
  }, [progress]);

  useEffect(() => {
    if (!isPlaying) return;
    
    const chunkedNotes = chunkedNotesRef.current;
    const currentIndex = currentChunkIndexRef.current;
    const currentNextNotes = chunkedNotes[currentIndex];
    
    if (!currentNextNotes || currentNextNotes.length === 0) return;
    
    const lastNote = currentNextNotes[currentNextNotes.length - 1];
    if (lastNote?.ticks && lastNote.ticks < tick - lastNote.durationTicks) {
      const newIndex = currentIndex + 1;
      setPreviousPreviousNotes(chunkedNotes[newIndex - 2] || []);
      setPreviousNotes(chunkedNotes[newIndex - 1] || []);
      setNextNotes(chunkedNotes[newIndex] || []);
      setNextToNextNotes(chunkedNotes[newIndex + 1] || []);
      setNextToNextToNextNotes(chunkedNotes[newIndex + 2] || []);
      setCurrentChunkIndex(newIndex);
    }
  }, [tick, isPlaying]);

  // Memoize canvas width calculation
  const canvasWidthInTicks = useMemo(() => {
    return (screenSize.width < sizes.maxCanvasWidth
      ? screenSize.width
      : sizes.maxCanvasWidth) / sizes.notesScale;
  }, [screenSize.width]);

  useEffect(() => {
    if (midiData && isPlaying) {
      const tracks = midiData?.tracks.filter((track) => track.notes.length);
      if (!tracks || tracks.length === 0) return;
      
      const notes = tracks[0].notes;
      const chunks = getNotesChunks(notes, canvasWidthInTicks);
      
      chunkedNotesRef.current = chunks;
      setPreviousPreviousNotes([]);
      setPreviousNotes([]);
      setNextNotes(chunks[0] || []);
      setNextToNextNotes(chunks[1] || []);
      setNextToNextToNextNotes(chunks[2] || []);
      setCurrentChunkIndex(0);
    }
  }, [midiData, isPlaying, canvasWidthInTicks]);

  return {
    tick,
    setTick,
    previousPreviousNotes,
    previousNotes,
    nextNotes,
    nextToNextNotes,
    nextToNextToNextNotes,
    setNextNotes,
  };
};
