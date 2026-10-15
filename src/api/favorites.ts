import { links } from './links';
import { userClient } from './user';
import { withAuth } from './utils';

interface FavoritesResult {
  favoriteSongs: string[];
}

// Each call returns the user's full, updated list of favorite song ids
export const favoritesApi = {
  getFavoriteSongs: async (): Promise<string[]> => {
    const res = await userClient.get<FavoritesResult>(links.favorites, withAuth());
    return res.data.favoriteSongs;
  },

  addFavoriteSong: async (songId: string): Promise<string[]> => {
    const res = await userClient.put<FavoritesResult>(
      `${links.favorites}/${encodeURIComponent(songId)}`,
      null,
      withAuth()
    );
    return res.data.favoriteSongs;
  },

  removeFavoriteSong: async (songId: string): Promise<string[]> => {
    const res = await userClient.delete<FavoritesResult>(
      `${links.favorites}/${encodeURIComponent(songId)}`,
      withAuth()
    );
    return res.data.favoriteSongs;
  },
};
