import styled from "styled-components";
import { SongList } from "../SongList";
import { IconButton } from "@material-ui/core";
import { Icon } from "../global/Icon";
import { theme } from "../../utils/theme";
import Info from "@material-ui/icons/Info";
import ChangeLogPopup from "../ChangeLogPopup";
import { noSongsLabel } from "../../context";
import { useSongTitle } from "../../hooks/useSongTitle";
import { Logo } from "../global/Logo";
import { Settings } from "../Controls/Settings";
import { Header, SettingsButtons, SongTitle } from "./common";
import { MidiPlayer } from "../../utils/MidiPlayer";
import { useLoadSong } from "../../hooks/useLoadSong";
import Modal from "../global/Modal";
import { SongPage } from "../screens/SongPage";
import { useEffect } from "react";

interface Props {
  midiPlayer: MidiPlayer | null;
}

export const PlayPageHeader = ({ midiPlayer }: Props) => {
  const songTitle = useSongTitle();
  useLoadSong();

  useEffect(() => {
    document.title = songTitle || noSongsLabel;
  }, [songTitle]);

  return (
    <SettingsButtons className="settingsButtons">
      <SongList player={midiPlayer} />
      <Header>
        <SongTitle>{songTitle || noSongsLabel}</SongTitle>
      </Header>
      <Modal
        title="Song info"
        maxWidth="md"
        triggerComponent={
          <IconButton className="button" onClick={() => {}}>
            <Icon
              type="material"
              fill={theme.colors.black}
              className="play-icon"
              Icon={Info}
            />
          </IconButton>
        }
      >
        <SongPage />
      </Modal>

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
