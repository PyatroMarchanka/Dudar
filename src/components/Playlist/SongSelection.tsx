import React from "react";
import { Button } from "@material-ui/core";
import { SongSelectionContainer } from "./StyledComponents";
import { PlaylistSong } from "../../dataset/songs/interfaces";

interface SongSelectionProps {
  filteredSongs: PlaylistSong[];
  handleAddSong: (song: PlaylistSong) => void;
}

export const SongSelection: React.FC<SongSelectionProps> = ({
  filteredSongs,
  handleAddSong,
}) => {
  return (
    <SongSelectionContainer>
      {filteredSongs.map((song) => (
        <Button key={song.name} onClick={() => handleAddSong(song)}>
          {song.name}
        </Button>
      ))}
    </SongSelectionContainer>
  );
};