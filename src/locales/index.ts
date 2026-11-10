import { useTranslation } from "react-i18next";
import { Languages } from "../interfaces";
import { SongListBySongType } from "../dataset/songs/interfaces";
import { useContext } from "react";
import { store } from "../context";
import { isCyrilicWord, transliterate } from "./transliterate";

export const useChangeLanguage = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lang: Languages) => {
    i18n.changeLanguage(lang);
  };

  return changeLanguage;
};

export { isCyrilicWord, transliterate };

export const transliterateSongList = (list: SongListBySongType) => {
  const result: any = {};
  for (const genre in list) {
    if (Object.prototype.hasOwnProperty.call(list, genre)) {
      result[genre] = list[genre].map((song) => {
        if (isCyrilicWord(song.name)) {
          return { ...song, name: transliterate(song.name) };
        } else {
          return song;
        }
      });
    }
  }
  return result as SongListBySongType;
};

export const useIsCyrylicLang = () => {
  const {
    state: { language },
  } = useContext(store);

  return () => {
    return language === Languages.Belarusian
  };
};
