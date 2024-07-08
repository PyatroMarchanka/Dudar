import { useHistory, useParams } from "react-router-dom";
import { useContext, useEffect } from "react";
import { store } from "../context";
import {
  findSongInListById,
  getFirstSongFromList,
} from "../dataset/songs/utils";
import { routes } from "../router/routes";

export const useSong = () => {
  const {
    state: { listsByBagpipe },
    setActiveSong,
  } = useContext(store);
  const history = useHistory();

  const params: any = useParams();

  useEffect(() => {
    if (listsByBagpipe) {
      const songFromParam = findSongInListById(params.id, listsByBagpipe);

      if (songFromParam) {
        setActiveSong(findSongInListById(params.id, listsByBagpipe)!);
      } else {
        const firstSong = getFirstSongFromList(listsByBagpipe);
        history.push(`${routes.app}/${routes.play}/${firstSong.id}`);
      }
    }
  }, [listsByBagpipe, params.id]);
};
