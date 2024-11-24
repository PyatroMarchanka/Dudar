import { IconButton, makeStyles, SwipeableDrawer } from "@material-ui/core";
import React from "react";
import { SongPage } from "../screens/SongPage";
import { mainColors, theme } from "../../utils/theme";
import { Icon } from "./Icon";
import { HelpOutline } from "@material-ui/icons";

interface Props {}

const useStyles = makeStyles(() => ({
  container: {
    width: 200,
    display: "flex",
    justifyContent: "center",
  },
  content: {
    width: 300,
    display: "flex",
    margin: 0,
    justifyContent: "flex-start",
  },
  list: {
    width: 250,
  },
  root: {
    backgroundColor: mainColors.lightestGrey,
    color: theme.colors.black,
  },
}));

export const SongPageModal = (props: Props) => {
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();
  return (
    <div>
      <SwipeableDrawer
        classes={{
          paper: classes.root,
        }}
        anchor="left"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
      >
        <SongPage onClose={() => setOpen(false)} />
      </SwipeableDrawer>
      <IconButton onClick={() => setOpen(true)} className="icon">
        <Icon type="material" fill={theme.colors.black} Icon={HelpOutline} />
      </IconButton>
    </div>
  );
};
