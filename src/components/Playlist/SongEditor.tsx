import React, { useState } from "react";
import styled from "styled-components";
import {
  IconButton,
  TextField,
  Button,
  Typography,
  Chip,
} from "@material-ui/core";
import Close from "@material-ui/icons/Close";
import { Icon } from "../global/Icon";
import { ExpandLess, ExpandMore } from "@material-ui/icons";

interface Song {
  name: string;
  tags: string[];
}

interface SongEditorProps {
  songs: Song[];
  tags: string[];
  onAddSong: (song: Song) => void;
  onRemoveSong: (songName: string) => void;
}

export const SongEditor: React.FC<SongEditorProps> = ({
  songs,
  tags,
  onAddSong,
  onRemoveSong,
}) => {
  const [newSong, setNewSong] = useState<string>("");
  const [editingSong, setEditingSong] = useState<string | null>(null);
  const [songTags, setSongTags] = useState<string[]>([]);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState<boolean>(false);

  const handleAddSong = () => {
    if (newSong.trim() === "") return;
    onAddSong({ name: newSong, tags: songTags });
    setNewSong("");
    setSongTags([]);
  };

  const handleEditTags = (songName: string) => {
    const song = songs.find((s) => s.name === songName);
    if (song) {
      setEditingSong(songName);
      setSongTags(song.tags);
    }
  };

  const handleSaveTags = () => {
    if (editingSong) {
      onAddSong({ name: editingSong, tags: songTags });
      setEditingSong(null);
      setSongTags([]);
    }
  };

  const handleTagClick = (tag: string) => {
    if (songTags.includes(tag)) {
      setSongTags(songTags.filter((t) => t !== tag));
    } else {
      setSongTags([...songTags, tag]);
    }
  };

  return (
    <Container>
      <PlaylistHeader onClick={() => setIsPlaylistOpen(!isPlaylistOpen)}>
        <Typography variant="h3">Song Editor</Typography>
        <IconButton>
          {isPlaylistOpen ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </PlaylistHeader>
      {isPlaylistOpen && (
        <>
          <InputContainer>
            <TextField
              label="New Song"
              value={newSong}
              onChange={(e) => setNewSong(e.target.value)}
              variant="outlined"
            />
            <Button onClick={handleAddSong} variant="contained" color="primary">
              Add Song
            </Button>
          </InputContainer>
          <SongList>
            {songs.map((song) => (
              <SongItem
                key={song.name}
                onClick={() => handleEditTags(song.name)}
              >
                {song.name}
                {editingSong && editingSong === song.name && (
                  <div>
                    <TagContainer>
                      {tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTagClick(tag)}}
                          onDelete={
                            songTags.includes(tag)
                              ? () => handleTagClick(tag)
                              : undefined
                          }
                          deleteIcon={
                            songTags.includes(tag) ? <Close /> : undefined
                          }
                          color={songTags.includes(tag) ? "primary" : "default"}
                        />
                      ))}
                    </TagContainer>
                    <Button
                      onClick={handleSaveTags}
                      variant="contained"
                      color="primary"
                    >
                      Save Tags
                    </Button>
                  </div>
                )}
                <IconButton onClick={() => onRemoveSong(song.name)}>
                  <Icon type="material" Icon={Close} />
                </IconButton>
              </SongItem>
            ))}
          </SongList>
        </>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  gap: 10px;
`;

const SongList = styled.ul`
  list-style: none;
  padding: 0;
`;

const SongItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
`;

const PlaylistHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  margin-top: 20px;
`;
