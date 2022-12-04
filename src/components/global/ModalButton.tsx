import React, { useState } from "react";
import {
  Button,
  createStyles,
  Dialog,
  DialogContent,
  IconButton,
  makeStyles,
} from "@material-ui/core";
import { Icon } from "./Icon";
import { theme } from "../../utils/theme";

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
      <IconButton onClick={() => setOpen(true)} className="icon">
        <Icon type="settings" fill={theme.colors.black} className="play-icon" />
      </IconButton>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent className={classes.container}>
          {dialogContent}
        </DialogContent>
      </Dialog>
    </>
  );
};
