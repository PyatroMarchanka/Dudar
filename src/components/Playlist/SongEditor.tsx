import React from "react";
import styled from "styled-components";
import { SongItem } from "./SongItem";
import { AddNewSong } from "./AddNewSong";
import { PlaylistSong } from "../../dataset/songs/interfaces";

interface SongEditorProps {
  songs: PlaylistSong[];
  tags: string[];
  onAddSong: (song: PlaylistSong) => void;
  onRemoveSong: (songName: string) => void;
  onUpdatedSong: (song: PlaylistSong) => void;
  editingSong: string | null;
  setEditingSong: React.Dispatch<React.SetStateAction<string | null>>;
}

export const SongEditor: React.FC<SongEditorProps> = ({
  songs,
  tags,
  onAddSong,
  onUpdatedSong,
  onRemoveSong,
  editingSong,
  setEditingSong,
}) => {
  const handleAddSong = (song: PlaylistSong) => {
    if (song.name.trim() === "") return;
    onAddSong(song);
  };

  const onSongClick = (song: string) => {
    if (editingSong === song) {
      setEditingSong(null);
    } else {
      setEditingSong(song);
    }
  };

  return (
    <Container>
      <AddNewSong tags={tags} handleAddSong={handleAddSong} />
      <SongList>
        {songs.map((song) => (
          <SongItem
            key={song.name}
            song={song}
            isEdited={editingSong === song.name}
            onSongClick={onSongClick}
            onUpdatedSong={onUpdatedSong}
            tags={tags}
            onRemoveSong={onRemoveSong}
          />
        ))}
      </SongList>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const SongList = styled.ul`
  list-style: none;
  padding: 0;
`;
