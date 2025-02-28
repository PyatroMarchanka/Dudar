import React from "react";
import { Button, TextField, Typography } from "@material-ui/core";

interface PlaylistFormProps {
  playlistTitle: string;
  setPlaylistTitle: (title: string) => void;
  onSave: () => void;
  onCancel: () => void;
  isEditing: boolean;
}

export const PlaylistForm: React.FC<PlaylistFormProps> = ({
  playlistTitle,
  setPlaylistTitle,
  onSave,
  onCancel,
  isEditing,
}) => {
  return (
    <>
      <TextField
        label="Playlist Title"
        value={playlistTitle}
        onChange={(e) => setPlaylistTitle(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={onSave}>
        {isEditing ? "Save" : "Create"}
      </Button>
      <Button variant="contained" color="secondary" onClick={onCancel}>
        Back
      </Button>
    </>
  );
};