import React from "react";
import { Header, SettingsButtons, SongTitle } from "./common";
import { MidiPlayer } from "../../utils/MidiPlayer";
import { SongList } from "../SongList";
import { useSongTitle } from "../../hooks/useSongTitle";
import { noSongsLabel } from "../../context";

interface Props {
  midiPlayer: MidiPlayer | null;
}

export const InfoPageHeader = ({midiPlayer}: Props) => {
  const songTitle = useSongTitle();

  return (
    <SettingsButtons>
      <SongList player={midiPlayer} />
      <Header>
        <SongTitle>{songTitle || noSongsLabel}</SongTitle>
      </Header>
    </SettingsButtons>
  );
};
