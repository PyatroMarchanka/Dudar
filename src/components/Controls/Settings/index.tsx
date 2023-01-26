import React, { useContext, useEffect, useState } from "react";
import {
  SwipeableDrawer,
  IconButton,
  makeStyles,
  Theme,
} from "@material-ui/core";
import { store } from "../../../context";
import { MidiPlayer } from "../../../utils/MidiPlayer";
import styled from "styled-components";
import { mainColors, theme } from "../../../utils/theme";
import { Icon } from "../../global/Icon";
import { MainSettings } from "./MainSettings";

interface Props {
  midiPlayer: MidiPlayer | null;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: mainColors.lightestGrey,
    color: "#fff",
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
    [theme.breakpoints.up("md")]: {
      width: "500px",
    },
  },
}));

export default ({ midiPlayer }: Props) => {
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
              <Icon type="back" fill={theme.colors.white} className="icon" />
            </IconButton>
            <Title>Settings</Title>
          </Header>
          <MainSettings midiPlayer={midiPlayer} />
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
  color: black;
  width: 100%;
  text-align: center;
`;

const Content = styled.div`
  padding: 10px;
  z-index: 10;
  .settings {
    position: fixed;
    left: 10px;
    z-index: 100;
  }
`;
