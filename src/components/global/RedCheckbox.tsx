import { Checkbox, CheckboxProps, withStyles } from "@material-ui/core";
import { mainColors } from "../../utils/theme";

export const RedCheckbox = withStyles({
  root: {
    color: mainColors.lightGrey,
    "&$checked": {
      color: mainColors.red,
    },
  },
  checked: {},
})((props: CheckboxProps) => <Checkbox color="default" {...props} />);
