import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { ReviewStatus } from '../../api/melodies';

const colors: Record<ReviewStatus, { background: string; color: string }> = {
  draft: { background: '#eeeeee', color: '#616161' },
  pending: { background: '#fff3e0', color: '#e65100' },
  approved: { background: '#e8f5e9', color: '#2e7d32' },
  rejected: { background: '#ffebee', color: '#c62828' },
};

// Where a melody is in the admin review
export const ReviewBadge = ({ status }: { status: ReviewStatus }) => {
  const { t } = useTranslation('translation');
  return <Badge $status={status}>{t(`review.status.${status}`)}</Badge>;
};

const Badge = styled.span<{ $status: ReviewStatus }>`
  display: inline-block;
  font-family: 'Roboto', sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
  padding: 4px 8px;
  border-radius: 10px;
  white-space: nowrap;
  background: ${({ $status }) => colors[$status].background};
  color: ${({ $status }) => colors[$status].color};
`;
