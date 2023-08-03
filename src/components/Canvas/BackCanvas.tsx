import React, { useContext, useEffect, useRef } from "react";
import { store } from "../../context";
import { drawLines } from "../../utils/drawUtils/drawLines";

import { GenericCanvas } from "./GenericCanvas";

export const BackCanvas = () => {
  const {
    state: { bagpipeType, isPlaying, activeSong },
  } = useContext(store);

  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context: CanvasRenderingContext2D | null =
      canvas && (canvas as HTMLCanvasElement)!.getContext("2d");

    drawLines(context!, bagpipeType);
  }, [canvasRef.current, bagpipeType, isPlaying, activeSong]);

  return <GenericCanvas canvasRef={canvasRef} />;
};
