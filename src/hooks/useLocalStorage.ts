import {
  userTempo,
  userTranspose,
  userIsPreclick,
  userBagpipeType,
  userLanguage,
  userHolesMode,
  userLoopCount,
} from "./../constants/localStorage";
import { useContext, useEffect } from "react";
import { store } from "../context";
import { BagpipeTypes, HolesModes, Languages } from "../interfaces";

const fallBackBagpipe = BagpipeTypes.BelarusianTraditionalDuda;
const fallBackLanguage = Languages.English;
const fallbackLoopCount = 1;

export const getUserDataFromLocal = () => {
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
    language: (language || fallBackLanguage) as Languages,
    holesMode: (holesMode || HolesModes.Fingers) as HolesModes,
    loopBars: loopBars ? Number(loopBars) : fallbackLoopCount,
  };
};

export const useLocalStorage = () => {
  const {
    state: {
      listsByBagpipe,
      tempo,
      transpose,
      isPreclick,
      bagpipeType: bagpipeTypeFromCtx,
      language,
      holesMode,
      loopBars,
    },
    setTempo,
    setTranspose,
    setIsPreclick,
    setBagpipeType,
    setLanguage,
    setLoopBars,
  } = useContext(store);

  useEffect(() => {
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
    tempo,
    transpose,
    isPreclick,
    bagpipeTypeFromCtx,
    language,
    holesMode,
    loopBars,
  ]);

  useEffect(() => {
    if (!listsByBagpipe) return;

    const userTempoData = localStorage.getItem(userTempo);
    const userTransposeData = localStorage.getItem(userTranspose);
    const userIsPreclickData = localStorage.getItem(userIsPreclick);
    const bagpipeType = localStorage.getItem(userBagpipeType);
    const language = localStorage.getItem(userLanguage);

    setTempo((userTempoData && +userTempoData) || 200);
    setTranspose(userTransposeData !== null ? +userTransposeData : 0);
    setIsPreclick(!!userIsPreclickData);
    setBagpipeType((bagpipeType as BagpipeTypes) || fallBackBagpipe);
    setLanguage((language as Languages) || fallBackLanguage);
    setLoopBars(loopBars ? Number(loopBars) : fallbackLoopCount);
  }, [listsByBagpipe]);
};
