import axios from 'axios';
import { Song } from '../dataset/songs/interfaces';
import { links } from './links';

const resolveSongUrl = (pathName: string) => {
  const cleanedPath = pathName.replace(/^\/?midi\//, '');
  const baseUrl = `${process.env.PUBLIC_URL ?? ''}/midi`.replace(/\/+/g, '/').replace(/\/$/, '');
  return `${baseUrl}/${cleanedPath}`;
};

export const songServerClient = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
});

export const songApi = {
  getSong: async (song: Song) => {
    const url = resolveSongUrl(song.pathName);
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Failed to load song from public folder: ${res.status} ${res.statusText}`);
    }

    return await res.blob();
  },

  getSongList: async (): Promise<Song[]> => {
    const res = await songServerClient.get(links.songs);
    return res.data;
  },
  updateSong: async (song: Song) => {
    if (!song._id) return;

    const res = await songServerClient.put(`${links.adminSong}/${song._id}`, song, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res.data;
  },
  getSongData: async (_id: string) => {
    const res = await songServerClient.get(`${links.songs}/${_id}`);
    return res.data;
  },
  updateSongViewsCount: async (song: Song) => {
    if (!song._id) return;

    const res = await songServerClient.put(`${links.songViews}/${song._id}`, song);
    return res.data;
  },
  getTopSongs: async (limit: number = 10) => {
    const res = await songServerClient.get(`${links.topSongs}?limit=${limit}`);
    return res.data;
  },
  getNewSongs: async (limit: number = 10) => {
    const res = await songServerClient.get(`${links.newSongs}?limit=${limit}`);
    return res.data;
  },
};
