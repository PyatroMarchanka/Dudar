import { useContext, useEffect } from "react";
import { store } from "../context";
import {
  Song,
  SongListByBagpipe,
  SongListBySongType,
} from "../dataset/songs/interfaces";
import { songList } from "../dataset/songs/songsList";
import { BagpipeTypes } from "../interfaces";

export const useSongList = () => {
  const {
    setListsByBagpipe,
    setActiveSong,
    state: { bagpipeType, listsByBagpipe, activeSong },
  } = useContext(store);

  const getAllList = async (bagpipeType: BagpipeTypes) => {
    const sortedList = sortSongsByBagpipe(songList);
    setListsByBagpipe(sortSongsBySongType(sortedList[bagpipeType]));
  };

  useEffect(() => {
    getAllList(bagpipeType);
  }, [bagpipeType]);

  useEffect(() => {
    if (!listsByBagpipe) {
      return;
    }

    const activeSongInNewList =
      activeSong &&
      listsByBagpipe[activeSong!.type].find(
        (song) => song.name === activeSong!.name
      );

    if (activeSongInNewList) {
      setActiveSong(activeSongInNewList);
    } else {
      setActiveSong(listsByBagpipe[Object.keys(listsByBagpipe)[0]][0]);
    }
  }, [listsByBagpipe]);
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
