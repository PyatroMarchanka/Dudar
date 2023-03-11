import { createStyles, makeStyles } from "@material-ui/core";
import { mainColors } from "../../utils/theme";

export const useSelectStyles = makeStyles(() =>
  createStyles({
    select: {
      padding: "20px",
      // marginLeft: "20px",
      // marginRight: "20px",
      "&:before": {
        borderColor: mainColors.lightGrey,
      },
      "&:after": {
        borderColor: mainColors.lightGrey,
      },
    },
  })
);
