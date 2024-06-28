import styled from "styled-components";
import { Logo } from "../global/Logo";
import { Button } from "../global/Button";
import { useHistory } from "react-router-dom";
import { routes } from "../../router/routes";
import { LoginComponent } from "../Login";
import { Typography } from "@material-ui/core";
import { useContext } from "react";
import { store } from "../../context";
import { useSongListShort } from "../../hooks/useSongLIst";
import { getFirstSongFromList } from "../../dataset/songs/utils";

interface Props {}

export const LoginPage = (props: Props) => {
  const history = useHistory();
  const {
    state: { activeSong, listsByBagpipe },
  } = useContext(store);

  useSongListShort();

  const songId = activeSong
    ? activeSong.id
    : getFirstSongFromList(listsByBagpipe || {})?.id;

  return (
    <Container>
      <Logo width={200} height={100} variant="big" />
      <Typography className="title" variant="h1">
        Log In
      </Typography>
      <div>
        <LoginComponent />
      </div>
      <div className="buttons">
        <Button
          onClick={() => history.push(`${routes.app}/${routes.play}/${songId}`)}
          type="big"
        >
          Skip
        </Button>
        <Button onClick={() => history.push(routes.main)} type="big">
          Main page
        </Button>
      </div>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  flex-basis: 100%;
  height: 100vh;

  > div,
  a,
  h1 {
    margin-top: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .title {
    font-size: 3rem;
  }

  .buttons {
    > * {
      margin-left: 5px;
    }
  }
`;
