import React, { useContext, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { store } from "../../context";
import { findSongInListById } from "../../dataset/songs/utils";
import { routes } from "../../router/routes";
import styled from "styled-components";

interface Props {}

export const SongPage = (props: Props) => {
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
      Song : {activeSong?.name}
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
