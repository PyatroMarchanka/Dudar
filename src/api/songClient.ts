import axios from 'axios';
import { Song } from '../dataset/songs/interfaces';
import { links } from './links';

export const resolveSongUrl = (pathName: string) => {
  const cleanedPath = pathName.replace(/^\/?midi\//, '');
  const baseUrl = `${process.env.PUBLIC_URL ?? ''}/midi`.replace(/\/+/g, '/').replace(/\/$/, '');
  return `${baseUrl}/${cleanedPath}`;
};

export const songServerClient = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  timeout: 20000,
});

// A song's notes live under a URL that changes with every edit of the song
// (?v=<updatedAt>), so the browser and the service worker can keep a copy
// forever and an edit still reaches everyone: the new version has a new URL.
export const getSongNotesUrl = (song: Pick<Song, '_id' | 'updatedAt'>) =>
  `${links.songs}/${encodeURIComponent(song._id ?? '')}?v=${encodeURIComponent(String(song.updatedAt ?? ''))}`;

export const songApi = {
  // The song with its notes (`melody`), for songs stored in the database
  getSongNotes: async (song: Song): Promise<Song> => {
    const res = await songServerClient.get(getSongNotesUrl(song));
    return res.data;
  },

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
