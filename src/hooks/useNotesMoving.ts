import { Midi } from "@tonejs/midi";
import { Note } from "@tonejs/midi/dist/Note";
import { useContext, useEffect, useState } from "react";
import { store } from "../context";

const screenWitdh = 1500;

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
    state: { midiData, isPlaying, progress },
  } = useContext(store);

  const [chunkedNotes, setChunkedNotes] = useState<Note[][]>([]);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [tick, setTick] = useState(0);
  const [nextNotes, setNextNotes] = useState<Note[] | undefined>([]);
  const [nextToNextNotes, setNextToNextNotes] = useState<Note[] | undefined>(
    []
  );

  useEffect(() => {
    if (!progress || !(progress % 10 === 0)) {
      return;
    }

    const newIndex = progress
      ? Math.floor((chunkedNotes.length * progress) / 100)
      : 0;
    setCurrentChunkIndex(newIndex);
    setNextNotes(chunkedNotes[newIndex] || []);
    setNextToNextNotes(chunkedNotes[newIndex + 1] || []);
  }, [progress]);

  useEffect(() => {
    const lastNote = nextNotes?.[nextNotes.length - 1];

    if (lastNote?.ticks && lastNote?.ticks < tick - 400) {
      setNextNotes(chunkedNotes[currentChunkIndex + 1] || []);
      setNextToNextNotes(chunkedNotes[currentChunkIndex + 2] || []);
      setCurrentChunkIndex(currentChunkIndex + 1);
    }
  }, [tick, isPlaying]);

  useEffect(() => {
    if (midiData && isPlaying) {
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
