import { MenuItem, Select } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import {
  SwipeableDrawer,
  IconButton,
  makeStyles,
  Theme,
} from "@material-ui/core";
import { store } from "../../../context";
import { transposeNote } from "../../../interfaces";
import { MidiPlayer } from "../../../utils/MidiPlayer";
import { ModalButton } from "../../global/ModalButton";
import { useSelectStyles } from "../../global/selectStyles";
import styled from "styled-components";
import { mainColors, theme } from "../../../utils/theme";
import { mediaQueries } from "../../../constants/style";
import { Icon } from "../../global/Icon";
import { MainSettings } from "./MainSettings";

interface Props {
  midiPlayer: MidiPlayer | null;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: mainColors.lightestGrey,
    color: "#fff",
    width: "100%",
  },
}));

export default ({ midiPlayer }: Props) => {
  const {
    state: { transpose },
    setTranspose: setTransposeCtx,
  } = useContext(store);
  const [open, setOpen] = useState(true);
  const classes = useStyles();

  const setTranspose = (num: number) => {
    setTransposeCtx(num);
    midiPlayer?.setTranspose(num);
  };

  const [value, setValue] = useState<number>(transpose);
  const options = new Array(24)
    .fill(undefined)
    .map((_, i) => ({ value: i - 12, label: i - 12 }));

  useEffect(() => {
    setTranspose(transpose);
  }, [midiPlayer]);

  return (
    <Container>
      <SwipeableDrawer
        classes={{
          paper: classes.root,
        }}
        anchor="right"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
      >
        <Content>
          <IconButton onClick={() => setOpen(false)} className="close">
            <Icon type="back" fill={theme.colors.white} className="icon" />
          </IconButton>
          <Title>Settings</Title>
          <MainSettings />
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

const Title = styled.h3`
  font-family: Arial, Helvetica, sans-serif;
  color: black;
  width: 100%;
  text-align: center;
`;

const Content = styled.div`
  @media (max-width: ${mediaQueries.mobile}) {
    width: 100%;
  }

  padding: 10px;
  width: 300px;
  z-index: 10;
  .close,
  .settings {
    position: fixed;
    left: 10px;
    z-index: 100;
  }
`;
