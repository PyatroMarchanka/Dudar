import { links } from "./links";
import cookie from "react-cookies";
import { userClient } from "./user";
import { IPlaylist } from "../dataset/songs/interfaces";

export const userPlaylistApi = {
  getAllPlaylists: async (): Promise<IPlaylist[] | undefined> => {
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
    }
  },

  createPlaylist: async (data: IPlaylist): Promise<any> => {
    try {
      console.log('createPlaylist data', data)
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
      await userClient.delete(`${links.playlist}/${id}`, {
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
    console.log('updatePlaylist data', data, `${links.playlist}/${id}`)
    try {
      const res = await userClient.put(`${links.playlist}/${id}`, data, {
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
