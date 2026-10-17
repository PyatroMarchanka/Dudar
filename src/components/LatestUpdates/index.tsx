import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { appUpdatesApi } from '../../api/appUpdates';
import type { AppUpdate } from '../../interfaces/appUpdate';
import { Languages } from '../../interfaces';
import { mainColors } from '../../utils/theme';

const COLLAPSED_COUNT = 4;

const LatestUpdates: React.FC = () => {
  const [updates, setUpdates] = useState<AppUpdate[]>([]);
  const [expanded, setExpanded] = useState(false);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        setUpdates(await appUpdatesApi.getLatestUpdates(20));
      } catch (error) {
        console.error('Error fetching app updates:', error);
      }
    };

    fetchUpdates();
  }, []);

  if (!updates.length) {
    return null;
  }

  const visibleUpdates = expanded ? updates : updates.slice(0, COLLAPSED_COUNT);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString(i18n.language, { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <Container>
      <Typography variant="h4" className="sectionSubtitle">
        {t('aboutPage.latestUpdates')}
      </Typography>
      <UpdatesList>
        {visibleUpdates.map((update) => {
          const translation = update.translations[i18n.language] || update.translations[Languages.English];
          if (!translation) return null;

          return (
            <UpdateItem key={update.key}>
              <UpdateDate>{formatDate(update.date)}</UpdateDate>
              <UpdateTitle>{translation.title}</UpdateTitle>
              <UpdateDescription>{translation.description}</UpdateDescription>
            </UpdateItem>
          );
        })}
      </UpdatesList>
      {updates.length > COLLAPSED_COUNT && (
        <ToggleButton type="button" onClick={() => setExpanded(!expanded)}>
          {expanded ? t('aboutPage.showFewerUpdates') : t('aboutPage.showAllUpdates')}
        </ToggleButton>
      )}
    </Container>
  );
};

export default LatestUpdates;

const Container = styled.div`
  margin-top: 40px;
  padding: 20px;
  background: #f8f8f8;
  border-radius: 10px;
`;

const UpdatesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 15px 0 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const UpdateItem = styled.li`
  padding: 0.75rem 1rem;
  background-color: white;
  border-radius: 6px;
  border-left: 4px solid ${mainColors.orange};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
`;

const UpdateDate = styled.div`
  color: ${mainColors.midGrey};
  font-size: 12px;
  font-family: 'Roboto', sans-serif;
`;

const UpdateTitle = styled.h3`
  color: ${mainColors.darkerGray};
  font-size: 16px;
  margin: 4px 0;
  font-family: 'Roboto', sans-serif;
`;

const UpdateDescription = styled.p`
  color: ${mainColors.darkerGray};
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
  font-family: 'Roboto', sans-serif;
`;

const ToggleButton = styled.button`
  margin-top: 15px;
  padding: 0;
  border: 0;
  background: none;
  color: ${mainColors.orange};
  font-size: 14px;
  font-family: 'Roboto', sans-serif;
  cursor: pointer;

  &:hover {
    color: ${mainColors.darkOrange};
  }
`;
