import { Midi } from "@tonejs/midi";
import { useContext, useEffect } from "react";
import { store } from "../context";
import { fixMidiDataOctaves } from "../utils/midiUtils";

export const useLoadSong = () => {
  const {
    state: { activeSong, genreList, allLists },
    setMidi,
    setMidiData,
  } = useContext(store);

  const loadMidiSong = async (fileName: string) => {
    try {
      if (
        Object.keys(allLists).length &&
        genreList &&
        !allLists[genreList].includes(fileName)
      ) {
        console.log(
          `No song with this path in list \n ${genreList}/${fileName}`
        );
        return;
      }

      console.log(`Song exists in list \n ${genreList}/${fileName}`);

      console.log(`LoadMidiSong midi/${genreList}/${fileName}`);
      const file = await fetch(`midi/${genreList}/${fileName}`);
      const buffer = await file.arrayBuffer();
      const midi = new Midi(buffer);
      console.log("midi", midi);
      setMidiData(fixMidiDataOctaves(midi));
      setMidi(buffer);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (activeSong) {
      loadMidiSong(activeSong);
    }
  }, [activeSong, genreList, allLists]);
};
