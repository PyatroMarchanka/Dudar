import {
  userTempo,
  userTranspose,
  userIsPreclick,
  userBagpipeType,
} from "./../constants/localStorage";
import { songList } from "./../dataset/songs/songsList";
import { useContext, useEffect } from "react";
import { lastSongData } from "../constants/localStorage";
import { store } from "../context";
import { BagpipeTypes } from "../interfaces";

export const fallbackSong = songList.find(
  (song) => song.pathName === "belarusian/Verabey.mid"
)!;

const fallBackBagpipe = BagpipeTypes.BelarusianNONTraditionalDuda;

export const getUserDataFromLocal = () => {
  const songData = localStorage.getItem(lastSongData);
  const userTempoData = localStorage.getItem(userTempo);
  const userTransposeData = localStorage.getItem(userTranspose);
  const isPreclick = localStorage.getItem(userIsPreclick);
  const bagpipeType = localStorage.getItem(userBagpipeType);

  return {
    activeSong:
      songList.find((song) => song.pathName === songData) || fallbackSong,
    tempo: userTempoData !== null ? +userTempoData : 200,
    transpose: userTransposeData !== null ? +userTransposeData : 0,
    userIsPreclick: !!isPreclick !== null,
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
    const songData = localStorage.getItem(lastSongData)?.split("|");
    const userTempoData = localStorage.getItem(userTempo);
    const userTransposeData = localStorage.getItem(userTranspose);
    const userIsPreclickData = localStorage.getItem(userIsPreclick);
    const songFileName = songData?.[0];
    const userSong = songList?.find((song) => song.pathName === songFileName);
    const bagpipeType = localStorage.getItem(userBagpipeType);

    setActiveSong(userSong || songList[0]);
    setTempo((userTempoData && +userTempoData) || 200);
    setTranspose((userTransposeData !== null && +userTransposeData) || 0);
    setIsPreclick(!!userIsPreclickData);
    setBagpipeType((bagpipeType as BagpipeTypes) || fallBackBagpipe);
  }, []);
};
