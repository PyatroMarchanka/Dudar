import React, { useContext, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { store } from "../../context";
import { findSongInListById } from "../../dataset/songs/utils";
import { routes } from "../../router/routes";
import styled from "styled-components";
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
      <Typography variant="h1">Song : {activeSong?.name}</Typography>
      <SongProperty>Time signature: {activeSong?.timeSignature}</SongProperty>
      <SongProperty>
        Tags: {activeSong?.labels.map((tag) => t(`tags.${tag}`))}
      </SongProperty>
      {activeSong?.originalTempo && (
        <SongProperty>Original tempo: {activeSong?.originalTempo}</SongProperty>
      )}
      {activeSong?.midiBy && (
        <SongProperty>Transcribed by: {activeSong?.midiBy}</SongProperty>
      )}
      <Link to={`${routes.app}/${routes.play}/${params.id}`}>Play</Link>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
  flex-basis: 100%;
  height: 100vh;

  > div,
  a {
    margin-top: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const SongProperty = styled.div`
  display: flex;
  justify-content: center;
`;
