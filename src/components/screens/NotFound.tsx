import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { NoIndex } from '../SEO/MetaTags';
import { routes } from '../../router/routes';

// Any path the app doesn't know. Without it the app showed an empty page with a
// 200 status, which Google reports as a soft 404.
export const NotFound = () => {
  const { t } = useTranslation('translation');
  return (
    <Container>
      <NoIndex />
      <h1>{t('notFound.title')}</h1>
      <p>{t('notFound.text')}</p>
      <p>
        <Link to={routes.main}>{t('notFound.home')}</Link> · <a href={routes.songs}>{t('notFound.songs')}</a>
      </p>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 0 16px;
  text-align: center;
`;
