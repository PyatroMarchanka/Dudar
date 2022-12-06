import {
  Button,
  createStyles,
  Dialog,
  DialogContent,
  IconButton,
  makeStyles,
  Slider,
  Typography,
} from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { store } from "../../context";
import { MidiPlayer } from "../../utils/MidiPlayer";
import { theme } from "../../utils/theme";
import { Icon } from "../global/Icon";

interface Props {
  player: MidiPlayer | null;
}

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      width: 200,
    },
  })
);

export const TempoSlider = ({ player }: Props) => {
  const {
    state: { tempo, metronome },
    setTempo,
    setMetronome,
  } = useContext(store);

  const classes = useStyles();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    player?.checkTempo(tempo);
  }, [player]);

  return (
    <Tempo>
      {/* <Button size="small" variant="outlined" onClick={() => setOpen(true)}>
        Tempo
      </Button> */}
      <IconButton
        onClick={() => {
          console.log("onClick");
          setOpen(true);
        }}
        className="button"
      >
        <Icon type="metr_on" fill={theme.colors.black} className="play-icon" />
        <span>{tempo / 2} bpm</span>
      </IconButton>
      {/* <Tempo onClick={() => setOpen(true)}>
        <Icon type="metr_off" fill={theme.colors.black} className="play-icon" />
        <h3>{tempo / 2} BPM</h3>
      </Tempo> */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent className={classes.container}>
          <Typography>Tempo {Math.floor(tempo / 2)} bpm</Typography>
          <Slider
            className="volume-slider"
            onChange={(e, value) => {
              setTempo(value as number);
              player?.checkTempo(value as number);
            }}
            value={tempo}
            defaultValue={tempo}
            aria-labelledby="discrete-slider"
            step={2}
            min={60}
            max={360}
          />
          <Button
            size="small"
            variant={metronome ? "contained" : "outlined"}
            onClick={() => setMetronome(!metronome)}
          >
            Metronome
          </Button>
        </DialogContent>
      </Dialog>
    </Tempo>
  );
};

const Tempo = styled.div`
  display: flex;
  align-items: center;

  button > span {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 24px;
    font-weight: 500;
    color: black;
  }
`;
