import { useContext, useEffect, useState } from "react";
import { store } from "../context";
import { Song, SongListByBagpipe, SongTypes } from "../interfaces";

export const useSongList = () => {
  const {
    setAllLists: setAllListContext,
    setListsByBagpipe,
    state: { allLists, bagpipeType },
  } = useContext(store);

  const initialList = SongTypes.Belarusian;

  const getAllList = async () => {
    const file = await fetch("midi/list.json");
    const list = await file.json();
    console.log("list from json", list);
    setAllListContext(list);

    const sortedList = sortSongsByBagpipe(list);
    console.log("sortedList", sortedList);
    setListsByBagpipe(sortedList);
  };

  useEffect(() => {
    getAllList();
  }, []);

  useEffect(() => {
    if (allLists) {
      setListsByBagpipe(sortSongsByBagpipe(allLists));
    }
  }, [bagpipeType, allLists]);

  return { allLists };
};

const sortSongsByBagpipe = (songs: Song[]): SongListByBagpipe => {
  const list: any = {};
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

const sortSongsBySongType = (songs: Song[]): SongListByBagpipe => {
  const list: any = {};
  songs.forEach((song) => {
    if (song.type in list) {
      list[song.type].push(song);
    } else {
      list[song.type] = [song];
    }
  });

  return list;
};
