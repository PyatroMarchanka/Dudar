import { useContext, useEffect, useState } from "react";
import { store } from "../context";
import { transliterate, useIsCyrylicLang } from "../locales";

export const useSongTitle = () => {
  const {
    state: { activeSong, language },
  } = useContext(store);
  const isCyrylicLang = useIsCyrylicLang();
  const [songTitle, setSongTitle] = useState(activeSong?.name);

  useEffect(() => {
    setSongTitle(!isCyrylicLang() ? transliterate(activeSong?.name || "") : activeSong?.name);
  }, [language, activeSong, isCyrylicLang]);

  return songTitle;
};
