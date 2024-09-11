import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { store } from "../../context";
import { findSongInListById } from "../../dataset/songs/utils";
import styled, { createGlobalStyle } from "styled-components";
import { Typography } from "@material-ui/core";
import { useTranslation } from "react-i18next";

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

  return (
    <Container>
      <GlobalStyle />
      <Typography className="title" variant="h1">
        <Typography>
          {t(`songInfo.name`)} : <b>{activeSong?.name}</b>
        </Typography>
      </Typography>
      <SongProperty>
        <Typography>
          {t(`songInfo.timeSignature`)}: <b>{activeSong?.timeSignature}</b>
        </Typography>
      </SongProperty>
      <SongProperty>
        <Typography>
          {t(`songInfo.tags`)}:
          <b> {activeSong?.labels.map((tag) => t(`tags.${tag}`))}</b>
        </Typography>
      </SongProperty>
      {activeSong?.originalTempo && (
        <SongProperty>
          <Typography>
            {" "}
            {t(`songInfo.originalTempo`)}: <b>{activeSong?.originalTempo}</b>
          </Typography>
        </SongProperty>
      )}
      {activeSong?.midiBy && (
        <SongProperty>
          <Typography>
            {t(`songInfo.transcribedBy`)}: <b>{activeSong?.midiBy}</b>
          </Typography>
        </SongProperty>
      )}
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
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .playLink {
    text-decoration: none;
    color: black;
    margin-top: auto;
    margin-bottom: 20px;
  }
`;

const SongProperty = styled.div`
  display: flex;
  justify-content: center;
`;
