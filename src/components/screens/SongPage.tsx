import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { store } from "../../context";
import { findSongInListById } from "../../dataset/songs/utils";
import styled, { createGlobalStyle } from "styled-components";
import { IconButton, Typography } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { getTranslationKeyByBagpipeType } from "../../interfaces/enumUtils";
import { useGoogleProfile } from "../../hooks/useGoogleProfile";
import { mainColors } from "../../utils/theme";
import { LinkTypes } from "../../dataset/songs/interfaces";
import Videocam from "@material-ui/icons/Videocam";
import Audiotrack from "@material-ui/icons/Audiotrack";
import Info from "@material-ui/icons/Info";
import { Icon } from "../global/Icon";
import { MetaTags } from "../SEO/MetaTags";
import { StructuredData } from "../SEO/StructuredData";

interface Props {
  onClose: () => void;
}

export const SongPage = ({ onClose }: Props) => {
  const { t, i18n } = useTranslation("translation");
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

  // SEO metadata
  const songTitle = activeSong?.name || 'Bagpipe Song';
  const songType = activeSong?.type ? t(`genres.${activeSong.type}`) : '';
  const bagpipes = activeSong?.bagpipesToPlay
    ?.filter((bagpipe) => (bagpipe as any) !== "gd")
    .map((bagpipe) => t(`dudas.${getTranslationKeyByBagpipeType(bagpipe)}`))
    .join(', ');
  
  const metaTitle = `${songTitle}${songType ? ` - ${songType}` : ''} | Duda Hero`;
  const metaDescription = activeSong?.about 
    ? `${activeSong.about} - Play on Duda Hero`
    : `Learn and play ${songTitle} on bagpipes with Duda Hero. ${bagpipes ? `Available for: ${bagpipes}` : ''}`;
  const metaKeywords = [
    'bagpipe song',
    songTitle,
    songType,
    ...(activeSong?.labels?.map(label => t(`tags.${label}`)) || []),
    bagpipes,
    'learn bagpipes',
    'bagpipe tutorial',
    'traditional music',
    `${songTitle} bagpipe`,
    `${songTitle} tutorial`,
    `how to play ${songTitle}`,
    `${songTitle} bagpipe tutorial`,
    `learn ${songTitle}`,
    `${songTitle} lesson`,
    'bagpipe lesson',
    'interactive bagpipe learning'
  ].filter(Boolean).join(', ');

  return (
    <>
      <MetaTags
        title={metaTitle}
        description={metaDescription}
        keywords={metaKeywords}
        language={i18n.language}
        canonicalPath={`/play/${params.id}`}
        type="music.song"
      />
      <StructuredData
        songData={{
          name: songTitle,
          genre: songType || 'Traditional',
          description: activeSong?.about,
          bagpipeTypes: activeSong?.bagpipesToPlay
            ?.filter((bagpipe) => (bagpipe as any) !== "gd")
            .map((bagpipe) => t(`dudas.${getTranslationKeyByBagpipeType(bagpipe)}`)) || [],
          timeSignature: activeSong?.timeSignature || '4/4',
          tempo: activeSong?.originalTempo,
          tags: activeSong?.labels?.map(label => t(`tags.${label}`)) || [],
          transcribedBy: activeSong?.transcribedBy,
          url: `/play/${params.id}`,
        }}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Play', url: '/play' },
          { name: songTitle, url: `/play/${params.id}` },
        ]}
      />
      <Container>
      <IconButton onClick={onClose} className="back">
        <Icon type="back" fill={"black"} />
      </IconButton>
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
          {activeSong?.bagpipesToPlay
            .filter((bagpipe) => (bagpipe as any) !== "gd")
            .map((bagpipe) => getTranslationKeyByBagpipeType(bagpipe))
            .map((bagpipe) => (
              <Typography key={bagpipe}>{t(`dudas.${bagpipe}`)}</Typography>
            ))}
        </SongProperty>
      )}
      {activeSong?.lyrycs && (
        <SongProperty>
          <Typography align="center" variant="h6">
            {t(`songInfo.lyrics`)}:
          </Typography>
          {activeSong?.lyrycs.split("\n").map((line) => (
            <Typography key={line} variant="body2">
              {line}
            </Typography>
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
        </SongProperty>
      ) : null}

      <SongProperty>
        <Typography align="center" variant="h6">
          {t(`songInfo.tags`)}:
        </Typography>
        <Typography>
          <b>{activeSong?.labels.map((tag) => t(`tags.${tag}`)).join(", ")}</b>
        </Typography>
      </SongProperty>
    </Container>
    </>
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
  .back {
    position: absolute;
    top: 20px;
    left: 20px;
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
