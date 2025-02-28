import { useState, useEffect, useCallback } from "react";
import { userPlaylistApi } from "../api/userPlaylists";
import { IPlaylist } from "../dataset/songs/interfaces";

export const useUserPlaylists = () => {
  const [playlists, setPlaylists] = useState<IPlaylist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlaylists = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userPlaylistApi.getAllPlaylists();
      if (data) {
        setPlaylists(data);
      }
    } catch (err) {
      setError("Failed to load playlists");
    } finally {
      setLoading(false);
    }
  }, []);

  const createPlaylist = useCallback(
    async (data: IPlaylist) => {
      setLoading(true);
      setError(null);

      try {
        await userPlaylistApi.createPlaylist(data);
        await fetchPlaylists();
      } catch (err) {
        setError("Failed to create playlist");
      } finally {
        setLoading(false);
      }
    },
    [fetchPlaylists]
  );

  const updatePlaylists = useCallback(
    async (id: string, data: IPlaylist) => {
      console.log('updatePlaylists data', data, id)
      setLoading(true);
      setError(null);

      try {
        await userPlaylistApi.updatePlaylist(id, data);
        await fetchPlaylists();
      } catch (err) {
        setError("Failed to update playlist");
      } finally {
        setLoading(false);
      }
    },
    [fetchPlaylists]
  );

  const deletePlaylist = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);

      try {
        await userPlaylistApi.deletePlaylist(id);
        await fetchPlaylists();
      } catch (err) {
        setError("Failed to delete playlist");
      } finally {
        setLoading(false);
      }
    },
    [fetchPlaylists]
  );

  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  return { playlists, loading, error, updatePlaylists, createPlaylist, deletePlaylist };
};
