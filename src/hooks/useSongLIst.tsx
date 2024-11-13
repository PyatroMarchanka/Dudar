import { useCallback, useContext, useEffect } from "react";
import { store } from "../context";
import { SongListByBagpipe } from "../dataset/songs/interfaces";
import { BagpipeTypes } from "../interfaces";
import { useIsCyrylicLang } from "../locales";
import {
  getAvailableTagsFromLists,
} from "../dataset/songs/utils";
import { songApi } from "../api/songClient";
import { useHistory } from "react-router-dom";
import { routes } from "../router/routes";
import {
  getSonglist,
  sortSongsByBagpipe,
  sortSongsBySongType,
} from "../utils/songlistUtils";

export const useSongListShort = () => {
  const {
    setListsByBagpipe,
    state: { bagpipeType },
  } = useContext(store);

  const initSongList = useCallback(async () => {
    try {
      const songList = await songApi.getSongList();

      const sortedList = sortSongsByBagpipe(songList);
      const lists = sortSongsBySongType(
        sortedList[bagpipeType || BagpipeTypes.BelarusianTraditionalDuda]
      );

      setListsByBagpipe(lists);
    } catch (error) {
      console.log(error);
    }
  }, [bagpipeType, setListsByBagpipe]);

  useEffect(() => {
    initSongList();
  }, []);
};

export const useSongList = (onStop?: () => void) => {
  const history = useHistory();
  const {
    setListsByBagpipe,
    setActiveSong,
    setSongTags,
    setIsSongUnavailable,
    state: {
      bagpipeType,
      activeSong,
      listsByBagpipe,
      language,
      activeSongTags,
    },
  } = useContext(store);

  const isCyrylicLang = useIsCyrylicLang();

  const initSongList = useCallback(async () => {
    try {
      const { lists, transliteratedLists } = await getSonglist(
        bagpipeType,
        isCyrylicLang(),
        activeSongTags
      );
      setListsByBagpipe(lists);
      handleActiveSong(bagpipeType, transliteratedLists);
    } catch (error) {
      console.log(error);
    }
  }, [bagpipeType, setListsByBagpipe, language, activeSongTags]);

  const handleActiveSong = useCallback(
    (bagpipeType: BagpipeTypes, listsByBagpipeLocal: SongListByBagpipe) => {
      if (!listsByBagpipeLocal || !bagpipeType || !activeSong) {
        return;
      }
      if (onStop) {
        onStop();
      }
      const activeSongInNewList =
        activeSong &&
        listsByBagpipeLocal[activeSong.type]?.find(
          (song) => song.id.split('-bd').join('') === activeSong.id.split('-bd').join('')
        );

      if (activeSongInNewList) {
        history.push(`${routes.app}/${routes.play}/${activeSongInNewList.id}`);
      } else {
        setIsSongUnavailable(true);
      }
    },
    [activeSong,bagpipeType, setActiveSong, listsByBagpipe, onStop]
  );

  useEffect(() => {
    initSongList();
  }, [bagpipeType, language, activeSongTags]);

  useEffect(() => {
    const tags = getAvailableTagsFromLists(listsByBagpipe);
    setSongTags(tags);
  }, [listsByBagpipe]);
};
