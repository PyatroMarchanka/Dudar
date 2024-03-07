import { Typography } from "@material-ui/core";
import styled from "styled-components";
import { mediaQueries } from "../../constants/style";
import { Button } from "../global/Button";
import { Logo } from "../global/Logo";
import { routes } from "../../router/routes";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { store } from "../../context";

export const About = () => {
  const { t } = useTranslation("translation");
  const {
    state: { screenSize },
  } = useContext(store);

  return (
    <Container>
      <LogoContainer>
        <Logo variant="big" width={150} height={75} />
      </LogoContainer>
      <ContentContainer>
        <Left>
          <Typography align="center" className="title" variant="h1">
            {t("mainPage.title")}
          </Typography>
          <Typography align="center" className="subtitle" variant="h2">
            {t("mainPage.subtitle")}
          </Typography>
          <GetStarted>
            <a href={routes.start}>
              <Button className="getStarted" type="big">
                {t("mainPage.getStarted")}
              </Button>
            </a>
          </GetStarted>

          <Typography variant="body1">{t("mainPage.aims")}</Typography>
          <Typography variant="body1">{t("mainPage.bagpipes")}</Typography>
          <ul>
            <li>
              <Typography>{t("mainPage.highlander")}</Typography>
            </li>
            <li>
              <Typography>{t("mainPage.dudelsack")}</Typography>
            </li>
            <li>
              <Typography>{t("mainPage.belTradDuda")}</Typography>
            </li>
          </ul>

          <Typography variant="body1">{t("mainPage.other")}</Typography>
          <Typography variant="body1">{t("mainPage.melodies")}</Typography>
        </Left>
        <Video
          width={screenSize.width - 20}
          height={screenSize.width * 1.78}
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
