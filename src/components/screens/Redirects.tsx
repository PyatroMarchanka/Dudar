import React, { useContext, useEffect } from "react";
import { useSongList } from "../../hooks/useSongLIst";
import { store } from "../../context";
import { useHistory, useLocation } from "react-router-dom";
import { routes } from "../../router/routes";
import { getFirstSongFromList } from "../../dataset/songs/utils";

interface Props {}

export const Redirects = (props: Props) => {
  useSongList();
  const history = useHistory();
  const location = useLocation();
  const {
    state: { activeSong, listsByBagpipe },
  } = useContext(store);

  const slugs = location.pathname.slice(1).split("/");
  useEffect(() => {
    if (slugs[0] === routes.app.slice(1) && slugs.length < 3) {
      if (activeSong) {
        history.replace(`${routes.app}/${routes.info}/${activeSong.id}`);
      } else if (listsByBagpipe) {
        history.replace(
          `${routes.app}/${routes.info}/${
            getFirstSongFromList(listsByBagpipe)?.id
          }`
        );
      }
    }
  }, [activeSong, listsByBagpipe]);

  return <div></div>;
};
