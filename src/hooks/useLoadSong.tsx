import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { store } from '../context';
import { Song } from '../dataset/songs/interfaces';
import { convertNoteToMidiPitch, prepareSongMidi } from '../utils/midiUtils';
import { isAbcMelodySong, isMelodySong, melodySongToMidi } from '../utils/midiUtils/catalogMelody';
import { notesMaps } from '../dataset/bagpipesNotesMaps';
import { SharpNotesEnum } from '../interfaces';
import { songApi } from '../api/songClient';
import { useParams } from 'react-router-dom';
import { findSongInListById, getFirstSongFromList } from '../dataset/songs/utils';
import { useSongList } from './useSongLIst';
import { useSong } from './useSong';

export const useLoadSong = () => {
  const params: any = useParams();
  const {
    state: { activeSong, metronome, tempo, listsByBagpipe, transpose, bagpipeType },
    setMidi,
    setMidiData,
    setSongLength,
    setActiveSong,
    setIsSongLoading,
    setIsPlaying,
    setProgress,
    setTempo,
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
  }, [songId, listsByBagpipe]);

  const playableNotes = useMemo(
    () => Object.keys(notesMaps[bagpipeType] ?? {}).map((note) => convertNoteToMidiPitch(note as SharpNotesEnum)),
    [bagpipeType]
  );

  const loadMidiSong = useCallback(
    async (song: Song) => {
      try {
        if (!song.pathName) {
          listsByBagpipe && setActiveSong(getFirstSongFromList(listsByBagpipe));
        }
        setIsSongLoading(true);
        let buffer: ArrayBuffer;
        let normalizeOctaves = true;
        if (isMelodySong(song)) {
          // Approved from a user's melody: built in the browser, there is no file to fetch
          ({ buffer, normalizeOctaves } = await melodySongToMidi(song, { transpose, playableNotes }));
        } else {
          const file = await songApi.getSong(song);
          buffer = await file.arrayBuffer();
        }

        const {
          midi,
          songWithMetronome,
          songLength,
          lowestOctave: lowestOctaveFromFile,
        } = await prepareSongMidi(buffer, song.timeSignature, song.originalTempo, tempo, normalizeOctaves);

        setSongLength(songLength);
        setLowestOctave(lowestOctaveFromFile);
        setMidiData(midi);
        setMidi(songWithMetronome);
        setIsSongLoading(false);

        if (song.originalTempo) {
          setTempo(song.originalTempo);
        }
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
      transpose,
      playableNotes,
    ]
  );

  // An ABC melody song is rearranged for the instrument, so it's rebuilt when the instrument changes
  const instrumentKey = activeSong && isAbcMelodySong(activeSong) ? `${transpose}:${bagpipeType}` : '';

  useEffect(() => {
    if (activeSong) {
      loadMidiSong(activeSong);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSong, metronome, instrumentKey]);

  return { lowestOctave };
};
