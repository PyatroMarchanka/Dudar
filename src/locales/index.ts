import { useTranslation } from "react-i18next";
import { Languages } from "../interfaces";
import { SongListBySongType } from "../dataset/songs/interfaces";
import { useContext } from "react";
import { store } from "../context";

export const useChangeLanguage = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lang: Languages) => {
    i18n.changeLanguage(lang);
  };

  return changeLanguage;
};

const lettersMap: { [key: string]: string } = {
  Ё: "Yo",
  Й: "I",
  Ц: "Ts",
  У: "U",
  К: "K",
  Е: "E",
  Н: "N",
  Г: "G",
  Ш: "Sh",
  Щ: "Sch",
  З: "Z",
  Х: "H",
  "'": "'",
  ё: "yo",
  й: "i",
  ц: "ts",
  у: "u",
  к: "k",
  е: "e",
  н: "n",
  г: "g",
  ш: "sh",
  з: "z",
  х: "h",
  Ф: "F",
  Ы: "Y",
  В: "V",
  А: "A",
  П: "P",
  Р: "R",
  О: "O",
  Л: "L",
  Д: "D",
  Ж: "Zh",
  Э: "E",
  ф: "f",
  ы: "y",
  в: "v",
  а: "a",
  п: "p",
  р: "r",
  о: "o",
  л: "l",
  д: "d",
  ж: "zh",
  э: "e",
  Я: "Ya",
  Ч: "Ch",
  С: "S",
  М: "M",
  И: "I",
  Т: "T",
  Ь: "'",
  Б: "B",
  Ю: "Yu",
  я: "ya",
  ч: "ch",
  с: "s",
  м: "m",
  и: "i",
  т: "t",
  ь: "'",
  б: "b",
  ю: "yu",
  Ў: "Ú",
  ў: "ú",
  ъ: "'",
  Ъ: "'",
  щ: "sch",
};

export const isCyrilicWord = (word: string) => {
  const cyrilicSymbols = [
    "Ё",
    "Й",
    "Ц",
    "У",
    "К",
    "Е",
    "Н",
    "Г",
    "Ш",
    "Щ",
    "З",
    "Х",
    "ё",
    "й",
    "ц",
    "у",
    "к",
    "е",
    "н",
    "г",
    "ш",
    "з",
    "х",
    "Ф",
    "Ы",
    "В",
    "А",
    "П",
    "Р",
    "О",
    "Л",
    "Д",
    "Ж",
    "Э",
    "ф",
    "ы",
    "в",
    "а",
    "п",
    "р",
    "о",
    "л",
    "д",
    "ж",
    "э",
    "Я",
    "Ч",
    "С",
    "М",
    "И",
    "Т",
    "Ь",
    "Б",
    "Ю",
    "я",
    "ч",
    "с",
    "м",
    "и",
    "т",
    "ь",
    "б",
    "ю",
    "Ў",
    "ў",
    "ъ",
    "Ъ",
    "щ",
  ];

  return word.split("").some((char) => cyrilicSymbols.includes(char));
};

export const transliterate = (word: string) => {
  return word
    .split("")
    .map((char: any) => {
      return lettersMap[char] || char;
    })
    .join("");
};

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
