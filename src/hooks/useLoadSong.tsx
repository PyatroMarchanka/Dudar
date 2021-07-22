import { Midi } from "@tonejs/midi";
import { useContext, useEffect } from "react";
import { store } from "../context";

export const useLoadSong = () => {
  const {
    state: { activeSong },
    setMidi,
    setMidiData,
  } = useContext(store);

  const loadMidiSong = async (fileName: string) => {
    const file = await fetch(`/midi/${fileName}`);
    const buffer = await file.arrayBuffer();
    const midi = new Midi(buffer);
    setMidiData(midi);
    setMidi(buffer);
  };

  useEffect(() => {
    if (activeSong) {
      loadMidiSong(activeSong);
    }
  }, [activeSong]);
};
