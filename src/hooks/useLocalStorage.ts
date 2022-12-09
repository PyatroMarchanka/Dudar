import { userTempo, userTranspose } from "./../constants/localStorage";
import { useContext, useEffect } from "react";
import { lastSongData } from "../constants/localStorage";
import { store } from "../context";

export const getUserDataFromLocal = () => {
  const songData = localStorage.getItem(lastSongData)?.split("|");
  const userTempoData = localStorage.getItem(userTempo);
  const userTransposeData = localStorage.getItem(userTranspose);
  const songFileName = songData?.[0];
  const genreName = songData?.[1];

  return {
    activeSong: songFileName || "belarussian/Verabey.mid",
    genreName: genreName || "belarussian",
    tempo: userTempoData !== null ? +userTempoData : 200,
    transpose: userTransposeData !== null ? +userTransposeData : -1,
  };
};

export const useLocalStorage = () => {
  const {
    state: { activeSong, genreList, tempo, transpose },
    setActiveSong,
    setGenreList,
    setTempo,
    setTranspose,
  } = useContext(store);

  useEffect(() => {
    if (activeSong && genreList) {
      const formattetLastUserSong = `${activeSong}|${genreList}`;

      localStorage.setItem(lastSongData, formattetLastUserSong);
    }

    if (tempo) {
      localStorage.setItem(userTempo, `${tempo}`);
    }

    if (transpose) {
      console.log("transpose", transpose);
      localStorage.setItem(userTranspose, `${transpose}`);
    }
  }, [activeSong, genreList, tempo, transpose]);

  useEffect(() => {
    const songData = localStorage.getItem(lastSongData)?.split("|");
    const userTempoData = localStorage.getItem(userTempo);
    const userTransposeData = localStorage.getItem(userTranspose);
    console.log("get userTransposeData", userTransposeData);
    const songFileName = songData?.[0];
    const genreName = songData?.[1];

    setGenreList(genreName || "belarussian");
    setActiveSong(songFileName || "Verabey.mid");
    setTempo((userTempoData && +userTempoData) || 200);
    setTranspose((userTransposeData !== null && +userTransposeData) || -1);
  }, []);
};
