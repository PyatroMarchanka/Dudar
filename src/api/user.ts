import axios from "axios";
import { links } from "./links";
import cookie from "react-cookies";
import { defaultUser, User, UserSettings } from "../interfaces/user";

export const userClient = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  withCredentials: true,
});

export const localstorageUserApi = {
  getUserData: (): User => {
    const user = localStorage.getItem("user");
    if (!user) {
      return defaultUser;
    }

    const userObj = JSON.parse(user);
    return userObj;
  },

  updateUserSettings: (data: {settings: Partial<UserSettings>}) => {
    const user = localStorage.getItem("user");
    if (!user) {
      localStorage.setItem("user", JSON.stringify(data));
      return;
    }

    const userObj = JSON.parse(user);
    userObj.settings = { ...userObj.settings, ...data.settings };
    localStorage.setItem("user", JSON.stringify(userObj));
  },
};

export const userApi = {
  getUserData: async (): Promise<User | undefined> => {
    if (!cookie.load("jwtToken")) {
      return;
    }

    const res = await userClient.get(links.profile, {
      headers: {
        Authorization: `Bearer ${cookie.load("jwtToken")}`,
        userId: cookie.load("userId"),
      },
      withCredentials: true,
    });

    return res.data;
  },

  updateUserSettings: async (data: UserSettings) => {
    console.log(
      'updateUserSettings cookie.load("jwtToken")',
      cookie.load("jwtToken")
    );
    if (!cookie.load("jwtToken")) {
      return;
    }

    const res = await userClient.post(links.updateSettings, data, {
      headers: {
        Authorization: `Bearer ${cookie.load("jwtToken")}`,
        userId: cookie.load("userId"),
      },
      withCredentials: true,
    });

    return res.data;
  },
};

export const login = async () => {
  return await userClient.get(links.login, { withCredentials: true });
};

export const logout = async () => {
  return await userClient.get(links.logout, { withCredentials: true });
};
