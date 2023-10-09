import { Midi } from "@tonejs/midi";
import { useContext, useEffect, useState } from "react";
import { store } from "../context";
import { Song } from "../dataset/songs/interfaces";
import { fallbackSong } from "./useLocalStorage";
import { addMetronome, fixMidiDataOctaves } from "../utils/midiUtils";

export const useLoadSong = () => {
  const {
    state: { activeSong, metronome, tempo, listsByBagpipe, bagpipeType },
    setMidi,
    setMidiData,
    setSongLength,
    setActiveSong,
    setIsSongLoading,
  } = useContext(store);

  const [lowestOctave, setLowestOctave] = useState(4);

  const loadMidiSong = async (song: Song) => {
    try {
      if (!song.pathName) {
        console.log(`No song with this path in list \n ${song.pathName}`);
        console.log(`Fallback to ${fallbackSong.name}`);

        listsByBagpipe && setActiveSong(listsByBagpipe[bagpipeType][0]);
      }
      setIsSongLoading(true);
      const file = await fetch(`midi/${song.pathName}`);
      const buffer = await file.arrayBuffer();

      const songWithMetronome = await addMetronome(buffer, song.timeSignature);

      const midi = new Midi(songWithMetronome);
      midi.header.setTempo(tempo / 2);

      setSongLength(midi.header.ticksToSeconds(midi.durationTicks));

      const { lowestOctave: lowestOctaveFromFile } = fixMidiDataOctaves(midi);
      setLowestOctave(lowestOctaveFromFile);
      setMidiData(midi);
      setMidi(songWithMetronome);
      setIsSongLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (activeSong) {
      loadMidiSong(activeSong);
    }
  }, [activeSong, metronome]);

  return { lowestOctave };
};
