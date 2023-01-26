import { useContext, useEffect } from "react";
import { store } from "../context";
import {
  Song,
  SongListByBagpipe,
  SongListBySongType,
} from "../dataset/songs/interfaces";
import { songList } from "../dataset/songs/songsList";
import { BagpipeTypes } from "../interfaces";

export const useSongList = (onStop: () => void) => {
  const {
    setListsByBagpipe,
    setActiveSong,
    state: { bagpipeType, activeSong },
  } = useContext(store);

  const getAllList = (bagpipeType: BagpipeTypes) => {
    const sortedList = sortSongsByBagpipe(songList);
    const lists = sortSongsBySongType(sortedList[bagpipeType]);
    setListsByBagpipe(lists);

    return lists;
  };

  useEffect(() => {
    const lists = getAllList(bagpipeType);
    if (!lists) {
      return;
    }
    onStop();

    const activeSongInNewList =
      activeSong &&
      lists[activeSong!.type]?.find((song) => song.name === activeSong!.name);

    if (activeSongInNewList) {
      setActiveSong(activeSongInNewList);
    } else {
      const firstSongInList = lists[Object.keys(lists)[0]][0];
      setActiveSong(firstSongInList);
    }
  }, [bagpipeType]);
};

const sortSongsByBagpipe = (songs: Song[]): SongListByBagpipe => {
  const list: SongListByBagpipe = {};
  songs.forEach((song) => {
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
