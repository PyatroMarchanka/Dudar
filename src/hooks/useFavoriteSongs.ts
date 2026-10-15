import { useContext } from 'react';
import { store } from '../context';
import { favoritesApi } from '../api/favorites';

// Some songs exist in several bagpipe variants that differ only by a `-bd`
// suffix; treat them as the same favorite (same rule as useSongList)
export const normalizeSongId = (id: string) => id.split('-bd').join('');

export const useFavoriteSongs = () => {
  const {
    state: { userData },
    setFavoriteSongs,
  } = useContext(store);

  const isLoggedIn = !!userData?._id;
  const favoriteSongs = userData?.favoriteSongs ?? [];

  const isFavorite = (songId: string) => favoriteSongs.some((id) => normalizeSongId(id) === normalizeSongId(songId));

  // Updates the list at once and rolls back if the server call fails
  const toggleFavorite = async (songId: string) => {
    if (!isLoggedIn) return;

    const previous = favoriteSongs;
    try {
      if (isFavorite(songId)) {
        const matching = previous.filter((id) => normalizeSongId(id) === normalizeSongId(songId));
        setFavoriteSongs(previous.filter((id) => !matching.includes(id)));
        let updated = previous;
        for (const id of matching) {
          updated = await favoritesApi.removeFavoriteSong(id);
        }
        setFavoriteSongs(updated);
      } else {
        setFavoriteSongs([...previous, songId]);
        setFavoriteSongs(await favoritesApi.addFavoriteSong(songId));
      }
    } catch (error) {
      console.log('error', error);
      setFavoriteSongs(previous);
    }
  };

  return { isLoggedIn, favoriteSongs, isFavorite, toggleFavorite };
};
