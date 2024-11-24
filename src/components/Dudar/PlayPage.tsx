import styled from "styled-components";
import { SongList } from "../SongList";
import { IconButton, makeStyles, SwipeableDrawer } from "@material-ui/core";
import { Icon } from "../global/Icon";
import { mainColors, theme } from "../../utils/theme";
import HelpOutline from "@material-ui/icons/HelpOutline";
import { Close } from "@material-ui/icons";
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
import { useTranslation } from "react-i18next";
import { SongPageModal } from "../global/SongPageModal";

interface Props {
  midiPlayer: MidiPlayer | null;
}

const useStyles = makeStyles(() => ({
  container: {
    width: 200,
    display: "flex",
    justifyContent: "center",
  },
  content: {
    width: 300,
    display: "flex",
    margin: 0,
    justifyContent: "flex-start",
  },
  list: {
    width: 250,
  },
  root: {
    backgroundColor: mainColors.darkestRed,
    color: "#fff",
  },
}));

export const PlayPageHeader = ({ midiPlayer }: Props) => {
  const songTitle = useSongTitle();
  useLoadSong();
  const { t } = useTranslation("translation");
  const classes = useStyles();

  useEffect(() => {
    document.title = songTitle || noSongsLabel;
  }, [songTitle]);

  return (
    <SettingsButtons className="settingsButtons">
      <SongList player={midiPlayer} />
      <Header>
        <SongTitle>{songTitle || noSongsLabel}</SongTitle>
      </Header>
      {/* <Modal
        fullScreen={true}
        title={t("songInfo.title")}
        maxWidth="xl"
        triggerComponent={
          <IconButton className="button" onClick={() => {}}>
            <Icon
              type="material"
              fill={theme.colors.black}
              className="play-icon"
              Icon={HelpOutline}
            />
          </IconButton>
        }
      >
        <IconButton onClick={}>
          <Icon
            type="material"
            fill={theme.colors.black}
            className="play-icon"
            Icon={Close}
          />
        </IconButton>
        <SongPage />
      </Modal> */}
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
