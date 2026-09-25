import { Typography } from '@material-ui/core';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { mediaQueries } from '../../constants/style';
import { mainColors } from '../../utils/theme';
import { brands, Brand } from '../../brand';
import { Navbar } from '../global/Navbar';
import { Contacts } from '../Contacts';
import { CookieBar } from '../CookieBar';
import { DonationButtonBig } from '../global/DonationButtonBig';
import { useGoogleProfile } from '../../hooks/useGoogleProfile';
import { Button } from '../global/Button';
import { routes } from '../../router/routes';
import { useContext } from 'react';
import { store } from '../../context';
import { useSongListShort } from '../../hooks/useSongLIst';
import { getFirstSongFromList } from '../../dataset/songs/utils';

export const FluteLanding = () => {
  const { t } = useTranslation();
  const {
    state: { activeSong, listsByBagpipe },
  } = useContext(store);

  useSongListShort();
  useGoogleProfile();

  // Unlike the bagpipe page, the saved last song isn't used: it may be a bagpipe-only tune
  const songId = activeSong?.id || (listsByBagpipe && getFirstSongFromList(listsByBagpipe).id);

  return (
    <Container>
      <Navbar />
      <HeroSection>
        <Typography align="center" className="heroTitle" variant="h1">
          {t('flutePage.heroTitle')}
        </Typography>
        <Typography align="center" className="heroSubtitle" variant="h2">
          {t('flutePage.heroSubtitle')}
        </Typography>
        <DonationButtonBig />
        {songId && (
          <GetStarted>
            <a href={`${routes.app}/${routes.play}/${songId}`}>
              <Button className="getStarted" type="big">
                {t('mainPage.getStarted')}
              </Button>
            </a>
          </GetStarted>
        )}
      </HeroSection>

      <Content>
        <Typography variant="h3" className="sectionTitle">
          {t('flutePage.sectionTitle')}
        </Typography>
        <Typography className="description">{t('flutePage.description')}</Typography>

        <Typography variant="h4" className="sectionSubtitle">
          {t('flutePage.available')}
        </Typography>
        <InstrumentsList>
          <li>
            <Typography>{t('flutePage.tinWhistle')}</Typography>
          </li>
        </InstrumentsList>

        <Typography variant="h4" className="sectionSubtitle">
          {t('flutePage.comingSoon')}
        </Typography>
        <InstrumentsList>
          <li>
            <Typography>{t('flutePage.sopilka')}</Typography>
          </li>
          <li>
            <Typography>{t('flutePage.recorder')}</Typography>
          </li>
        </InstrumentsList>

        <Typography className="description">
          {t('flutePage.bagpipesLink')}{' '}
          <a href={brands[Brand.Bagpipe].siteUrl}>{brands[Brand.Bagpipe].name}</a>
        </Typography>
      </Content>

      <Contacts />
      <CookieBar />
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

const GetStarted = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 20px;
`;

const HeroSection = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: linear-gradient(135deg, ${mainColors.darkerGray}, ${mainColors.orange});
  color: white;
  width: 100%;
  margin-bottom: 40px;

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

const Content = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto 40px;
  padding: 0 20px;

  .sectionTitle {
    font-size: 2rem;
    margin: 20px 0;
    color: ${mainColors.darkerGray};
  }

  .sectionSubtitle {
    font-size: 1.5rem;
    margin: 30px 0 15px;
    color: ${mainColors.darkerGray};
  }

  .description {
    font-size: 1.1rem;
    line-height: 1.6;
    margin: 15px 0;
  }

  a {
    color: ${mainColors.orange};
  }

  @media (max-width: ${mediaQueries.mobile}) {
    padding: 0 15px;
  }
`;

const InstrumentsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 20px 0;

  li {
    margin: 10px 0;
    padding-left: 20px;
    position: relative;

    &:before {
      content: '•';
      color: ${mainColors.orange};
      position: absolute;
      left: 0;
    }
  }
`;
