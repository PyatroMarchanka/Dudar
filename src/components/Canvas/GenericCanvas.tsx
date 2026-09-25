import React, { useContext } from "react";
import styled from "styled-components";
import { mediaQueries, sizes } from "../../constants/style";
import { store } from "../../context";

type Props = {
  canvasRef: React.MutableRefObject<null>;
  interactive?: boolean;
  style?: React.CSSProperties;
  onPointerDown?: (e: React.PointerEvent<HTMLCanvasElement>) => void;
  onPointerMove?: (e: React.PointerEvent<HTMLCanvasElement>) => void;
  onPointerUp?: (e: React.PointerEvent<HTMLCanvasElement>) => void;
  onPointerCancel?: (e: React.PointerEvent<HTMLCanvasElement>) => void;
};

export const GenericCanvas = ({
  canvasRef,
  interactive = false,
  style,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
}: Props) => {
  const {
    state: { screenSize },
  } = useContext(store);

  return (
    <CanvasComponent
      marginLeft={screenSize.width / 2 - sizes.maxCanvasWidth / 2}
      height={screenSize.height}
      width={
        screenSize.width < sizes.maxCanvasWidth
          ? screenSize.width
          : sizes.maxCanvasWidth
      }
      className="canvas"
      ref={canvasRef}
      interactive={interactive}
      style={style}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
    />
  );
};

const CanvasComponent = styled.canvas<{ marginLeft: number; interactive: boolean }>`
  position: fixed;
  top: 60px;
  left: ${({ marginLeft }) => marginLeft}px;
  pointer-events: ${({ interactive }) => (interactive ? "auto" : "none")};
  touch-action: ${({ interactive }) => (interactive ? "none" : "auto")};

  @media (max-width: ${mediaQueries.mobile}) {
    top: 0;
    left: 0;
    width: 100%;
  }
`;
