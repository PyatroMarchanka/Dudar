import {
  userTempo,
  userTranspose,
  userIsPreclick,
  userBagpipeType,
  lastSongData,
} from "./../constants/localStorage";
import { useContext, useEffect } from "react";
import { store } from "../context";
import { BagpipeTypes } from "../interfaces";
import { Song, SongTypes } from "../dataset/songs/interfaces";

export const fallbackSong: Song = {
  timeSignature: "4/4",
  name: "Цяцерка",
  type: SongTypes.Belarusian,
  bagpipesToPlay: [
    BagpipeTypes.BelarusianNONTraditionalDuda,
    BagpipeTypes.BelarusianOpenDuda,
    BagpipeTypes.BelarusianTraditionalDuda,
    BagpipeTypes.Dudelsack,
  ],
  pathName: "belarusian/Цяцерка.mid",
};

const fallBackBagpipe = BagpipeTypes.BelarusianNONTraditionalDuda;

export const getUserDataFromLocal = () => {
  const songData = localStorage.getItem(lastSongData);
  const userTempoData = localStorage.getItem(userTempo);
  const userTransposeData = localStorage.getItem(userTranspose);
  const isPreclick = localStorage.getItem(userIsPreclick);
  const bagpipeType = localStorage.getItem(userBagpipeType);

  return {
    tempo: userTempoData !== null ? +userTempoData : 200,
    transpose: userTransposeData !== null ? +userTransposeData : 0,
    isPreclick: !!isPreclick,
    bagpipeType: (bagpipeType as BagpipeTypes) || fallBackBagpipe,
    songData,
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
      localStorage.setItem(lastSongData, JSON.stringify(formattetLastUserSong));
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
    const songDataFromLocalStorage = localStorage.getItem(lastSongData);
    let parsedSong;
    try {
      parsedSong = !!songDataFromLocalStorage && JSON.parse(songDataFromLocalStorage);
    } catch (error) {
      parsedSong = fallbackSong;
    }
    const songData = parsedSong.pathName ? parsedSong : undefined;
    const userTempoData = localStorage.getItem(userTempo);
    const userTransposeData = localStorage.getItem(userTranspose);
    const userIsPreclickData = localStorage.getItem(userIsPreclick);
    const bagpipeType = localStorage.getItem(userBagpipeType);

    setActiveSong(songData);
    setTempo((userTempoData && +userTempoData) || 200);
    setTranspose(userTransposeData !== null ? +userTransposeData : 0);
    setIsPreclick(!!userIsPreclickData);
    setBagpipeType((bagpipeType as BagpipeTypes) || fallBackBagpipe);
  }, []);
};
