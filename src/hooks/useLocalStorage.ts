import {
  userTempo,
  userTranspose,
  userIsPreclick,
  userBagpipeType,
  lastSongData,
  userLanguage,
  userHolesMode,
  userLoopCount,
} from "./../constants/localStorage";
import { useContext, useEffect } from "react";
import { store } from "../context";
import { BagpipeTypes, HolesModes, Languages } from "../interfaces";
import { getFirstSongFromList, isSongInLists } from "../dataset/songs/utils";

const fallBackBagpipe = BagpipeTypes.BelarusianTraditionalDuda;
const fallBackLanguage = Languages.English;
const fallbackLoopCount = 1;

export const getUserDataFromLocal = () => {
  const songData = localStorage.getItem(lastSongData);
  const userTempoData = localStorage.getItem(userTempo);
  const userTransposeData = localStorage.getItem(userTranspose);
  const isPreclick = localStorage.getItem(userIsPreclick);
  const bagpipeType = localStorage.getItem(userBagpipeType);
  const language = localStorage.getItem(userLanguage);
  const holesMode = localStorage.getItem(userHolesMode);
  const loopBars = localStorage.getItem(userLoopCount);

  return {
    tempo: userTempoData !== null ? +userTempoData : 200,
    transpose: userTransposeData !== null ? +userTransposeData : 0,
    isPreclick: !!isPreclick,
    bagpipeType: (bagpipeType as BagpipeTypes) || fallBackBagpipe,
    songData,
    language: (language || fallBackLanguage) as Languages,
    holesMode: (holesMode || HolesModes.Fingers) as HolesModes,
    loopBars: loopBars ? Number(loopBars) : fallbackLoopCount,
  };
};

export const useLocalStorage = () => {
  const {
    state: {
      listsByBagpipe,
      activeSong,
      tempo,
      transpose,
      isPreclick,
      bagpipeType: bagpipeTypeFromCtx,
      language,
      holesMode,
      loopBars,
    },
    setActiveSong,
    setTempo,
    setTranspose,
    setIsPreclick,
    setBagpipeType,
    setLanguage,
    setLoopBars,
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

    if (bagpipeTypeFromCtx) {
      localStorage.setItem(userBagpipeType, bagpipeTypeFromCtx);
    }

    if (language) {
      localStorage.setItem(userLanguage, language);
    }

    if (holesMode) {
      localStorage.setItem(userHolesMode, holesMode);
    }

    if (loopBars) {
      localStorage.setItem(userLoopCount, loopBars.toString());
    }
  }, [
    activeSong,
    tempo,
    transpose,
    isPreclick,
    bagpipeTypeFromCtx,
    language,
    holesMode,
    loopBars,
  ]);

  useEffect(() => {
    const songDataFromLocalStorage = localStorage.getItem(lastSongData);
    let parsedSong;
    try {
      parsedSong =
        !!songDataFromLocalStorage && JSON.parse(songDataFromLocalStorage);
    } catch (error) {
      console.log(error);
    }

    if (!listsByBagpipe) return;

    const isInList = isSongInLists(listsByBagpipe, parsedSong);
    const songData = isInList
      ? parsedSong
      : getFirstSongFromList(listsByBagpipe);
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
    setLoopBars(loopBars ? Number(loopBars) : fallbackLoopCount);
  }, [listsByBagpipe]);
};
