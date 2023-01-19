import {
  userTempo,
  userTranspose,
  userIsPreclick,
} from "./../constants/localStorage";
import { useContext, useEffect } from "react";
import { lastSongData } from "../constants/localStorage";
import { store } from "../context";

export const fallbackSong = "belarusian/Verabey.mid";

export const getUserDataFromLocal = () => {
  const songData = localStorage.getItem(lastSongData);
  const userTempoData = localStorage.getItem(userTempo);
  const userTransposeData = localStorage.getItem(userTranspose);
  const isPreclick = localStorage.getItem(userIsPreclick);
  const songFileName = songData as string;
  const isSongNameCorrect = !!songData?.split("/")[1];

  return {
    activeSong: isSongNameCorrect ? songFileName : fallbackSong,
    tempo: userTempoData !== null ? +userTempoData : 200,
    transpose: userTransposeData !== null ? +userTransposeData : 0,
    userIsPreclick: !!isPreclick !== null,
  };
};

export const useLocalStorage = () => {
  const {
    state: { activeSong, tempo, transpose, isPreclick },
    setActiveSong,
    setTempo,
    setTranspose,
    setIsPreclick,
  } = useContext(store);

  useEffect(() => {
    if (activeSong) {
      const formattetLastUserSong = activeSong;

      localStorage.setItem(lastSongData, formattetLastUserSong);
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
  }, [activeSong, tempo, transpose, isPreclick]);

  useEffect(() => {
    const songData = localStorage.getItem(lastSongData)?.split("|");
    const userTempoData = localStorage.getItem(userTempo);
    const userTransposeData = localStorage.getItem(userTranspose);
    const userIsPreclickData = localStorage.getItem(userIsPreclick);
    const songFileName = songData?.[0];

    setActiveSong(songFileName || "belarusian/Verabey.mid");
    setTempo((userTempoData && +userTempoData) || 200);
    setTranspose((userTransposeData !== null && +userTransposeData) || 0);
    setIsPreclick(!!userIsPreclickData);
  }, []);
};
