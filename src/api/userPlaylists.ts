import { links } from "./links";
import { userClient } from "./user";
import {
  IPlaylist,
  PlaylistSong,
} from "../dataset/songs/interfaces";
import { withAuth } from "./utils";
interface GetResult {
  playlists: IPlaylist[];
  songs: PlaylistSong[];
  tags: string[];
}
export const userPlaylistApi = {
  getAllPlaylists: async (): Promise<GetResult> => {
    try {
      const res = await userClient.get(links.playlists, withAuth());

      return res.data;
    } catch (error) {
      console.log("error", error);
      return {
        playlists: [],
        songs: [],
        tags: [],
      };
    }
  },

  createPlaylist: async (data: IPlaylist): Promise<any> => {
    try {
      const res = await userClient.post(links.playlists, data, withAuth());

      return res.data;
    } catch (error) {
      console.log("error", error);
    }
  },

  deletePlaylist: async (id: string): Promise<void> => {
    try {
      await userClient.delete(`${links.playlists}/${id}`, withAuth());
    } catch (error) {
      console.log("error", error);
    }
  },

  updatePlaylist: async (id: string, data: IPlaylist): Promise<any> => {
    try {
      const res = await userClient.put(`${links.playlists}/${id}`, data, withAuth());

      return res.data;
    } catch (error) {
      console.log("error", error);
    }
  },

  addSongToPlaylist: async (song: PlaylistSong): Promise<any> => {
    try {
      const res = await userClient.post(
        `${links.playlists}/songs`,
        song,
        withAuth()
      );

      return res.data;
    } catch (error) {
      console.log("error", error);
    }
  },

  deleteSongFromPlaylist: async (songId: string): Promise<void> => {
    try {
      await userClient.delete(`${links.playlists}/songs/${songId}`, withAuth());
    } catch (error) {
      console.log("error", error);
    }
  },

  updateSongInPlaylist: async (songId: string, data: any): Promise<any> => {
    try {
      const res = await userClient.post(
        `${links.playlists}/songs/${songId}`,
        data,
        withAuth()
      );

      return res.data;
    } catch (error) {
      console.log("error", error);
    }
  },

  addTagToPlaylistSong: async (tags: string[]): Promise<any> => {
    try {
      const res = await userClient.post(`${links.playlists}/tags`, tags, withAuth());

      return res.data;
    } catch (error) {
      console.log("error", error);
    }
  },
};
