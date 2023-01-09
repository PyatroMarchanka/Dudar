import { Midi } from "@tonejs/midi";
import { useContext, useEffect, useState } from "react";
import { store } from "../context";
import { addMetronome, fixMidiDataOctaves } from "../utils/midiUtils";

const fallbackSong = "belarusian/Verabey.mid";

export const useLoadSong = () => {
  const {
    state: { activeSong, allLists, metronome, tempo },
    setMidi,
    setMidiData,
    setSongLength,
    setActiveSong,
  } = useContext(store);

  const [lowestOctave, setLowestOctave] = useState(4);

  const loadMidiSong = async (fileName: string) => {
    try {
      let [genreList, songName] = fileName.split("/");

      if (
        Object.keys(allLists).length &&
        genreList &&
        !allLists[genreList]?.includes(songName)
      ) {
        console.log(`No song with this path in list \n ${fileName}`);
        console.log(`Fallback to ${fallbackSong}`);

        setActiveSong(fallbackSong);
      }

      const file = await fetch(`midi/${fileName}`);
      const buffer = await file.arrayBuffer();

      const songWithMetronome = await addMetronome(buffer);

      const midi = new Midi(songWithMetronome);
      midi.header.setTempo(tempo / 2);

      setSongLength(midi.header.ticksToSeconds(midi.durationTicks));

      const { lowestOctave: lowestOctaveFromFile } = fixMidiDataOctaves(midi);
      setLowestOctave(lowestOctaveFromFile);
      setMidiData(midi);
      setMidi(songWithMetronome);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (activeSong) {
      loadMidiSong(activeSong);
    }
  }, [activeSong, allLists, metronome]);

  return { lowestOctave };
};
