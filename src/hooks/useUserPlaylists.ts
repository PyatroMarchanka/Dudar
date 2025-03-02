import { useState, useEffect, useCallback } from "react";
import { userPlaylistApi } from "../api/userPlaylists";
import {
  IPlaylist,
  PlaylistSong,
} from "../dataset/songs/interfaces";

export const useUserPlaylists = () => {
  const [playlists, setPlaylists] = useState<IPlaylist[]>([]);
  const [songs, setSongs] = useState<PlaylistSong[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlaylists = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { playlists, songs, tags } =
        await userPlaylistApi.getAllPlaylists();
      setPlaylists(playlists);
      setSongs(songs);
      setTags(tags);
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

  const addSong = useCallback(
    async (song: PlaylistSong) => {
      setLoading(true);
      setError(null);

      try {
        await userPlaylistApi.addSongToPlaylist(song);
        await fetchPlaylists();
      } catch (err) {
        setError("Failed to add song to playlist");
      } finally {
        setLoading(false);
      }
    },
    [fetchPlaylists]
  );

  const deleteSong = useCallback(
    async (songId: string) => {
      setLoading(true);
      setError(null);

      try {
        await userPlaylistApi.deleteSongFromPlaylist(songId);
        await fetchPlaylists();
      } catch (err) {
        setError("Failed to delete song from playlist");
      } finally {
        setLoading(false);
      }
    },
    [fetchPlaylists]
  );

  const updateSong = useCallback(
    async (song: PlaylistSong) => {
      setLoading(true);
      setError(null);

      try {
        await userPlaylistApi.updateSongInPlaylist(song._id!, song);
        await fetchPlaylists();
      } catch (err) {
        setError("Failed to update song in playlist");
      } finally {
        setLoading(false);
      }
    },
    [fetchPlaylists]
  );

  const updateTags = useCallback(
    async (tags: string[]) => {
      setLoading(true);
      setError(null);

      try {
        await userPlaylistApi.addTagToPlaylistSong(tags);
        await fetchPlaylists();
      } catch (err) {
        setError("Failed to add tag to playlist song");
      } finally {
        setLoading(false);
      }
    },
    [fetchPlaylists]
  );

  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  return {
    playlists,
    songs,
    tags,
    loading,
    error,
    updatePlaylists,
    createPlaylist,
    deletePlaylist,
    updateTags,
    addSong,
    deleteSong,
    updateSong,
  };
};
