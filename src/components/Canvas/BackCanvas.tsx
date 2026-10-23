import React, { useContext, useEffect, useRef, useState } from "react";
import { store } from "../../context";
import { bagpipes } from "../../dataset/bagpipes";
import { drawLines } from "../../utils/drawUtils/drawLines";

import { GenericCanvas } from "./GenericCanvas";

export const BackCanvas = () => {
  const {
    state: { bagpipeType, isPlaying, activeSong, screenSize },
  } = useContext(store);

  const canvasRef = useRef(null);
  const [imageLoadedTick, setImageLoadedTick] = useState(0);

  // The background image may still be downloading on the first draw (e.g. a direct link on a slow phone),
  // so redraw once it arrives instead of leaving the bag and drone missing.
  useEffect(() => {
    const bgImage = bagpipes[bagpipeType].images.bgImage;
    if (!bgImage || bgImage.complete) return;
    const onLoad = () => setImageLoadedTick((tick) => tick + 1);
    bgImage.addEventListener("load", onLoad);
    return () => bgImage.removeEventListener("load", onLoad);
  }, [bagpipeType]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context: CanvasRenderingContext2D | null =
      canvas && (canvas as HTMLCanvasElement)!.getContext("2d");

    drawLines(context!, bagpipeType);
  }, [canvasRef.current, bagpipeType, isPlaying, activeSong, screenSize, imageLoadedTick]);

  return <GenericCanvas canvasRef={canvasRef} />;
};
