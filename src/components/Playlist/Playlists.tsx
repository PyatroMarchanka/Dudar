import React, { useContext, useState } from "react";
import { PlaylistCreator } from "./PlaylistEditor";
import { SongEditor } from "./SongEditor";
import { store } from "../../context";
import { useGoogleProfile } from "../../hooks/useGoogleProfile";
import { TagEditor } from "./TagEditor";

interface Props {}

const sortSongs = (songs: { name: string; tags: string[] }[]) => {
  return songs.sort((a, b) => a.name.localeCompare(b.name));
};

export const Playlists = (props: Props) => {
  const {
    state: { userData },
  } = useContext(store);

  useGoogleProfile();

  const initialSongs = [
    { name: "Bohemian Rhapsody", tags: ["rock", "classic"] },
    { name: "Billie Jean", tags: ["pop", "dance"] },
    { name: "Hotel California", tags: ["rock", "classic"] },
    { name: "Shape of You", tags: ["pop", "dance"] },
    { name: "Stairway to Heaven", tags: ["rock", "classic"] },
  ];

  const uniqueTags = Array.from(
    new Set(initialSongs.flatMap((song) => song.tags))
  );

  const [tags, setTags] = useState(uniqueTags);
  const [songs, setSongs] = useState(sortSongs(initialSongs));

  const [playlists, setPlaylists] = useState([
    {
      title: "My first playlist",
      songs: [{ name: "Bohemian Rhapsody", tags: ["rock", "classic"] }],
    },
  ]);

  const onAddPlaylist = (playlist: {
    title: string;
    songs: { name: string; tags: string[] }[];
  }) => {
    setPlaylists([
      ...playlists.filter((p) => p.title !== playlist.title),
      playlist,
    ]);
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

  const onRemoveSong = (songName: string) => {
    setSongs(songs.filter((song) => song.name !== songName));
  };

  return (
    <div>
      <PlaylistCreator
        allSongs={songs}
        playlists={playlists}
        onAddPlaylist={onAddPlaylist}
      />
      <SongEditor
        tags={tags}
        songs={songs}
        onAddSong={onAddSong}
        onRemoveSong={onRemoveSong}
      />
      <TagEditor tags={tags} onAddTag={onAddTag} onRemoveTag={onRemoveTag} />
    </div>
  );
};
