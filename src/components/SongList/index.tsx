import {
  SwipeableDrawer,
  IconButton,
  makeStyles,
} from "@material-ui/core";
import React, { useContext, useState } from "react";
import styled from "styled-components";
import { store } from "../../context";
import { useSongList } from "../../hooks/useSongLIst";
import { MidiPlayer } from "../../utils/MidiPlayer";
import { mainColors, theme } from "../../utils/theme";
import { Icon } from "../global/Icon";
import { SongsByGenre } from "./SongsByGenre";
import ListIcon from "@material-ui/icons/Menu";

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

type Props = {
  player: MidiPlayer | null;
};

export const SongList = ({ player }: Props) => {
  const { setIsPlaying, setProgress } = useContext(store);

  const onStop = () => {
    setIsPlaying(false);
    player?.stop();
    setProgress(100);
  };

  useSongList(onStop);

  const classes = useStyles();
  const [open, setOpen] = useState(false);

  return (
    <Container>
      <SwipeableDrawer
        classes={{
          paper: classes.root,
        }}
        anchor="left"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
      >
        <SongsByGenre setOpen={setOpen} onStop={onStop} />
      </SwipeableDrawer>
      <IconButton onClick={() => setOpen(true)} className="icon">
        <Icon
          type="material"
          Icon={ListIcon}
          fill={theme.colors.black}
          className="desktop icon-button"
        />
        <Icon
          type="material"
          Icon={ListIcon}
          fill={theme.colors.black}
          className="mobile icon-button"
        />
      </IconButton>
    </Container>
  );
};

const Container = styled.div`
  .icon {
    transform: translate(13px, 0px);
  }

  .icon-button {
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 20%;
  }

  .desktop {
    display: block;

    @media ${theme.breakpoints.belowTablet} {
      display: none;
    }
  }

  .mobile {
    display: none;
    

    @media ${theme.breakpoints.belowTablet} {
      display: block;
    }
  }
`;
