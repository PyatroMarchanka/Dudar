import axios from "axios";
import { links } from "./links";
import cookie from "react-cookies";
import { User, UserSettings } from "../interfaces/user";

export const userClient = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  withCredentials: true,
});

export const userApi = {
  getUserData: async (): Promise<User | undefined> => {
    console.log('getUserData cookie.load("jwtToken")', cookie.load("jwtToken"))
    if (!cookie.load("jwtToken")) {
      return;
    }

    const res = await userClient.get(links.profile, {
      headers: {
        Authorization: `Bearer ${cookie.load("jwtToken")}`,
        userId: cookie.load("userId"),
      },
    });

  return res.data;
  },

  updateUserSettings: async (data: UserSettings) => {
    console.log('updateUserSettings cookie.load("jwtToken")', cookie.load("jwtToken"))
    if (!cookie.load("jwtToken")) {
      return;
    }

    const res = await userClient.post(links.updateSettings, data, {
      headers: {
        Authorization: `Bearer ${cookie.load("jwtToken")}`,
        userId: cookie.load("userId"),
      },
    });

    return res.data;
  },
};

export const login = async () => {
  return await userClient.get(links.login);
};

export const logout = async () => {
  return await userClient.get(links.logout);
};
