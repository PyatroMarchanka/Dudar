import { Note } from "@tonejs/midi/dist/Note";
import { useContext, useEffect, useState } from "react";
import { store } from "../context";

export const useNotesMoving = () => {
  const {
    state: { midiData },
  } = useContext(store);

  const [tick, setTick] = useState(0);
  const [nextNotes, setNextNotes] = useState<Note[] | undefined>([]);

  useEffect(() => {
    setNextNotes(midiData?.tracks[0].notes);
  }, [midiData]);

  return {
    tick,
    setTick: (tick: number) => setTick(tick),
    nextNotes,
    setNextNotes,
  };
};
