import React, { useState } from "react";
import { Dialog, DialogContent, IconButton, makeStyles } from "@material-ui/core";
import { Icon } from "./Icon";
import { theme } from "../../utils/theme";
import { Tuner, startTuner } from "../Tuner";

const useStyles = makeStyles(() => ({
  container: {
    padding: 0,
    "&:first-child": {
      paddingTop: 0,
    },
  },
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
      <Dialog open={open} onClose={() => setOpen(false)} PaperProps={{ style: { borderRadius: 16 } }}>
        <DialogContent classes={{ root: classes.container }}>
          <Tuner />
        </DialogContent>
      </Dialog>
    </>
  );
};
