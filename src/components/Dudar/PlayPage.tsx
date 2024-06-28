import React from "react";
import {
  useHistory,
  useParams,
} from "react-router-dom";
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
import { routes } from "../../router/routes";

interface Props {
  midiPlayer: MidiPlayer | null;
}

export const PlayPageHeader = ({ midiPlayer }: Props) => {
  const history = useHistory();
  const params: any = useParams();
  const songTitle = useSongTitle();
  useLoadSong();

  return (
    <SettingsButtons>
      <SongList player={midiPlayer} />
      <Header>
        <SongTitle>{songTitle || noSongsLabel}</SongTitle>
      </Header>
      <IconButton
        className="button"
        onClick={() => {
          console.log("params", params);

          const songId = params.id;
          history.push(`${routes.app}/${routes.info}/${songId}`);
        }}
      >
        <Icon
          type="material"
          fill={theme.colors.black}
          className="play-icon"
          Icon={Info}
        />
      </IconButton>
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
