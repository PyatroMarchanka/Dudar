import { Dialog, makeStyles } from "@material-ui/core";
import { mainColors } from "../../utils/theme";
import { RotateSpinner } from "react-spinners-kit";

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
  const classes = useStyles();
  return (
    <Dialog open={isOpen} classes={classes} disableEscapeKeyDown>
      <RotateSpinner color={mainColors.darkestRed} size={150} />
    </Dialog>
  );
};
