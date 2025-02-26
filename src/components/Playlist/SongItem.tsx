import { Button, Chip, IconButton } from "@material-ui/core";
import Close from "@material-ui/icons/Close";
import React, { useState } from "react";
import styled from "styled-components";
import { Icon } from "../global/Icon";

export interface Song {
  name: string;
  tags: string[];
}

interface Props {
  song: Song;
  isEdited: boolean;
  onRemoveSong: (songName: string) => void;
  onSongClick: (song: string) => void;
  onUpdatedSong: (song: Song) => void;
  tags: string[];
}

export const SongItem = ({
  song,
  isEdited,
  tags,
  onSongClick,
  onUpdatedSong,
  onRemoveSong,
}: Props) => {
  const [editedTags, setEditedTags] = useState<string[]>(song.tags);

  const onTagClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    tag: string
  ) => {
    e.stopPropagation();
    setEditedTags((prev) => {
      if (prev.includes(tag)) return prev;
      const newTags = [...prev, tag];
      onUpdatedSong({ name: song.name, tags: newTags });
      return newTags;
    });
  };

  const onDeleteTag = (tag: string) => {
    const newTags = editedTags.filter((t) => t !== tag);
    setEditedTags(newTags);
    onUpdatedSong({ name: song.name, tags: newTags });
  };

  return (
    <SongItemStyled
      isActive={!!isEdited}
      key={song.name}
      onClick={() => onSongClick(song.name)}
    >
      {song.name}
      {isEdited && (
        <div>
          <TagContainer>
            {tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                onClick={(e) => onTagClick(e, tag)}
                onDelete={() => onDeleteTag(tag)}
                deleteIcon={song.tags.includes(tag) ? <Close /> : undefined}
                color={song.tags.includes(tag) ? "primary" : "default"}
              />
            ))}
          </TagContainer>
          <Button
            onClick={() => onUpdatedSong({ name: song.name, tags: editedTags })}
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
    </SongItemStyled>
  );
};

const SongItemStyled = styled.li<{ isActive: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
  background-color: ${({ isActive }) => (isActive ? "#f9f9f9" : "white")};
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
`;
