import { links } from "./links";
import cookie from "react-cookies";
import { userClient } from "./user";
import {
  IPlaylist,
  PlaylistSong,
} from "../dataset/songs/interfaces";
interface GetResult {
  playlists: IPlaylist[];
  songs: PlaylistSong[];
  tags: string[];
}
export const userPlaylistApi = {
  getAllPlaylists: async (): Promise<GetResult> => {
    try {
      const res = await userClient.get(links.playlists, {
        headers: {
          Authorization: `Bearer ${cookie.load("jwtToken")}`,
          userId: cookie.load("userId"),
        },
        withCredentials: true,
      });

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
      const res = await userClient.post(links.playlists, data, {
        headers: {
          Authorization: `Bearer ${cookie.load("jwtToken")}`,
          userId: cookie.load("userId"),
        },
        withCredentials: true,
      });

      return res.data;
    } catch (error) {
      console.log("error", error);
    }
  },

  deletePlaylist: async (id: string): Promise<void> => {
    try {
      await userClient.delete(`${links.playlists}/${id}`, {
        headers: {
          Authorization: `Bearer ${cookie.load("jwtToken")}`,
          userId: cookie.load("userId"),
        },
        withCredentials: true,
      });
    } catch (error) {
      console.log("error", error);
    }
  },

  updatePlaylist: async (id: string, data: IPlaylist): Promise<any> => {
    try {
      const res = await userClient.put(`${links.playlists}/${id}`, data, {
        headers: {
          Authorization: `Bearer ${cookie.load("jwtToken")}`,
          userId: cookie.load("userId"),
        },
        withCredentials: true,
      });

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
        {
          headers: {
            Authorization: `Bearer ${cookie.load("jwtToken")}`,
            userId: cookie.load("userId"),
          },
          withCredentials: true,
        }
      );

      return res.data;
    } catch (error) {
      console.log("error", error);
    }
  },

  deleteSongFromPlaylist: async (songId: string): Promise<void> => {
    try {
      await userClient.delete(`${links.playlists}/songs/${songId}`, {
        headers: {
          Authorization: `Bearer ${cookie.load("jwtToken")}`,
          userId: cookie.load("userId"),
        },
        withCredentials: true,
      });
    } catch (error) {
      console.log("error", error);
    }
  },

  updateSongInPlaylist: async (songId: string, data: any): Promise<any> => {
    try {
      const res = await userClient.post(
        `${links.playlists}/songs/${songId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${cookie.load("jwtToken")}`,
            userId: cookie.load("userId"),
          },
          withCredentials: true,
        }
      );

      return res.data;
    } catch (error) {
      console.log("error", error);
    }
  },

  addTagToPlaylistSong: async (tags: string[]): Promise<any> => {
    try {
      const res = await userClient.post(`${links.playlists}/tags`, tags, {
        headers: {
          Authorization: `Bearer ${cookie.load("jwtToken")}`,
          userId: cookie.load("userId"),
        },
        withCredentials: true,
      });

      return res.data;
    } catch (error) {
      console.log("error", error);
    }
  },
};
