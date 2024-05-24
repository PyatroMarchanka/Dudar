import axios from "axios";
import { Song } from "../dataset/songs/interfaces";

export const songClient = axios.create({
  baseURL:
    "https://raw.githubusercontent.com/PyatroMarchanka/dudahero-midi/main/midi/",
});

export const songApi = {
  getSong: async (song: Song) => {
    console.log('song', song.name)
    const res = await songClient.get(song.pathName, {
      responseType: "blob",
    });

    return res.data;
  },
  getSongList: async (): Promise<Song[]> => {
    const res = await songClient.get("list.json");

    return res.data;
  },
};
