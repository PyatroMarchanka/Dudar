import { useContext, useEffect, useState } from "react";
import { store } from "../context";

export const useSongList = () => {
  const { setAllLists: setAllListContext } = useContext(store);

  const [songList, setSongList] = useState<string[]>([]);
  const [allLists, setAllLists] = useState<{ [key: string]: string[] }>({});
  const initialList = Object.keys(allLists)[0];

  const getAllList = async () => {
    const file = await fetch("midi/list.json");
    const list = await file.json();

    setAllLists(list);
    setAllListContext(list);
  };

  useEffect(() => {
    setSongList(allLists[initialList] || {});
  }, [allLists]);

  useEffect(() => {
    getAllList();
  }, []);

  return { songList, allLists };
};
