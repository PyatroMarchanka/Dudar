import { links } from './links';
import { userClient } from './user';
import { withAuth } from './utils';
import { Song, SongMelody, SongVersion } from '../dataset/songs/interfaces';

// What the notes editor changes in a catalog song
export interface SongNotesChange {
  name: string;
  melody: SongMelody;
  timeSignature: string;
  // Double the real BPM, as everywhere in the catalog
  originalTempo: number;
  bagpipesToPlay?: string[];
}

// What the admin sends for a version: a .mid path, or the notes of a version stored in the database
export type VersionInput = Omit<SongVersion, '_id' | 'createdAt' | 'updatedAt'>;

const url = (id: string) => `${links.adminSong}/${encodeURIComponent(id)}`;

// Catalog songs as the admin sees them. The server lets only admins in.
export const adminSongsApi = {
  // The whole catalog as stored, without the notes of database songs
  list: async (): Promise<Song[]> => {
    const res = await userClient.get<Song[]>(links.adminSong, withAuth());
    return res.data;
  },

  // As stored, with its notes: never an old copy from the browser's cache
  get: async (id: string): Promise<Song> => {
    const res = await userClient.get<Song>(url(id), withAuth());
    return res.data;
  },

  saveNotes: async (id: string, change: SongNotesChange): Promise<Song> => {
    const res = await userClient.put<Song>(url(id), change, withAuth());
    return res.data;
  },

  addVersion: async (id: string, version: VersionInput): Promise<Song> => {
    const res = await userClient.post<Song>(`${url(id)}/versions`, version, withAuth());
    return res.data;
  },

  updateVersion: async (id: string, versionId: string, version: VersionInput): Promise<Song> => {
    const res = await userClient.put<Song>(`${url(id)}/versions/${encodeURIComponent(versionId)}`, version, withAuth());
    return res.data;
  },

  removeVersion: async (id: string, versionId: string): Promise<Song> => {
    const res = await userClient.delete<Song>(`${url(id)}/versions/${encodeURIComponent(versionId)}`, withAuth());
    return res.data;
  },

  // The version becomes the one shown first; the song's old notes take its place
  makeDefaultVersion: async (id: string, versionId: string): Promise<Song> => {
    const res = await userClient.post<Song>(
      `${url(id)}/versions/${encodeURIComponent(versionId)}/make-default`,
      {},
      withAuth()
    );
    return res.data;
  },

  remove: async (id: string): Promise<Song> => {
    const res = await userClient.delete<Song>(url(id), withAuth());
    return res.data;
  },
};
