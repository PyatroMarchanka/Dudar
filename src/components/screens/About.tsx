import { Typography } from "@material-ui/core";
import styled from "styled-components";
import { mediaQueries } from "../../constants/style";
import { Button } from "../global/Button";
import { Logo } from "../global/Logo";
import { routes } from "../../router/routes";
import { useContext } from "react";
import { store } from "../../context";
import { Contacts } from "../Contacts";
import { DonationButtonBig } from "../global/DonationButtonBig";
import { useSongListShort } from "../../hooks/useSongLIst";
import { getFirstSongFromList } from "../../dataset/songs/utils";
import { useGoogleProfile } from "../../hooks/useGoogleProfile";
import { mainColors } from "../../utils/theme";
import { Navbar } from "../global/Navbar";
import { useBlogPosts } from "../../hooks/useBlogPosts";
import { useTranslation } from "react-i18next";

export const About = () => {
  const {
    state: { screenSize, activeSong, listsByBagpipe, userLastSongUrl },
  } = useContext(store);
  useSongListShort();
  const songId =
    userLastSongUrl ||
    activeSong?.id ||
    (listsByBagpipe && getFirstSongFromList(listsByBagpipe).id);

  const { i18n } = useTranslation("translation");

  useGoogleProfile();

  const { posts, loading, error } = useBlogPosts(i18n.language);

  const { t } = useTranslation();

  return (
    <Container>
      <Navbar />
      <HeroSection>
        <LogoContainer>
          <Logo white variant="big" width={250} height={175} />
        </LogoContainer>
        <Typography align="center" className="heroTitle" variant="h1">
          {t('aboutPage.heroTitle')}
        </Typography>
        <Typography align="center" className="heroSubtitle" variant="h2">
          {t('aboutPage.heroSubtitle')}
        </Typography>
        <DonationButtonBig />
        <GetStarted>
          <a href={`${routes.app}/${routes.play}/${songId}`}>
            <Button className="getStarted" type="big">
              {t('mainPage.getStarted')}
            </Button>
          </a>
        </GetStarted>
      </HeroSection>

      <ContentContainer>
        <Left>
          <Typography variant="h3" className="sectionTitle">
            {t('aboutPage.sectionTitle')}
          </Typography>

          <Typography variant="h4" className="melodiesCount">
            {t('aboutPage.melodiesCount', { count: 200 })}
          </Typography>

          <Typography variant="h4" className="sectionSubtitle">
            {t('aboutPage.availableBagpipes')}
          </Typography>
          <BagpipesList>
            <li>
              <Typography>{t('aboutPage.belTradDuda')}</Typography>
            </li>
            <li>
              <Typography>{t('aboutPage.highlander')}</Typography>
            </li>
            <li>
              <Typography>{t('aboutPage.dudelsack')}</Typography>
            </li>
          </BagpipesList>

          <Typography variant="body1" className="description">
            {t('aboutPage.moreComing')}
          </Typography>

          <Typography variant="body1" className="description">
            {t('aboutPage.discoverMelodies', { count: 200 })}
          </Typography>

          <BlogSection>
            <Typography variant="h4" className="sectionSubtitle">
              {t('aboutPage.latestFromBlog')}
            </Typography>
            <BlogLinks>
              {posts.map((post) => (
                <a key={post.id} href={`${routes.blog}/${post.slug}`}>
                  <Typography>{post.title}</Typography>
                </a>
              ))}
            </BlogLinks>
          </BlogSection>
        </Left>
      </ContentContainer>

      <VideoSection>
        <Video
          width={screenSize.width - 20}
          height={screenSize.width * 1.78}
          src="https://www.youtube.com/embed/wid676otpw4"
        />
      </VideoSection>

      <Contacts />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding-top: 60px;
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Video = styled.iframe`
  border: 0;
  margin-top: 30px;
`;

const GetStarted = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 20px;
`;

const HeroSection = styled.div`
  text-align: center;
  padding: 40px 20px;
  background: url("/images/background.jpg") no-repeat center center;
  background-size: cover;
  color: white;
  width: 100%;
  margin-bottom: 40px;
  position: relative;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1;
  }

  > * {
    position: relative;
    z-index: 2;
  }

  .heroTitle {
    font-size: 2.5rem;
    margin: 20px 0;
    font-weight: 800;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }

  .heroSubtitle {
    font-size: 1.5rem;
    margin-bottom: 30px;
    font-weight: 400;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  }
`;

const BlogSection = styled.div`
  margin-top: 40px;
  padding: 20px;
  background: #f8f8f8;
  border-radius: 10px;
`;

const BlogLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 15px;

  a {
    color: ${mainColors.orange};
    text-decoration: none;
    transition: color 0.3s;

    &:hover {
      color: ${mainColors.darkOrange};
    }
  }
`;

const BagpipesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 20px 0;

  li {
    margin: 10px 0;
    padding-left: 20px;
    position: relative;

    &:before {
      content: "•";
      color: ${mainColors.orange};
      position: absolute;
      left: 0;
    }
  }
`;

const VideoSection = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 40px 0;
`;

const Left = styled.div`
  flex-basis: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;

  .sectionTitle {
    font-size: 2rem;
    margin: 40px 0 20px;
    color: ${mainColors.orange};
  }

  .sectionSubtitle {
    font-size: 1.5rem;
    margin: 30px 0 15px;
    color: ${mainColors.orange};
  }

  .description {
    font-size: 1.1rem;
    line-height: 1.6;
    margin: 15px 0;
  }

  .melodiesCount {
    font-size: 1.8rem;
    color: ${mainColors.orange};
    margin: 20px 0;
  }

  .playlistsButton {
    margin: 30px 0;
  }

  @media (max-width: ${mediaQueries.mobile}) {
    padding: 0 15px;
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
