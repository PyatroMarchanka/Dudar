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
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation("translation");

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

  useEffect(() => {
    player?.setMetronome(metronome);
  }, [metronome]);

  return (
    <Tempo>
      <TempoButtons>
        <IconButton className="button" onClick={() => setMetronome(!metronome)}>
          <Icon
            type={metronome ? "metr-on" : "metr-off"}
            fill={theme.colors.black}
            className="play-icon"
          />
        </IconButton>
        <IconButton
          className="button"
          onClick={() => {
            setOpen(true);
          }}
        >
          <Typography variant="h5">{tempo / 2} bpm</Typography>
        </IconButton>
      </TempoButtons>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent className={classes.container}>
          <Typography>
            {t("tempo")} {Math.floor(tempo / 2)} bpm
          </Typography>
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
        </DialogContent>
      </Dialog>
    </Tempo>
  );
};

const TempoButtons = styled.div`
  display: flex;
  align-items: center;
`;

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
