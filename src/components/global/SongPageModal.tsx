import { makeStyles, SwipeableDrawer } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
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
      <Row onClick={() => setOpen(true)}>
        <Icon type="material" fill={mainColors.darkerGray} Icon={HelpOutline} />
        <Title>{t("songInfo.title")}</Title>
      </Row>
    </div>
  );
};

const Row = styled.div`
  display: flex;
  align-items: center;
  padding-left: 20px;
  padding-right: 20px;
  flex-wrap: nowrap;
  cursor: pointer;
`;

const Title = styled.h3`
  color: ${mainColors.midGrey};
  font-weight: 600;
  font-size: 20px;
  font-family: Arial, Helvetica, sans-serif;
  margin-left: 20px;
`;
