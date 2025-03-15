import styled from "styled-components";
import { SongList } from "../SongList";
import ChangeLogPopup from "../ChangeLogPopup";
import { noSongsLabel, store } from "../../context";
import { useSongTitle } from "../../hooks/useSongTitle";
import { Logo } from "../global/Logo";
import { Settings } from "../Controls/Settings";
import { Header, SettingsButtons, SongTitle } from "./common";
import { MidiPlayer } from "../../utils/MidiPlayer";
import { useLoadSong } from "../../hooks/useLoadSong";
import { useEffect } from "react";
import { SongPageModal } from "../global/SongPageModal";

interface Props {
  midiPlayer: MidiPlayer | null;
}

export const PlayPageHeader = ({ midiPlayer }: Props) => {
  const songTitle = useSongTitle();
  useLoadSong();

  useEffect(() => {
    document.title = songTitle ?? noSongsLabel;
  }, [songTitle]);

  return (
    <SettingsButtons className="settingsButtons">
      <SongList player={midiPlayer} />
      <Header>
        <SongTitle>{songTitle ?? noSongsLabel}</SongTitle>
      </Header>
      <SongPageModal />
      <ChangeLogPopup />
      <LogoContainer>
        <Logo variant="small" width={26} height={40} />
      </LogoContainer>
      <Settings midiPlayer={midiPlayer} />
    </SettingsButtons>
  );
};

const LogoContainer = styled.div`
  margin-left: 10px;
`;
