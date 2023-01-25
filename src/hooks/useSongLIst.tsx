import { useContext, useEffect, useState } from "react";
import { store } from "../context";
import {
  Song,
  SongList,
  SongListByBagpipe,
  SongListBySongType,
} from "../dataset/songs/interfaces";
import { songList } from "../dataset/songs/songsList";
import { BagpipeTypes } from "../interfaces";

export const useSongList = () => {
  const {
    setListsByBagpipe,
    state: { bagpipeType },
  } = useContext(store);

  const getAllList = async (bagpipeType: BagpipeTypes) => {
    const sortedList = sortSongsByBagpipe(songList);
    setListsByBagpipe(sortSongsBySongType(sortedList[bagpipeType]));
  };

  useEffect(() => {
    getAllList(bagpipeType);
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
