import {
  userTempo,
  userTranspose,
  userIsPreclick,
  userBagpipeType,
  lastSongData,
} from "./../constants/localStorage";
import { songList } from "./../dataset/songs/songsList";
import { useContext, useEffect } from "react";
import { store } from "../context";
import { BagpipeTypes } from "../interfaces";

export const fallbackSong = songList.find((song) => song.pathName === "belarusian/Карапэт.mid")!;

const fallBackBagpipe = BagpipeTypes.BelarusianNONTraditionalDuda;

export const getUserDataFromLocal = () => {
  const songData = localStorage.getItem(lastSongData);
  const userTempoData = localStorage.getItem(userTempo);
  const userTransposeData = localStorage.getItem(userTranspose);
  const isPreclick = localStorage.getItem(userIsPreclick);
  const bagpipeType = localStorage.getItem(userBagpipeType);
  const song = songList.find((song) => song.pathName === songData);
  return {
    activeSong: song,
    tempo: userTempoData !== null ? +userTempoData : 200,
    transpose: userTransposeData !== null ? +userTransposeData : 0,
    isPreclick: !!isPreclick,
    bagpipeType: (bagpipeType as BagpipeTypes) || fallBackBagpipe,
  };
};

export const useLocalStorage = () => {
  const {
    state: { activeSong, tempo, transpose, isPreclick, bagpipeType },
    setActiveSong,
    setTempo,
    setTranspose,
    setIsPreclick,
    setBagpipeType,
  } = useContext(store);

  useEffect(() => {
    if (activeSong) {
      const formattetLastUserSong = activeSong;

      localStorage.setItem(lastSongData, formattetLastUserSong.pathName);
    }

    if (tempo) {
      localStorage.setItem(userTempo, `${tempo}`);
    }

    if (isPreclick) {
      localStorage.setItem(userIsPreclick, isPreclick.toString());
    } else {
      localStorage.removeItem(userIsPreclick);
    }

    if (transpose !== undefined) {
      localStorage.setItem(userTranspose, `${transpose}`);
    }

    if (bagpipeType) {
      localStorage.setItem(userBagpipeType, bagpipeType);
    }
  }, [activeSong, tempo, transpose, isPreclick, bagpipeType]);

  useEffect(() => {
    const songFileName = localStorage.getItem(lastSongData);
    const userTempoData = localStorage.getItem(userTempo);
    const userTransposeData = localStorage.getItem(userTranspose);
    const userIsPreclickData = localStorage.getItem(userIsPreclick);
    const userSong = songList?.find((song) => song.pathName === songFileName);
    const bagpipeType = localStorage.getItem(userBagpipeType);

    setActiveSong(userSong || fallbackSong);
    setTempo((userTempoData && +userTempoData) || 200);
    setTranspose(userTransposeData !== null ? +userTransposeData : 0);
    setIsPreclick(!!userIsPreclickData);
    setBagpipeType((bagpipeType as BagpipeTypes) || fallBackBagpipe);
  }, []);
};
