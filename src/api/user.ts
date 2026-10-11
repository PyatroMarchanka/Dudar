import axios from "axios";
import { links } from "./links";
import cookie from "react-cookies";
import { isFluteBrand } from "../brand";
import { defaultUser, FluteSettings, fluteSettingsKeys, User, UserSettings } from "../interfaces/user";

const authHeaders = () => ({
  Authorization: `Bearer ${cookie.load("jwtToken")}`,
  userId: cookie.load("userId"),
});

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

  updateUserSettings: (data: { settings: Partial<UserSettings> }) => {
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
    try {
      const res = await userClient.get(links.profile, {
        headers: {
          Authorization: `Bearer ${cookie.load("jwtToken")}`,
          userId: cookie.load("userId"),
        },
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      console.log("error", error);
      return;
    }
  },

  getFluteSettings: async (): Promise<Partial<FluteSettings> | undefined> => {
    try {
      const res = await userClient.get(links.fluteSettings, {
        headers: authHeaders(),
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      console.log("error", error);
      return;
    }
  },

  updateFluteSettings: async (data: Partial<FluteSettings>) => {
    try {
      const res = await userClient.post(links.updateFluteSettings, data, {
        headers: authHeaders(),
        withCredentials: true,
      });

      return res.data;
    } catch (error) {
      console.log("error", error);
    }
  },

  // On the flute site transpose, tempo and the last song go to the separate flute
  // settings; the rest (language, preclick, ...) stays shared between the sites.
  updateUserSettings: async (data: Partial<UserSettings>) => {
    if (isFluteBrand) {
      const flute: Partial<FluteSettings> = {};
      const shared: Partial<UserSettings> = { ...data };
      fluteSettingsKeys.forEach((key) => {
        if (key in shared) {
          (flute as any)[key] = shared[key];
          delete shared[key];
        }
      });
      if (Object.keys(flute).length) {
        await userApi.updateFluteSettings(flute);
      }
      if (!Object.keys(shared).length) {
        return;
      }
      data = shared;
    }
    try {
      const res = await userClient.post(links.updateSettings, data, {
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

export const login = async () => {
  return await userClient.get(links.login, { withCredentials: true });
};

export const loginServer = async (body: any) => {
  return await userClient.post(links.loginServer, body, {
    withCredentials: true,
  });
};

export const logout = async () => {
  return await userClient.get(links.logout, { withCredentials: true });
};
