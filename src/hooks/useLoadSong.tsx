import { Midi } from "@tonejs/midi";
import { useCallback, useContext, useEffect, useState } from "react";
import { store } from "../context";
import { Song } from "../dataset/songs/interfaces";
import { addMetronome, fixMidiDataOctaves } from "../utils/midiUtils";
import { songApi } from "../api/songClient";
import { useParams } from "react-router-dom";
import {
  findSongInListById,
  getFirstSongFromList,
} from "../dataset/songs/utils";

export const useLoadSong = () => {
  const params: any = useParams();
  const {
    state: { activeSong, metronome, tempo, listsByBagpipe },
    setMidi,
    setMidiData,
    setSongLength,
    setActiveSong,
    setIsSongLoading,
  } = useContext(store);
  const [lowestOctave, setLowestOctave] = useState(4);

  useEffect(() => {
    if (!(params.id && listsByBagpipe)) return;

    const songFromParam = findSongInListById(params.id, listsByBagpipe);

    if (songFromParam) {
      setActiveSong(songFromParam);
    }
  }, [params.id, listsByBagpipe]);

  const loadMidiSong = useCallback(async (song: Song) => {
    try {
      if (!song.pathName) {
        console.log(`No song with this path in list \n ${song.pathName}`);

        listsByBagpipe && setActiveSong(getFirstSongFromList(listsByBagpipe));
      }
      setIsSongLoading(true);
      const file = await songApi.getSong(song);
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
      listsByBagpipe && setActiveSong(getFirstSongFromList(listsByBagpipe));
      console.log(error);
    }
  }, [listsByBagpipe]);

  useEffect(() => {
    if (activeSong) {
      loadMidiSong(activeSong);
    }
  }, [activeSong, metronome]);

  return { lowestOctave };
};
