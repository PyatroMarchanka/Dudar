import { useParams } from "react-router-dom";
import { useContext, useEffect } from "react";
import { store } from "../context";
import { findSongInListById } from "../dataset/songs/utils";

export const useSong = () => {
  const {
    state: { listsByBagpipe },
    setActiveSong,
    setIsSongUnavailable
  } = useContext(store);
  const params: any = useParams();

  useEffect(() => {
    if (listsByBagpipe) {
      const songFromParam = findSongInListById(params.id, listsByBagpipe);
      if (songFromParam) {
        setActiveSong(songFromParam);
        setIsSongUnavailable(false);
      } else {
        setActiveSong(null);
        setIsSongUnavailable(true);
      }
    }
  }, [listsByBagpipe, params.id]);
};
