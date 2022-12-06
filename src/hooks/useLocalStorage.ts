import { useContext, useEffect } from "react";
import { lastSongData } from "../constants/localStorage";
import { store } from "../context";

export const useLocalStorage = () => {
  const {
    state: { activeSong, genreList },
    setActiveSong,
    setGenreList,
  } = useContext(store);

  useEffect(() => {
    if (activeSong && genreList) {
      const formattetLastUserSong = `${activeSong}|${genreList}`;

      localStorage.setItem(lastSongData, formattetLastUserSong);
    }
  }, [activeSong, genreList]);

  useEffect(() => {
    const songData = localStorage.getItem(lastSongData)?.split("|");
    const songFileName = songData?.[0];
    const genreName = songData?.[1];
    if (genreName) {
      setGenreList(genreName);
    }
    if (songFileName) {
      setActiveSong(songFileName);
    }
  }, []);
};
