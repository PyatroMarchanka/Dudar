import {
  Button,
  createStyles,
  Dialog,
  DialogContent,
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
    state: { tempo },
    setTempo,
  } = useContext(store);

  const classes = useStyles();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    player?.setTempo(tempo);
  }, [player]);

  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Tempo
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent className={classes.container}>
          <Typography>Tempo {Math.floor(tempo / 3)} bpm</Typography>
          <Slider
            className="volume-slider"
            onChange={(e, value) => {
              setTempo(value as number);
              player?.setTempo(value as number);
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
    </>
  );
};
