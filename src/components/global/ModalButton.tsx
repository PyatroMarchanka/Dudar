import React, { useState } from "react";
import {
  Button,
  createStyles,
  Dialog,
  DialogContent,
  makeStyles,
} from "@material-ui/core";

interface Props {
  buttonLabel: string;
  dialogContent: JSX.Element;
}

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      // width: 200,
    },
  })
);

export const ModalButton = ({ buttonLabel, dialogContent }: Props) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size="small" variant="outlined" onClick={() => setOpen(true)}>
        {buttonLabel}
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent className={classes.container}>
          {dialogContent}
        </DialogContent>
      </Dialog>
    </>
  );
};
