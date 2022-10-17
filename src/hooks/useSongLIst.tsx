import { useContext, useEffect, useState } from "react";
import { store } from "../context";

export const useSongList = () => {
  const {
    state: { genreList },
    setAllLists: setAllListContext,
  } = useContext(store);

  const [songList, setSongList] = useState<string[]>([]);
  const [allLists, setAllLists] = useState<{ [key: string]: string[] }>({});
  const initialList = Object.keys(allLists)[0];

  const getAllList = async () => {
    const file = await fetch("midi/list.json");
    const list = await file.json();
    console.log("list", list);

    setSongList(list[genreList || initialList] || {});
    setAllLists(list);
    setAllListContext(list);
  };

  useEffect(() => {
    setSongList(allLists[genreList || initialList] || {});
  }, [genreList, allLists]);

  useEffect(() => {
    getAllList();
  }, []);

  return { songList, allLists };
};
