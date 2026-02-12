import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { mainColors } from '../../utils/theme';
import { useTranslation } from 'react-i18next';

const CookieBarContainer = styled.div<{ isVisible: boolean }>`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 -4px 30px rgba(0, 0, 0, 0.1);
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  padding: 1rem;
  display: ${({ isVisible }) => (isVisible ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  gap: 1rem;
  z-index: 1000;
  transition: transform 0.3s ease-in-out;
  transform: translateY(${({ isVisible }) => (isVisible ? '0' : '100%')});

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const CookieText = styled.p`
  color: ${mainColors.darkerGray};
  font-family: Arial, Helvetica, sans-serif;
  margin: 0;
  font-size: 0.9rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const Button = styled.button<{ variant: 'accept' | 'decline' }>`
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: ${({ variant }) =>
    variant === 'accept' ? mainColors.orange : mainColors.lightGrey};
  color: ${({ variant }) =>
    variant === 'accept' ? 'white' : mainColors.darkerGray};

  &:hover {
    background-color: ${({ variant }) =>
      variant === 'accept' ? mainColors.darkOrange : mainColors.greyColor};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const CookieBar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const hasAcceptedCookies = localStorage.getItem('cookiesAccepted');
    if (!hasAcceptedCookies) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookiesAccepted', 'false');
    setIsVisible(false);
  };

  return (
    <CookieBarContainer isVisible={isVisible}>
      <CookieText>
        {t('cookieBar.message')}
      </CookieText>
      <ButtonGroup>
        <Button variant="accept" onClick={handleAccept}>
          {t('cookieBar.accept')}
        </Button>
        <Button variant="decline" onClick={handleDecline}>
          {t('cookieBar.decline')}
        </Button>
      </ButtonGroup>
    </CookieBarContainer>
  );
};
