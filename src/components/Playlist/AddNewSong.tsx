import { Button, Chip, TextField } from "@material-ui/core";
import React, { useState } from "react";
import styled from "styled-components";
import { Close } from "@material-ui/icons";
import { theme } from "../../utils/theme";
import { PlaylistSong } from "../../dataset/songs/interfaces";

interface Props {
  tags: string[];
  handleAddSong: (song: PlaylistSong) => void;
}

export const AddNewSong = ({ tags, handleAddSong }: Props) => {
  const [newSong, setNewSong] = useState<PlaylistSong>({ name: "", tags: [] });
  return (
    <InputContainer>
      <TextField
        label="New Song"
        value={newSong.name}
        onChange={(e) => setNewSong({ ...newSong, name: e.target.value })}
        variant="outlined"
      />
      <Tags>
        {tags.map((tag) => (
          <Chip
            key={tag}
            label={tag}
            onClick={(e) => {
              e.stopPropagation();
              if (!newSong.tags.includes(tag)) {
                setNewSong({ ...newSong, tags: [...newSong.tags, tag] });
              }
            }}
            onDelete={
              newSong.tags.includes(tag)
                ? () =>
                    setNewSong({
                      ...newSong,
                      tags: newSong.tags.filter((t: string) => t !== tag),
                    })
                : undefined
            }
            deleteIcon={newSong.tags.includes(tag) ? <Close /> : undefined}
            color={newSong.tags.includes(tag) ? "primary" : "default"}
          />
        ))}
      </Tags>

      <Button
        onClick={() => handleAddSong(newSong)}
        variant="contained"
        color="primary"
      >
        Add Song
      </Button>
    </InputContainer>
  );
};

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 20px;
`;

const Tags = styled.div`
  margin: 0 10px;

  @media ${theme.breakpoints.belowTablet} {
    margin: 10px 0;
  }
`;
