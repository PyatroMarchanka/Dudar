import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

export const NoSong: React.FC = () => {
  const { t } = useTranslation("translation");

  return (
    <Container>
      <h1>{t("noSong.title")}</h1>
      <Message>{t("noSong.text")}</Message>
      <Message>{t("noSong.tryChange")}</Message>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  background-color: #f8f9fa;
  color: #343a40;
`;

const Message = styled.p`
  font-size: 1.2rem;
  margin: 1rem 0;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  margin: 0.5rem;
  font-size: 1rem;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;
