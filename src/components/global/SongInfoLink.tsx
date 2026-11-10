import React, { useContext } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useRouteMatch } from "react-router-dom";
import { HelpOutline } from "@material-ui/icons";
import { store } from "../../context";
import { routes } from "../../router/routes";
import { songPagePath } from "../SEO/SongSeo";
import { Icon } from "./Icon";
import { Row, RowTitle, settingsColors } from "../Controls/Settings/styles";

// "Song info" in the settings: opens the song's own page (/songs/<id>, rendered
// by functions/songs), which has a link back to the player.
export const SongInfoLink = () => {
  const { t } = useTranslation("translation");
  const isCatalogSong = useRouteMatch(`${routes.app}/${routes.play}/:id`);
  const {
    state: { activeSong },
  } = useContext(store);

  if (!isCatalogSong || !activeSong?.id) return null;

  return (
    // A full page load: /songs is served by the server, not by the app
    <SongInfoRow as="a" href={songPagePath(activeSong.id)}>
      <Icon type="material" fill={settingsColors.accent} Icon={HelpOutline} />
      <SongInfoTitle as="span">{t("songInfo.title")}</SongInfoTitle>
    </SongInfoRow>
  );
};

const SongInfoRow = styled(Row)`
  margin: 0 20px;
  padding: 0;
  justify-content: center;
  cursor: pointer;
  text-decoration: none;
`;

const SongInfoTitle = styled(RowTitle)`
  flex: 0 1 auto;
`;
