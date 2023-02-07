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
    <div>
      <CanvasComponent
        height={screenSize.height}
        width={
          screenSize.width < maxCavasWidth ? screenSize.width : maxCavasWidth
        }
        className="canvas"
        ref={canvasRef}
      />
    </div>
  );
};

const CanvasComponent = styled.canvas`
  position: fixed;

  @media (max-width: ${mediaQueries.mobile}) {
    width: 100%;
  }
`;
