import React, { useContext, useEffect, useState } from "react";
import { SwipeableDrawer, IconButton, makeStyles, Theme } from "@material-ui/core";
import { store } from "../../../context";
import { MidiPlayer } from "../../../utils/MidiPlayer";
import styled from "styled-components";
import { mainColors, theme } from "../../../utils/theme";
import { Icon } from "../../global/Icon";
import { MainSettings } from "./MainSettings";
import { settingsColors } from "./styles";
import { useTranslation } from "react-i18next";

interface Props {
  midiPlayer?: MidiPlayer | null;
  showSongInfo?: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: mainColors.lightestGrey,
    color: "#fff",
    width: "100%",
    maxWidth: "100vw",
    overflowX: "hidden",
    [theme.breakpoints.up("sm")]: {
      width: "440px",
    },
  },
}));

export const Settings = ({ midiPlayer, showSongInfo = true }: Props) => {
  const { t } = useTranslation("translation");

  const {
    state: { transpose, isPlaying },
  } = useContext(store);

  const [open, setOpen] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    midiPlayer?.setTranspose(transpose, isPlaying);
  }, [midiPlayer, transpose]);

  return (
    <Container>
      <SwipeableDrawer
        classes={{
          paper: classes.root,
        }}
        className=""
        anchor="right"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
      >
        <Content>
          <Header>
            <IconButton onClick={() => setOpen(false)} className="close">
              <Icon type="back" fill={settingsColors.ink} className="icon" />
            </IconButton>
            <Title>{t("settings")}</Title>
          </Header>
          <MainSettings midiPlayer={midiPlayer} showSongInfo={showSongInfo} />
        </Content>
      </SwipeableDrawer>
      <IconButton onClick={() => setOpen(true)} className="settings">
        <Icon type="settings" fill={theme.colors.black} className="icon" />
      </IconButton>
    </Container>
  );
};

const Container = styled.div`
  .icon {
    transform: translate(13px, 0px);
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  .close {
    position: absolute;
  }
`;

const Title = styled.h3`
  font-family: Arial, Helvetica, sans-serif;
  color: ${settingsColors.ink};
  width: 100%;
  text-align: center;
`;

const Content = styled.div`
  padding: 10px 0;
  z-index: 10;
`;
