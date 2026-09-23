import styled from "styled-components";
import { noSongsLabel } from "../../context";
import { useSongTitle } from "../../hooks/useSongTitle";
import { useAbcSong } from "../../hooks/useAbcSong";
import { Logo } from "../global/Logo";
import { Settings } from "../Controls/Settings";
import { Header, SettingsButtons, SongTitle } from "./common";
import { MidiPlayer } from "../../utils/MidiPlayer";
import { useEffect } from "react";

interface Props {
  midiPlayer: MidiPlayer | null;
}

// Header for the ABC-notation player (/app/abc?abc=...). Unlike
// PlayPageHeader it doesn't render SongList or SongPageModal, since there is
// no catalog song to browse or share - just keeps this route light enough
// to embed in an iframe.
export const AbcPlayPageHeader = ({ midiPlayer }: Props) => {
  const songTitle = useSongTitle();
  useAbcSong();

  useEffect(() => {
    document.title = songTitle ?? noSongsLabel;
  }, [songTitle]);

  return (
    <SettingsButtons className="settingsButtons">
      <Header>
        <SongTitle>{songTitle ?? noSongsLabel}</SongTitle>
      </Header>
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
