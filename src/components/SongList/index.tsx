import { Drawer, IconButton, makeStyles, Theme } from "@material-ui/core";
import React, { useContext, useState } from "react";
import styled from "styled-components";
import { store } from "../../context";
import { useSongList } from "../../hooks/useSongLIst";
import { MidiPlayer } from "../../utils/MidiPlayer";
import { mainColors, theme } from "../../utils/theme";
import { Icon } from "../global/Icon";
import { SongsByGenre } from "./SongsByGenre";

const useStyles = makeStyles((theme: Theme) => ({
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

export default ({ player }: Props) => {
  const { setIsPlaying, setProgress } = useContext(store);

  const onStop = () => {
    setIsPlaying(false);
    player?.stop();
    setProgress(100);
  };

  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const { songList, allLists } = useSongList();

  return (
    <Container>
      <Drawer
        classes={{
          paper: classes.root,
        }}
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
      >
        <SongsByGenre
          songsNames={songList}
          allLists={allLists}
          setOpen={setOpen}
          onStop={onStop}
        />
      </Drawer>
      <IconButton onClick={() => setOpen(true)} className="icon">
        <Icon type="hamb" fill={theme.colors.black} className="play-icon" />
      </IconButton>
    </Container>
  );
};

const Container = styled.div`
  .icon {
    transform: translate(13px, 0px);
  }
`;
