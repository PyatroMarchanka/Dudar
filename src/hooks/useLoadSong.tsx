import { Midi } from "@tonejs/midi";
import { useContext, useEffect } from "react";
import { store } from "../context";
import { fixMidiDataOctaves } from "../utils/midiUtils";

export const useLoadSong = () => {
  const {
    state: { activeSong, genreList },
    setMidi,
    setMidiData,
  } = useContext(store);

  const loadMidiSong = async (fileName: string) => {
    const file = await fetch(`midi/${genreList}/${fileName}`);
    const buffer = await file.arrayBuffer();
    const midi = new Midi(buffer);
    setMidiData(fixMidiDataOctaves(midi));
    setMidi(buffer);
  };

  useEffect(() => {
    if (activeSong) {
      loadMidiSong(activeSong);
    }
  }, [activeSong, genreList]);
};
