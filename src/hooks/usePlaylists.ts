import { useContext, useEffect, useState } from "react";
import { store } from "../context";
import { useGoogleProfile } from "./useGoogleProfile";
import { useUserPlaylists } from "./useUserPlaylists";
import { IPlaylist } from "../dataset/songs/interfaces";

const sortSongs = (songs: { name: string; tags: string[] }[]) => {
  return songs.sort((a, b) => a.name.localeCompare(b.name));
};

export const usePlaylists = () => {
  const {
    state: { userData },
  } = useContext(store);

  useGoogleProfile();
  const {
    playlists: loadedPlaylists,
    loading,
    error,
    updatePlaylists,
    createPlaylist,
    deletePlaylist,
  } = useUserPlaylists();

  const initialSongs = [
    { name: "Greensleeves", tags: ["medieval", "dance"] },
    { name: "Saltarello", tags: ["medieval", "dance"] },
    { name: "Douce Dame Jolie", tags: ["medieval", "ballad"] },
    { name: "La Rotta", tags: ["medieval", "dance"] },
    { name: "Lamento di Tristano", tags: ["medieval", "instrumental"] },
    { name: "Estampie", tags: ["medieval", "dance"] },
    { name: "Cantiga 166", tags: ["medieval", "instrumental"] },
    { name: "Palästinalied", tags: ["medieval", "ballad"] },
    { name: "Trotto", tags: ["medieval", "dance"] },
    { name: "Ecco la Primavera", tags: ["medieval", "ballad"] },
  ];

  const uniqueTags = Array.from(
    new Set(initialSongs.flatMap((song) => song.tags))
  );

  const [tags, setTags] = useState(uniqueTags);
  const [songs, setSongs] = useState(sortSongs(initialSongs));
  const [editedSong, setEditedSong] = useState<string | null>(null);
  const [playlists, setPlaylists] = useState<IPlaylist[]>(loadedPlaylists);

  useEffect(() => {
    setPlaylists(loadedPlaylists);
  }, [loadedPlaylists]);

  const onAddPlaylist = async (playlist: IPlaylist) => {
    setPlaylists([
      ...playlists.filter((p) => p.name !== playlist.name),
      playlist,
    ]);
    if (playlist._id) {
      console.log("playlist._id", playlist._id);
      await updatePlaylists(playlist._id, playlist);
    } else {
      await createPlaylist(playlist);
    }
  };

  const onRemovePlaylist = async (_id: string) => {
    setPlaylists(playlists.filter((p) => p._id !== _id));
    await deletePlaylist(_id);
  };

  const onAddTag = (tag: string) => {
    setTags([...tags, tag]);
  };

  const onRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const onAddSong = (song: { name: string; tags: string[] }) => {
    const updatedSongs = [...songs.filter((s) => s.name !== song.name), song];
    const orderedSongs = sortSongs(updatedSongs);
    setSongs(orderedSongs);
  };

  const onUpdatedSong = (song: { name: string; tags: string[] }) => {
    const updatedSongs = songs.map((s) => (s.name === song.name ? song : s));
    const orderedSongs = sortSongs(updatedSongs);
    setSongs(orderedSongs);
  };

  const onRemoveSong = (songName: string) => {
    setSongs(songs.filter((song) => song.name !== songName));
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
