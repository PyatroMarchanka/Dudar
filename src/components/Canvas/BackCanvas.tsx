import React, { useContext, useEffect, useRef } from "react";
import { store } from "../../context";
import { drawLines } from "../../utils/drawUtils/drawLines";

import { GenericCanvas } from "./GenericCanvas";

type Props = {};

export const BackCanvas = ({}: Props) => {
  const {
    state: { bagpipeType },
  } = useContext(store);

  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context: CanvasRenderingContext2D | null =
      canvas && (canvas as HTMLCanvasElement)!.getContext("2d");

    drawLines(context!, bagpipeType);
  }, [canvasRef.current, bagpipeType]);

  return <GenericCanvas canvasRef={canvasRef} />;
};
