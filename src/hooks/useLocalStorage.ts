import {
  userTempo,
  userTranspose,
  userIsPreclick,
  userBagpipeType,
  lastSongData,
  userLanguage,
} from "./../constants/localStorage";
import { useContext, useEffect } from "react";
import { store } from "../context";
import { BagpipeTypes, Languages } from "../interfaces";
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
const fallBackLanguage = Languages.Belarusian;

export const getUserDataFromLocal = () => {
  const songData = localStorage.getItem(lastSongData);
  const userTempoData = localStorage.getItem(userTempo);
  const userTransposeData = localStorage.getItem(userTranspose);
  const isPreclick = localStorage.getItem(userIsPreclick);
  const bagpipeType = localStorage.getItem(userBagpipeType);
  const language = localStorage.getItem(userLanguage);
  return {
    tempo: userTempoData !== null ? +userTempoData : 200,
    transpose: userTransposeData !== null ? +userTransposeData : 0,
    isPreclick: !!isPreclick,
    bagpipeType: (bagpipeType as BagpipeTypes) || fallBackBagpipe,
    songData,
    language: (language || fallBackLanguage) as Languages,
  };
};

export const useLocalStorage = () => {
  const {
    state: { activeSong, tempo, transpose, isPreclick, bagpipeType, language },
    setActiveSong,
    setTempo,
    setTranspose,
    setIsPreclick,
    setBagpipeType,
    setLanguage,
  } = useContext(store);

  useEffect(() => {
    if (activeSong) {
      localStorage.setItem(lastSongData, JSON.stringify(activeSong));
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

    if (language) {
      localStorage.setItem(userLanguage, language);
    }
  }, [activeSong, tempo, transpose, isPreclick, bagpipeType, language]);

  useEffect(() => {
    const songDataFromLocalStorage = localStorage.getItem(lastSongData);
    let parsedSong;
    try {
      parsedSong = !!songDataFromLocalStorage && JSON.parse(songDataFromLocalStorage);
    } catch (error) {
      console.log(error)
      parsedSong = fallbackSong;
    }
    const songData = parsedSong.pathName ? parsedSong : undefined;
    const userTempoData = localStorage.getItem(userTempo);
    const userTransposeData = localStorage.getItem(userTranspose);
    const userIsPreclickData = localStorage.getItem(userIsPreclick);
    const bagpipeType = localStorage.getItem(userBagpipeType);
    const language = localStorage.getItem(userLanguage);

    setActiveSong(songData);
    setTempo((userTempoData && +userTempoData) || 200);
    setTranspose(userTransposeData !== null ? +userTransposeData : 0);
    setIsPreclick(!!userIsPreclickData);
    setBagpipeType((bagpipeType as BagpipeTypes) || fallBackBagpipe);
    setLanguage((language as Languages) || fallBackLanguage);
  }, []);
};
