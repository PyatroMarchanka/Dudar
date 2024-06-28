import { useCallback, useContext, useEffect, useState } from "react";
import { store } from "../context";
import {
  Song,
  SongListByBagpipe,
  SongListBySongType,
  SongTags,
} from "../dataset/songs/interfaces";
import { BagpipeTypes } from "../interfaces";
import { transliterateSongList, useIsCyrylicLang } from "../locales";
import {
  getAvailableTagsFromLists,
  getFirstSongFromList,
} from "../dataset/songs/utils";
import { songApi } from "../api/songClient";

export const useSongListShort = () => {
  const {
    setListsByBagpipe,
    state: { bagpipeType },
  } = useContext(store);

  const initSongList = useCallback(async () => {
    try {
      const songList = await songApi.getSongList();

      const sortedList = sortSongsByBagpipe(songList);
      const lists = sortSongsBySongType(
        sortedList[bagpipeType || BagpipeTypes.BelarusianTraditionalDuda]
      );

      setListsByBagpipe(lists);
    } catch (error) {
      console.log(error);
    }
  }, [bagpipeType, setListsByBagpipe]);

  useEffect(() => {
    initSongList();
  }, []);
};

export const useSongList = (onStop?: () => void) => {
  const {
    setListsByBagpipe,
    setActiveSong,
    setSongTags,
    state: {
      bagpipeType,
      activeSong,
      listsByBagpipe,
      language,
      activeSongTags,
    },
  } = useContext(store);

  const isCyrylicLang = useIsCyrylicLang();

  const initSongList = useCallback(async () => {
    try {
      const songList = await songApi.getSongList();

      const sortedList = sortSongsByBagpipe(songList);
      const lists = sortSongsBySongType(sortedList[bagpipeType]);
      const transliteratedLists = !isCyrylicLang()
        ? transliterateSongList(lists)
        : lists;
      const sortedListsAlphabetically =
        sortListsAlphabetically(transliteratedLists);
      const listsFeilteredByTags = filterSongsByTags(
        sortedListsAlphabetically,
        activeSongTags
      );
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
      if (onStop) {
        onStop();
      }
      const activeSongInNewList =
        activeSong &&
        listsByBagpipeLocal[activeSong.type]?.find(
          (song) => song.name === activeSong.name
        );
      if (activeSongInNewList) {
        setActiveSong(activeSongInNewList);
      } else {
        const firstSongInList =
          listsByBagpipeLocal[Object.keys(listsByBagpipeLocal)[0]][0];
        setActiveSong(firstSongInList);
      }
    },
    [activeSong, setActiveSong, listsByBagpipe, onStop]
  );

  useEffect(() => {
    if (!activeSong && listsByBagpipe) {
      const firstSongInList = getFirstSongFromList(listsByBagpipe);
      setActiveSong(firstSongInList);
    }
  }, [activeSong, listsByBagpipe]);

  useEffect(() => {
    initSongList();
  }, [bagpipeType, language, activeSongTags]);

  useEffect(() => {
    const tags = getAvailableTagsFromLists(listsByBagpipe);
    setSongTags(tags);
  }, [listsByBagpipe]);
};

export const sortListsAlphabetically = (lists: SongListBySongType) => {
  return Object.entries(lists).reduce((acc, cur) => {
    const [key, value] = cur;
    acc[key] = value.sort((a, b) => (a.name > b.name ? 1 : -1));
    return acc;
  }, {} as SongListBySongType);
};

export const sortSongsByBagpipe = (songs: Song[]): SongListByBagpipe => {
  const list: SongListByBagpipe = {};
  songs?.forEach((song) => {
    song.bagpipesToPlay.forEach((bagpipeType) => {
      if (list[bagpipeType]) {
        const isAlreadyInList = !!list[bagpipeType].find(
          (songFromList) => songFromList.name === song.name
        );
        const isSpecialForBagpipe = song.pathName.includes(`-${bagpipeType}`);

        if (!isAlreadyInList) {
          list[bagpipeType].push(song);
        } else if (isSpecialForBagpipe) {
          list[bagpipeType] = list[bagpipeType].slice(0, -1);
          list[bagpipeType].push(song);
        }
      } else {
        list[bagpipeType] = [song];
      }
    });
  });

  return list;
};

export const sortSongsBySongType = (songs: Song[]): SongListBySongType => {
  const list: SongListBySongType = {};
  songs?.forEach((song) => {
    if (song.type in list) {
      list[song.type].push(song);
    } else {
      list[song.type] = [song];
    }
  });

  return list;
};

export const filterSongsByTags = (
  lists: SongListBySongType,
  songTags: SongTags[]
): SongListBySongType => {
  if (!songTags.length) return lists;

  return Object.entries(lists).reduce((acc, cur) => {
    const [key, value] = cur;
    const filteredList = value.filter((song) =>
      songTags.every((tag) => song.labels.includes(tag))
    );
    if (filteredList.length) {
      acc[key] = filteredList;
    }
    return acc;
  }, {} as SongListBySongType);
};
