import { Note } from "@tonejs/midi/dist/Note";
import { useContext, useEffect, useState } from "react";
import { store } from "../context";

const screenWitdh = 3000;

const getNotesChunks = (notes: Note[]) => {
  const result: Note[][] = [[]];
  let min = 0;
  let max = screenWitdh;

  notes.forEach((note) => {
    if (note.ticks > min && note.ticks <= max) {
      result[result.length - 1].push(note);
    } else if (note.ticks > max) {
      min = max;
      max += screenWitdh;
      result.push([]);
    }
  });

  return result;
};

export const useNotesMoving = () => {
  const {
    state: { midiData, isPlaying },
  } = useContext(store);

  const [chunkedNotes, setChunkedNotes] = useState<Note[][]>([]);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [tick, setTick] = useState(0);
  const [nextNotes, setNextNotes] = useState<Note[] | undefined>([]);
  const [nextToNextNotes, setNextToNextNotes] = useState<Note[] | undefined>(
    []
  );

  useEffect(() => {
    const lastNote = nextNotes?.[nextNotes.length - 1];

    if (lastNote?.ticks && lastNote?.ticks < tick - 400) {
      setNextNotes(chunkedNotes[currentChunkIndex + 1] || []);
      setNextToNextNotes(chunkedNotes[currentChunkIndex + 2] || []);
      setCurrentChunkIndex(currentChunkIndex + 1);
    }
  }, [tick]);

  useEffect(() => {
    if (midiData) {
      const notes = midiData?.tracks[0].notes;
      const chunks = getNotesChunks(notes);
      setChunkedNotes(chunks);
      setNextNotes(chunks[0]);
      setNextToNextNotes(chunks[1]);
      setCurrentChunkIndex(0);
    }
  }, [midiData, isPlaying]);

  return {
    tick,
    setTick: (tick: number) => setTick(tick),
    nextNotes,
    nextToNextNotes,
    setNextNotes,
  };
};
