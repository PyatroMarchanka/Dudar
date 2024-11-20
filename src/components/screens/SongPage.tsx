import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { store } from "../../context";
import { findSongInListById } from "../../dataset/songs/utils";
import styled, { createGlobalStyle } from "styled-components";
import { Typography } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { getTranslationKeyByBagpipeType } from "../../interfaces/enumUtils";
import { useGoogleProfile } from "../../hooks/useGoogleProfile";
import { mainColors } from "../../utils/theme";
import { LinkTypes } from "../../dataset/songs/interfaces";
import Videocam from "@material-ui/icons/Videocam";
import Audiotrack from "@material-ui/icons/Audiotrack";
import Info from "@material-ui/icons/Info";
import { Icon } from "../global/Icon";

interface Props {}

export const SongPage = (props: Props) => {
  const { t } = useTranslation("translation");
  const params: any = useParams();

  const {
    state: { activeSong, listsByBagpipe },
    setActiveSong,
  } = useContext(store);

  useEffect(() => {
    if (!listsByBagpipe) return;
    const song = findSongInListById(params.id, listsByBagpipe);
    if (song) {
      setActiveSong(song);
    }
  }, [params.id, listsByBagpipe]);

  useGoogleProfile();

  const LinkIcon = ({ type }: { type: LinkTypes }) => {
    const IconComponent =
      type === LinkTypes.Video
        ? Videocam
        : type === LinkTypes.Audio
        ? Audiotrack
        : Info;
    return (
      <Icon
        type="material"
        fill={"black"}
        className="play-icon"
        Icon={IconComponent}
      />
    );
  };

  return (
    <Container>
      <GlobalStyle />
      <SongProperty className="title">
        <Typography align="center" variant="h6">
          {t(`songInfo.name`)} :
        </Typography>
        <Typography>
          <b>{activeSong?.name}</b>
        </Typography>
      </SongProperty>
      {activeSong?.type && (
        <SongProperty>
          <Typography align="center" variant="h6">
            {t(`songInfo.type`)}:
          </Typography>
          <Typography>
            <b>{t(`genres.${activeSong?.type}`)}</b>
          </Typography>
        </SongProperty>
      )}
      {activeSong?.about && (
        <SongProperty>
          <Typography align="center" variant="h6">
            {t(`songInfo.about`)}:
          </Typography>
          <Typography>
            <b>{activeSong?.about}</b>
          </Typography>
        </SongProperty>
      )}
      {activeSong?.bagpipesToPlay && (
        <SongProperty>
          <Typography align="center" variant="h6">
            {t(`songInfo.bagpipesToPlay`)}:
          </Typography>
          <Typography>
            {activeSong?.bagpipesToPlay
              .filter((bagpipe) => (bagpipe as any) !== "gd")
              .map((bagpipe) => getTranslationKeyByBagpipeType(bagpipe))
              .map((bagpipe) => (
                <Typography>{t(`dudas.${bagpipe}`)}</Typography>
              ))}
          </Typography>
        </SongProperty>
      )}
      {activeSong?.lyrycs && (
        <SongProperty>
          <Typography align="center" variant="h6">
            {t(`songInfo.lyrics`)}:
          </Typography>
          {activeSong?.lyrycs.split("\n").map((line) => (
            <Typography variant="body2">{line}</Typography>
          ))}
        </SongProperty>
      )}
      <SongProperty>
        <Typography align="center" variant="h6">
          {t(`songInfo.timeSignature`)}: <b>{activeSong?.timeSignature}</b>
        </Typography>
      </SongProperty>

      {activeSong?.originalTempo && (
        <SongProperty>
          <Typography align="center" variant="h6">
            {t(`songInfo.originalTempo`)}: <b>{activeSong?.originalTempo}</b>
          </Typography>
        </SongProperty>
      )}
      {activeSong?.transcribedBy && (
        <SongProperty>
          <Typography align="center" variant="h6">
            {t(`songInfo.transcribedBy`)}:
          </Typography>
          <Typography>
            <b>{activeSong?.transcribedBy}</b>
          </Typography>
        </SongProperty>
      )}

      {activeSong?.links?.length ? (
        <SongProperty>
          <Typography align="center" variant="h6">
            {t(`songInfo.links`)}:
          </Typography>
          <Typography>
            {activeSong?.links.map((link) => (
              <a
                target="_blank"
                rel="noreferrer"
                href={link.url}
                key={link.url}
                className="song-link"
              >
                <div>
                  <Typography variant="body2">
                    <b>{link.name}</b>
                  </Typography>
                  <LinkIcon type={link.type} />
                </div>
              </a>
            ))}
          </Typography>
        </SongProperty>
      ) : null}

      <SongProperty>
        <Typography align="center" variant="h6">
          {t(`songInfo.tags`)}:
        </Typography>
        <Typography>
          <b> {activeSong?.labels.map((tag) => t(`tags.${tag}`)).join(", ")}</b>
        </Typography>
      </SongProperty>
    </Container>
  );
};

const GlobalStyle = createGlobalStyle`
 .settingsButtons {
  display: none;
 }
`;

const Container = styled.div`
  display: flex;
  padding: 20px;
  align-items: center;
  flex-direction: column;
  flex-basis: 100%;

  .title {
    font-size: 1.5rem;
  }
  > div,
  a {
    margin-top: 50px;
  }
  .playLink {
    text-decoration: none;
    color: black;
    margin-top: auto;
    margin-bottom: 20px;
  }
`;

const SongProperty = styled.div`
  .song-link {
    color: black;
    text-decoration: underline;
    transition: color 0.3s ease;

    &:hover {
      color: ${mainColors.darkestRed};
    }

    div {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: ${mainColors.lightestGrey};
      }
    }
  }
`;
