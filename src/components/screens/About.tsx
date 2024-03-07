import { Typography } from "@material-ui/core";
import styled from "styled-components";
import { mediaQueries } from "../../constants/style";
import { Button } from "../global/Button";
import { Logo } from "../global/Logo";
import { routes } from "../../router/routes";

export const About = () => {
  return (
    <Container>
      <LogoContainer>
      <Logo variant="big" width={100} height={50} />
      </LogoContainer>
      <ContentContainer>
        <Left>
          <Typography align="center" className="title" variant="h1">
            DudaHero: Where Tradition Meets Innovation
          </Typography>
          <Typography align="center" className="subtitle" variant="h2">
            The app to learn how to play bagpipes. No music theory is needed
            anymore.
          </Typography>
          <GetStarted>
            <a href={routes.start}>
              <Button className="getStarted" type="big">
                Get Started
              </Button>
            </a>
          </GetStarted>

          <Typography variant="body1">
            Duda Hero aims to solve the challenge of finding a bagpipe teacher,
            especially for less common types of bagpipes.
          </Typography>
          <Typography variant="body1">
            The next types of bagpipes are available to learn:
          </Typography>
          <ul>
            <li>
              <Typography>Great Highlander Bagpipe (Schotland)</Typography>
            </li>
            <li>
              <Typography>Dudelsack</Typography>
            </li>
            <li>
              <Typography>Belarusian Duda</Typography>
            </li>
          </ul>
          <Typography variant="body1">
            Now in the app you can find tutorials for at least 120 folk melodies
            from different countries, sorted by country of origin.
          </Typography>
        </Left>
        <Video
          width="240"
          height="440"
          src="https://www.youtube.com/embed/ARS6r732_pA"
        ></Video>
      </ContentContainer>
    </Container>
  );
};

const Left = styled.div`
  flex-basis: 50%;
  display: flex;
  flex-direction: column;

  .title {
    font-size: 25px;
    font-weight: bold;
    margin-bottom: 20px;
  }

  .subtitle {
    font-size: 20px;
    font-weight: bold;
  }
  .getStarted {
    margin: 30px 0;
  }

  @media (max-width: ${mediaQueries.mobile}) {
    flex-basis: 100%;
  }
`;

const ContentContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: ${mediaQueries.mobile}) {
    flex-direction: column;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Video = styled.iframe`
  flex-basis: 50%;
  width: 300px;
  height: 534px;
  border: 0;
  margin-top: 30px;

  @media (max-width: ${mediaQueries.mobile}) {
    flex-basis: unset;
  }
`;

const GetStarted = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
