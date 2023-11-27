import { useCallback, useContext, useEffect } from "react";
import { store } from "../context";
import { Song, SongListByBagpipe, SongListBySongType, SongTags } from "../dataset/songs/interfaces";
import { BagpipeTypes } from "../interfaces";
import { getSongListWithBagpipeTypes } from "../utils/midiUtils";
import { transliterateSongList, useIsCyrylicLang } from "../locales";

export const useSongList = (onStop: () => void) => {
  const {
    setListsByBagpipe,
    setActiveSong,
    state: { bagpipeType, activeSong, listsByBagpipe, language, activeSongTags },
  } = useContext(store);

  const isCyrylicLang = useIsCyrylicLang();

  const addBagpipesTypesToSongList = useCallback(async () => {
    try {
      const listFromFile = await getSongListWithBagpipeTypes();
      const sortedList = sortSongsByBagpipe(listFromFile);
      const lists = sortSongsBySongType(sortedList[bagpipeType]);
      const transliteratedLists = !isCyrylicLang() ? transliterateSongList(lists) : lists;
      const listsFeilteredByTags = filterSongsByTags(transliteratedLists, activeSongTags);
      setListsByBagpipe(listsFeilteredByTags);
      handleActiveSong(bagpipeType, transliteratedLists);
    } catch (error) {
      console.log(error);
    }
  }, [bagpipeType, setListsByBagpipe, language, activeSongTags]);

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
  }, [bagpipeType, language, activeSongTags]);

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

const filterSongsByTags = (lists: SongListBySongType, songTags: SongTags[]): SongListBySongType => {
  if (!songTags.length) return lists;

  return Object.entries(lists).reduce((acc, cur) => {
    const [key, value] = cur;
    const filteredList = value.filter((song) => songTags.every((tag) => song.labels.includes(tag)));
    if (filteredList.length) {
      acc[key] = filteredList;
    }
    return acc;
  }, {} as SongListBySongType);
};
