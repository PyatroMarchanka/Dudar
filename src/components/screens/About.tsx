import { Typography } from "@material-ui/core";
import styled from "styled-components";
import { mediaQueries } from "../../constants/style";
import { Button } from "../global/Button";
import { Logo } from "../global/Logo";
import { routes } from "../../router/routes";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { store } from "../../context";
import { Contacts } from "../Contacts";
import { DonationButtonBig } from "../global/DonationButtonBig";
import { useSongListShort } from "../../hooks/useSongLIst";
import { useHistory } from "react-router-dom";
import { getFirstSongFromList } from "../../dataset/songs/utils";
import { useGoogleProfile } from "../../hooks/useGoogleProfile";
import { mainColors } from "../../utils/theme";
import { Navbar } from "../global/Navbar";

export const About = () => {
  const { t } = useTranslation("translation");
  const {
    state: {
      screenSize,
      activeSong,
      listsByBagpipe,
      userLastSongUrl,
    },
  } = useContext(store);
  const history = useHistory();
  useSongListShort();
  const songId =
    userLastSongUrl ||
    activeSong?.id ||
    (listsByBagpipe && getFirstSongFromList(listsByBagpipe).id);

  useGoogleProfile();

  return (
    <Container>
      <Navbar />
      <HeroSection>
        <LogoContainer>
          <Logo variant="big" width={150} height={75} />
        </LogoContainer>
        <Typography align="center" className="heroTitle" variant="h1">
          Where Tradition Meets Innovation
        </Typography>
        <Typography align="center" className="heroSubtitle" variant="h2">
          The app to learn how to play bagpipes. No music theory is needed anymore.
        </Typography>
        <DonationButtonBig />
        <GetStarted>
          <a href={`${routes.app}/${routes.play}/${songId}`}>
            <Button className="getStarted" type="big">
              Get Started
            </Button>
          </a>
        </GetStarted>
      </HeroSection>

      <ContentContainer>
        <Left>
          <Typography variant="h3" className="sectionTitle">
            Your Bagpipe Learning Journey Starts Here
          </Typography>
          
          <Typography variant="h4" className="melodiesCount">
            {`${196} melodies and counting!`}
          </Typography>
          
          <Typography variant="body1" className="description">
            Duda Hero revolutionizes bagpipe learning by making it accessible to everyone. 
            No more searching for specialized teachers - we bring the expertise to you!
          </Typography>

          <Typography variant="h4" className="sectionSubtitle">
            Available Bagpipes to Master:
          </Typography>
          <BagpipesList>
            <li>
              <Typography>Belarusian Traditional Duda</Typography>
            </li>
            <li>
              <Typography>Great Highlander Bagpipe (Scotland)</Typography>
            </li>
            <li>
              <Typography>Dudelsack</Typography>
            </li>
          </BagpipesList>

          <Typography variant="body1" className="description">
            More bagpipe types coming soon! We're constantly expanding our collection.
          </Typography>

          <Typography variant="body1" className="description">
            Discover over 120 folk melodies from around the world, carefully curated and organized by their cultural origins.
          </Typography>

          <Row>
            <a href={routes.playlists}>
              <Button className="playlistsButton" type="primary">
                Playlists Editor
              </Button>
            </a>
          </Row>

          <BlogSection>
            <Typography variant="h4" className="sectionSubtitle">
              Latest from Our Blog:
            </Typography>
            <BlogLinks>
              <a href="/blog/bagpipe-basics">
                <Typography>Getting Started with Bagpipes: A Beginner's Guide</Typography>
              </a>
              <a href="/blog/folk-melodies">
                <Typography>Exploring the World of Folk Melodies</Typography>
              </a>
              <a href="/blog/practice-tips">
                <Typography>5 Essential Practice Tips for Bagpipe Players</Typography>
              </a>
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
  background: url('/images/background.jpg') no-repeat center center;
  background-size: cover;
  color: white;
  width: 100%;
  margin-bottom: 40px;
  position: relative;

  &:before {
    content: '';
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

const UserImage = styled.img`
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid ${mainColors.orange};
  width: 30px;
  height: 30px;
  &:hover {
    cursor: pointer;
    border: 2px solid ${mainColors.darkOrange};
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
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
    color: ${mainColors.darkOrange};
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