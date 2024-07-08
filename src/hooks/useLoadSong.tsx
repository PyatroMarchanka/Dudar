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
import { useSongList } from "./useSongLIst";
import { useSong } from "./useSong";

export const useLoadSong = () => {
  const params: any = useParams();
  const {
    state: { activeSong, metronome, tempo, listsByBagpipe },
    setMidi,
    setMidiData,
    setSongLength,
    setActiveSong,
    setIsSongLoading,
    setIsPlaying,
    setProgress,
  } = useContext(store);

  const onStop = () => {
    setIsPlaying(false);
    setProgress(100);
  };

  useSongList(onStop);

  const [lowestOctave, setLowestOctave] = useState(4);
  useSong();
  const songId = params.id;

  useEffect(() => {
    if (!(songId && listsByBagpipe)) return;

    const songFromParam = findSongInListById(songId, listsByBagpipe);
    if (songFromParam) {
      setActiveSong(songFromParam);
    }
  }, [songId]);

  const loadMidiSong = useCallback(
    async (song: Song) => {
      try {
        if (!song.pathName) {
          console.log(`No song with this path in list \n ${song.pathName}`);

          listsByBagpipe && setActiveSong(getFirstSongFromList(listsByBagpipe));
        }
        setIsSongLoading(true);
        const file = await songApi.getSong(song);
        const buffer = await file.arrayBuffer();

        const songWithMetronome = await addMetronome(
          buffer,
          song.timeSignature
        );

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
    },
    [
      listsByBagpipe,
      setActiveSong,
      setIsSongLoading,
      setMidi,
      setMidiData,
      setSongLength,
      tempo,
    ]
  );

  useEffect(() => {
    if (activeSong) {
      loadMidiSong(activeSong);
    }
  }, [activeSong, metronome]);

  return { lowestOctave };
};
