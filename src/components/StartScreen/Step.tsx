import { Typography } from "@material-ui/core";
import React from "react";
import styled from "styled-components";

interface Props {
  title: string;
  children: JSX.Element;
}

export const Step = ({ title, children }: Props) => {
  return (
    <Container>
      <Typography variant="h4" align="center">
        {title}
      </Typography>
      {children}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
