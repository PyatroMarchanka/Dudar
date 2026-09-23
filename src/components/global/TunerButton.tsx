import React, { useState } from "react";
import { Dialog, DialogContent, IconButton, makeStyles } from "@material-ui/core";
import { Icon } from "./Icon";
import { theme } from "../../utils/theme";
import { Tuner, startTuner } from "../Tuner";

const useStyles = makeStyles(() => ({
  container: {},
}));

export const TunerButton = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleClick = async () => {
    try {
      await startTuner();
      setOpen(true);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <IconButton onClick={handleClick} className="icon">
        <Icon type="tuning-fork" fill={theme.colors.black} />
      </IconButton>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent className={classes.container}>
          <Tuner />
        </DialogContent>
      </Dialog>
    </>
  );
};
