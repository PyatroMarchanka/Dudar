import React from "react";
import { Typography, IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { PlaylistItem, PlaylistListContainer } from "./StyledComponents";
import { IPlaylist } from "../../dataset/songs/interfaces";

interface PlaylistListProps {
  playlists: IPlaylist[];
  onPlaylistClick: (index: number) => void;
  onDeleteClick: (_id: string) => void;
}

export const PlaylistList: React.FC<PlaylistListProps> = ({
  playlists,
  onPlaylistClick,
  onDeleteClick,
}) => {
  return (
    <PlaylistListContainer>
      <Typography variant="h5">
        {playlists.length ? "All Playlists" : "No Playlists yet"}
      </Typography>
      {playlists.map((playlist, index) => (
        <PlaylistItem
          onClick={() => onPlaylistClick(index)}
          key={playlist.name}
        >
          <Typography variant="h6">{playlist.name}</Typography>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onDeleteClick(playlist._id!);
            }}
          >
            <DeleteIcon />
          </IconButton>
        </PlaylistItem>
      ))}
    </PlaylistListContainer>
  );
};
