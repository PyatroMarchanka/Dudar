import { userTempo, userTranspose } from "./../constants/localStorage";
import { useContext, useEffect } from "react";
import { lastSongData } from "../constants/localStorage";
import { store } from "../context";

export const getUserDataFromLocal = () => {
  const songData = localStorage.getItem(lastSongData);
  const userTempoData = localStorage.getItem(userTempo);
  const userTransposeData = localStorage.getItem(userTranspose);
  const songFileName = songData as string;
  const isSongNameCorrect = !!songData?.split("/")[1];

  return {
    activeSong: isSongNameCorrect ? songFileName : "belarussian/Verabey.mid",
    tempo: userTempoData !== null ? +userTempoData : 200,
    transpose: userTransposeData !== null ? +userTransposeData : 0,
  };
};

export const useLocalStorage = () => {
  const {
    state: { activeSong, tempo, transpose },
    setActiveSong,
    setTempo,
    setTranspose,
  } = useContext(store);

  useEffect(() => {
    if (activeSong) {
      const formattetLastUserSong = activeSong;

      localStorage.setItem(lastSongData, formattetLastUserSong);
    }

    if (tempo) {
      localStorage.setItem(userTempo, `${tempo}`);
    }

    if (transpose !== undefined) {
      localStorage.setItem(userTranspose, `${transpose}`);
    }
  }, [activeSong, tempo, transpose]);

  useEffect(() => {
    const songData = localStorage.getItem(lastSongData)?.split("|");
    const userTempoData = localStorage.getItem(userTempo);
    const userTransposeData = localStorage.getItem(userTranspose);
    const songFileName = songData?.[0];

    setActiveSong(songFileName || "belarussian/Verabey.mid");
    setTempo((userTempoData && +userTempoData) || 200);
    setTranspose((userTransposeData !== null && +userTransposeData) || 0);
  }, []);
};
