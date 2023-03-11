import React, { useContext } from "react";
import styled from "styled-components";
import { mediaQueries } from "../../constants/style";
import { store } from "../../context";

const maxCavasWidth = 800;

type Props = {
  canvasRef: React.MutableRefObject<null>;
};

export const GenericCanvas = ({ canvasRef }: Props) => {
  const {
    state: { screenSize },
  } = useContext(store);

  return (
    <CanvasComponent
      marginLeft={screenSize.width / 2 - maxCavasWidth / 2}
      height={screenSize.height}
      width={
        screenSize.width < maxCavasWidth ? screenSize.width : maxCavasWidth
      }
      className="canvas"
      ref={canvasRef}
    />
  );
};

const CanvasComponent = styled.canvas<{ marginLeft: number }>`
  position: fixed;
  top: 60px;
  left: ${({ marginLeft }) => marginLeft}px;

  @media (max-width: ${mediaQueries.mobile}) {
    top: 0;
    left: 0;
    width: 100%;
  }
`;
