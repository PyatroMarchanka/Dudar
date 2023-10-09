import { useCallback, useContext, useEffect } from "react";
import { store } from "../context";
import { Song, SongListByBagpipe, SongListBySongType } from "../dataset/songs/interfaces";
import { BagpipeTypes } from "../interfaces";
import { getSongListWithBagpipeTypes } from "../utils/midiUtils";
import { transliterateSongList, useIsCyrylicLang } from "../locales";

export const useSongList = (onStop: () => void) => {
  const {
    setListsByBagpipe,
    setActiveSong,
    state: { bagpipeType, activeSong, listsByBagpipe, language },
  } = useContext(store);

  const isCyrylicLang = useIsCyrylicLang();

  const addBagpipesTypesToSongList = useCallback(async () => {
    try {
      const listFromFile = await getSongListWithBagpipeTypes();
      const sortedList = sortSongsByBagpipe(listFromFile);
      const lists = sortSongsBySongType(sortedList[bagpipeType]);
      const transliteratedLists = !isCyrylicLang() ? transliterateSongList(lists) : lists;
      setListsByBagpipe(transliteratedLists);
      handleActiveSong(bagpipeType, transliteratedLists);
    } catch (error) {
      console.log(error);
    }
  }, [bagpipeType, setListsByBagpipe, language]);

  const handleActiveSong = useCallback(
    (bagpipeType: BagpipeTypes, listsByBagpipeLocal: SongListByBagpipe) => {
      if (!listsByBagpipeLocal || !bagpipeType || !activeSong) {
        return;
      }
      onStop();
      const activeSongInNewList =
        activeSong &&
        listsByBagpipeLocal[activeSong.type]?.find((song) => song.name === activeSong.name);
      if (activeSongInNewList) {
        setActiveSong(activeSongInNewList);
      } else {
        const firstSongInList = listsByBagpipeLocal[Object.keys(listsByBagpipeLocal)[0]][0];
        setActiveSong(firstSongInList);
      }
    },
    [activeSong, setActiveSong, listsByBagpipe, onStop]
  );

  useEffect(() => {
    if (!activeSong && listsByBagpipe) {
      const firstSongInList = listsByBagpipe[Object.keys(listsByBagpipe)[0]][0];
      setActiveSong(firstSongInList);
    }
  }, [activeSong, listsByBagpipe]);

  useEffect(() => {
    addBagpipesTypesToSongList();
  }, [bagpipeType, language]);
};

const sortSongsByBagpipe = (songs: Song[]): SongListByBagpipe => {
  const list: SongListByBagpipe = {};
  songs?.forEach((song) => {
    song.bagpipesToPlay.forEach((bagpipeType) => {
      if (list[bagpipeType]) {
        list[bagpipeType].push(song);
      } else {
        list[bagpipeType] = [song];
      }
    });
  });

  return list;
};

const sortSongsBySongType = (songs: Song[]): SongListBySongType => {
  const list: SongListBySongType = {};

  songs.forEach((song) => {
    if (song.type in list) {
      list[song.type].push(song);
    } else {
      list[song.type] = [song];
    }
  });

  return list;
};
