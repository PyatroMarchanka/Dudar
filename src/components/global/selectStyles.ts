import { createStyles, makeStyles } from "@material-ui/core";
import { mainColors } from "../../utils/theme";

export const useSelectStyles = makeStyles(() =>
  createStyles({
    select: {
      width: "100%",
      "&:before": {
        borderColor: mainColors.darkerGray,
      },
      "&:after": {
        borderColor: mainColors.darkerGray,
      },
    },
  })
);
