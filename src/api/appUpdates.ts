import axios from 'axios';
import { links } from './links';
import type { AppUpdate } from '../interfaces/appUpdate';

export const appUpdatesApi = {
  getLatestUpdates: async (limit = 20): Promise<AppUpdate[]> => {
    const response = await axios.get(`${links.updates}?limit=${limit}`);
    return response.data;
  },
};
