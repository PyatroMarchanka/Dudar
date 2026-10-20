import { makeStyles, SwipeableDrawer } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { SongPage } from "../screens/SongPage";
import { mainColors, theme } from "../../utils/theme";
import { Icon } from "./Icon";
import { HelpOutline } from "@material-ui/icons";
import { Row, RowTitle, settingsColors } from "../Controls/Settings/styles";

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
  const { t } = useTranslation("translation");

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
      <SongInfoRow onClick={() => setOpen(true)}>
        <Icon type="material" fill={settingsColors.accent} Icon={HelpOutline} />
        <SongInfoTitle as="span">{t("songInfo.title")}</SongInfoTitle>
      </SongInfoRow>
    </div>
  );
};

const SongInfoRow = styled(Row)`
  margin: 0 20px;
  padding: 0;
  justify-content: center;
  cursor: pointer;
`;

const SongInfoTitle = styled(RowTitle)`
  flex: 0 1 auto;
`;
