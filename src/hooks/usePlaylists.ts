import { useEffect, useState } from "react";
import { useGoogleProfile } from "./useGoogleProfile";
import { useUserPlaylists } from "./useUserPlaylists";
import { IPlaylist, PlaylistSong } from "../dataset/songs/interfaces";

const sortSongs = (songs: { name: string; tags: string[] }[]) => {
  return songs.sort((a, b) => a.name.localeCompare(b.name));
};

export const usePlaylists = () => {
  useGoogleProfile();
  const {
    playlists: loadedPlaylists,
    songs: loadedSongs,
    tags: loadedTags,
    updatePlaylists,
    createPlaylist,
    deletePlaylist,
    updateTags,
    addSong,
    deleteSong,
    updateSong,
  } = useUserPlaylists();

  const [tags, setTags] = useState<string[]>(loadedTags || []);
  const [songs, setSongs] = useState<PlaylistSong[]>(
    sortSongs(loadedSongs) || []
  );
  const [playlists, setPlaylists] = useState<IPlaylist[]>(
    loadedPlaylists || []
  );
  const [editedSong, setEditedSong] = useState<string | null>(null);

  useEffect(() => {
    setPlaylists(loadedPlaylists);
  }, [loadedPlaylists]);

  useEffect(() => {
    setSongs(sortSongs(loadedSongs || []));
  }, [loadedSongs]);

  useEffect(() => {
    setTags(loadedTags);
  }, [loadedTags]);

  const onAddPlaylist = async (playlist: IPlaylist) => {
    if (playlist._id) {
      await updatePlaylists(playlist._id, playlist);
    } else {
      await createPlaylist(playlist);
    }
  };

  const onRemovePlaylist = async (_id: string) => {
    setPlaylists(playlists.filter((p) => p._id !== _id));
    await deletePlaylist(_id);
  };

  const onAddTag = async (tag: string) => {
    if (tags?.includes(tag)) return;
    const newTags = [...tags, tag];
    setTags(newTags);

    await updateTags(newTags);
  };

  const onRemoveTag = async (tag: string) => {
    const newTags = tags.filter((t) => t !== tag);
    setTags(newTags);

    await updateTags(newTags);
  };

  const onAddSong = async (song: { name: string; tags: string[] }) => {
    const updatedSongs = [...songs.filter((s) => s.name !== song.name), song];
    const orderedSongs = sortSongs(updatedSongs);
    setSongs(orderedSongs);
    await addSong(song);
  };

  const onUpdatedSong = async (song: PlaylistSong) => {
    const updatedSongs = songs.map((s) => (s.name === song.name ? song : s));
    const orderedSongs = sortSongs(updatedSongs);
    setSongs(orderedSongs);
    await updateSong(song);
  };

  const onRemoveSong = async (songId: string) => {
    setSongs(songs.filter((song) => song._id !== songId));
    await deleteSong(songId);
  };

  return {
    tags,
    songs,
    editedSong,
    playlists,
    setEditedSong,
    onAddPlaylist,
    onRemovePlaylist,
    onAddTag,
    onRemoveTag,
    onAddSong,
    onUpdatedSong,
    onRemoveSong,
  };
};
