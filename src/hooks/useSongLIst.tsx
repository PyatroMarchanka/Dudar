import { useEffect, useState } from "react";

export const useSongList = () => {
  const [songList, setSongList] = useState<string[]>([]);
  const getSongList = async () => {
    const file = await fetch("/midi/list.json");
    const list = await file.json();
    setSongList(list);
  };

  useEffect(() => {
    getSongList();
  }, []);

  return { songList };
};
