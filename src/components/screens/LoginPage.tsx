import styled from "styled-components";
import { Logo } from "../global/Logo";
import { Button } from "../global/Button";
import { useHistory } from "react-router-dom";
import { routes } from "../../router/routes";
import { LoginComponent } from "../Login";
import { Typography } from "@material-ui/core";

interface Props {}

export const LoginPage = (props: Props) => {
  const history = useHistory();

  return (
    <Container>
      <Logo width={200} height={100} variant="big" />
      <Typography className="title" variant="h1">
        Log In
      </Typography>
      <div>
        <LoginComponent />
      </div>
      <div>
        <Button onClick={() => history.push(routes.app)} type="big">
          Skip
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
`;
