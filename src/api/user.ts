import axios from "axios";
import { links } from "./links";
import cookie from 'react-cookies'

export const userClient = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
});

export const userApi = {
  getUserData: async () => {
    const res = await userClient.get(links.profile, {
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
