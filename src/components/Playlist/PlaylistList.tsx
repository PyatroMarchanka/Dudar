import React from "react";
import { Typography, IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { PlaylistItem, PlaylistListContainer } from "./StyledComponents";
import { IPlaylist, PlaylistSong } from "../../dataset/songs/interfaces";
import { CopyButton } from "./CopyButton";
import styled from "styled-components";

interface PlaylistListProps {
  playlists: IPlaylist[];
  allSongs: PlaylistSong[];
  onPlaylistClick: (index: number) => void;
  onDeleteClick: (_id: string) => void;
}

export const PlaylistList: React.FC<PlaylistListProps> = ({
  playlists,
  allSongs,
  onPlaylistClick,
  onDeleteClick,
}) => {
  return (
    <PlaylistListContainer>
      <Typography variant="h5">
        {playlists.length ? "All Playlists" : "No Playlists yet"}
      </Typography>
      {playlists.map((playlist, index) => (
        <Container key={playlist._id}>
          <PlaylistItem onClick={() => onPlaylistClick(index)}>
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
          <CopyButton playlist={playlist} allSongs={allSongs} />
        </Container>
      ))}
    </PlaylistListContainer>
  );
};

const Container = styled.div`
  display: flex;
  width: 100%;
`;
