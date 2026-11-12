import { useHistory, useParams } from "react-router-dom";
import { useContext, useEffect } from "react";
import { store } from "../context";
import { decodeSongId, findSongInListById, findSongVariantInList } from "../dataset/songs/utils";
import { loadSongList } from "../api/appData";
import { routes } from "../router/routes";

export const useSong = () => {
  const {
    state: { listsByBagpipe },
    setActiveSong,
    setIsSongUnavailable
  } = useContext(store);
  const params: any = useParams();
  const history = useHistory();

  useEffect(() => {
    if (!listsByBagpipe) return;

    const songFromParam = findSongInListById(params.id, listsByBagpipe);
    if (songFromParam) {
      setActiveSong(songFromParam);
      setIsSongUnavailable(false);
      return;
    }

    // Not in this bagpipe's list as is. It may be another variant of a song the
    // list holds (song pages link to every variant), so open that variant instead.
    let cancelled = false;
    (async () => {
      let variant;
      try {
        const id = decodeSongId(params.id);
        const song = (await loadSongList()).find((song) => song.id === id);
        variant = song && findSongVariantInList(song, listsByBagpipe);
      } catch (error) {
        console.log(error);
      }
      if (cancelled) return;
      if (variant) {
        history.replace(`${routes.app}/${routes.play}/${variant.id}`);
      } else {
        setActiveSong(null);
        setIsSongUnavailable(true);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listsByBagpipe, params.id]);
};
