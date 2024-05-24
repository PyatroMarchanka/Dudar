import { Drawer, SwipeableDrawer } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { store } from "../../context";
import { findSongInListById } from "../../dataset/songs/utils";
import { routes } from "../../router/routes";
import { SongList } from "../SongList";

interface Props {}

export const SongPage = (props: Props) => {
  const params: any = useParams();

  const {
    state: { activeSong, listsByBagpipe },
    setActiveSong,
  } = useContext(store);

  useEffect(() => {
    if (!listsByBagpipe) return;
    const song = findSongInListById(params.id, listsByBagpipe);
    if (song) {
      setActiveSong(song);
    }
  }, [params.id, listsByBagpipe]);


 return (
    <div>
      Song : {activeSong?.name}
      <Link to={`${routes.play}/${params.id}`}>Play</Link>
    </div>
  );
};
