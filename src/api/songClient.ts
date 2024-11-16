import axios from "axios";
import { Song } from "../dataset/songs/interfaces";
import { links } from "./links";

export const songClient = axios.create({
  baseURL:
    "https://raw.githubusercontent.com/PyatroMarchanka/dudahero-midi/main/midi/",
});

export const songServerClient = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
});

export const songApi = {
  getSong: async (song: Song) => {
    const res = await songClient.get(song.pathName, {
      responseType: "blob",
    });

    return res.data;
  },
  getSongList: async (): Promise<Song[]> => {
    console.log('getSongList')
    const res = await songServerClient.get(links.songs);
    console.log('res', res)
    return res.data;
  },
  updateSong: async (song: Song) => {
    if(!song._id) return;

    const res = await songServerClient.put(`${links.songs}/${song._id}`, song);
    return res.data;
  },
  getSongData: async (_id: string) => {
    const res = await songServerClient.get(`${links.songs}/${_id}`);
    return res.data;
  }
};
