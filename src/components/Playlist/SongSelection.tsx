import React from "react";
import { Button } from "@material-ui/core";
import { SongSelectionContainer } from "./StyledComponents";
import { PlaylistSong } from "../../dataset/songs/interfaces";

interface SongSelectionProps {
  addedSongs: PlaylistSong[];
  filteredSongs: PlaylistSong[];
  handleAddSong: (song: PlaylistSong) => void;
}

export const SongSelection: React.FC<SongSelectionProps> = ({
  filteredSongs,
  handleAddSong,
  addedSongs,
}) => {
  const songList = filteredSongs.filter((song) => !addedSongs.includes(song));

  return (
    <SongSelectionContainer>
      {songList.map((song) => (
        <Button key={song.name} onClick={() => handleAddSong(song)}>
          {song.name}
        </Button>
      ))}
    </SongSelectionContainer>
  );
};
