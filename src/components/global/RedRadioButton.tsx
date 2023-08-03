import { Radio, RadioProps, withStyles } from "@material-ui/core";
import { mainColors } from "../../utils/theme";

export const RedRadio = withStyles({
  root: {
    color: mainColors.lightGrey,
    "&$checked": {
      color: mainColors.red,
    },
  },
  checked: {},
})((props: RadioProps) => <Radio color="default" {...props} />);
