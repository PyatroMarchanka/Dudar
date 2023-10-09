import { Dialog, makeStyles } from "@material-ui/core";
import { mainColors } from "../../utils/theme";
import { RotateSpinner } from "react-spinners-kit";
import { useEffect, useState } from "react";

interface Props {
  isOpen: boolean;
}

const useStyles = makeStyles(() => ({
  paper: {
    backgroundColor: "unset",
    boxShadow: "unset",
  },
}));

export const BackdropSpinner = ({ isOpen }: Props) => {
  const [open, setOpen] = useState(isOpen);

  const classes = useStyles();

  useEffect(() => {
    if (isOpen) {
      setOpen(true);
    } else {
      setTimeout(() => {
        setOpen(false);
      }, 500);
    }
  }, [isOpen]);

  return (
    <Dialog open={open} classes={classes} disableEscapeKeyDown>
      <RotateSpinner color={mainColors.darkestRed} size={150} />
    </Dialog>
  );
};
