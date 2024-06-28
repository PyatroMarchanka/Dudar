import { useParams } from "react-router-dom";
import { useSongListShort } from "./useSongLIst";
import { useContext, useEffect } from "react";
import { store } from "../context";
import { findSongInListById } from "../dataset/songs/utils";

export const useSong = () => {
  const {
    state: { listsByBagpipe },
    setActiveSong,
  } = useContext(store);

  const params: any = useParams();
  useSongListShort();

  useEffect(() => {
    if (listsByBagpipe) {
      console.log(findSongInListById(params.id, listsByBagpipe));
      setActiveSong(findSongInListById(params.id, listsByBagpipe)!);
    }
  }, [listsByBagpipe, params.id]);
};
