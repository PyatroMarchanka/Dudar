import React from "react";
import styled from "styled-components";

interface Props {
  os: string;
}

export default ({ os }: Props) => {
  return (
    <Container>
      <span>{`Unfortunately, MIDI is not supported by your browser. Please try with Android phone browser or with desktop browser`}</span>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
  font-size: 20px;
  font-family: Arial, Helvetica, sans-serif;
  text-align: center;
`;
