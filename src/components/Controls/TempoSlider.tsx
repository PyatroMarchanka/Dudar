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
import { store } from "../../context";
import { MidiPlayer } from "../../utils/MidiPlayer";

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
    <>
      <Button size="small" variant="outlined" onClick={() => setOpen(true)}>
        Tempo
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent className={classes.container}>
          <Typography>Tempo {Math.floor(tempo / 3)} bpm</Typography>
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
    </>
  );
};
