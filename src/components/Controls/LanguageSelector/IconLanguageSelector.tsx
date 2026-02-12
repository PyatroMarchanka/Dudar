import { Typography } from '@material-ui/core';
import { Icon } from '../../global/Icon';
import { ModalButton } from '../../global/ModalButton';
import LanguageSelector from '.';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import LanguageIcon from '@material-ui/icons/Language';

export const IconLanguageSelector = () => {
  const { t } = useTranslation();
  return (
    <ModalButton
      icon={<Icon type="material" fill={'black'} Icon={LanguageIcon} />}
      dialogContent={
        <div>
          <ModalTitle>
            <Typography>{t('languages.lang')}</Typography>
          </ModalTitle>
          <LanguageSelector />
        </div>
      }
    />
  );
};

const ModalTitle = styled.div`
  display: flex;
  justify-content: center;
  padding: 1rem;
`;
