import React, { useState } from "react";
import styled from "styled-components";
import { Song, SongItem } from "./SongItem";
import { AddNewSong } from "./AddNewSong";

interface SongEditorProps {
  songs: Song[];
  tags: string[];
  onAddSong: (song: Song) => void;
  onRemoveSong: (songName: string) => void;
  onUpdatedSong: (song: Song) => void;
  editingSong: string | null;
  setEditingSong: React.Dispatch<React.SetStateAction<string | null>>
}

export const SongEditor: React.FC<SongEditorProps> = ({
  songs,
  tags,
  onAddSong,
  onUpdatedSong,
  onRemoveSong,
  editingSong,
  setEditingSong
}) => {
  const [songTags, setSongTags] = useState<string[]>([]);
  const handleAddSong = (song: Song) => {
    if (song.name.trim() === "") return;
    onAddSong(song);
  };

  const onSongClick = (song: string) => {
    if (editingSong === song) {
      setEditingSong(null);
    } else {
      setEditingSong(song);
      setSongTags(songs.find((s) => s.name === song)?.tags || []);
    }
  };

  return (
    <Container>
      <>
        <AddNewSong
          tags={tags}
          handleAddSong={handleAddSong}
        />
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
      </>
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
