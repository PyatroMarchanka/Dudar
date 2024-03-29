import { drawStatic } from "./../utils/drawUtils/drawAll";
import { useContext, useEffect, useRef } from "react";
import { store } from "../context";
import { SharpNotes } from "../interfaces";
import { cleanLines } from "../utils/drawUtils/drawAll";

import { useNotesNames } from "./useNotesNames";

export const useDrawStatic = (activeHole: { note: SharpNotes; octave: number } | null) => {
  const {
    state: { activeSong, songNotes, bagpipeType },
  } = useContext(store);
  const canvasRef = useRef(null);

  const { notesMap: notesNameToLine, bagpipeNotes } = useNotesNames();

  useEffect(() => {
    const canvas = canvasRef.current;
    const context: CanvasRenderingContext2D | null =
      canvas && (canvas as HTMLCanvasElement)!.getContext("2d");

    cleanLines(context!);
  }, [activeSong, bagpipeType]);

  useEffect(() => {
    let animationFrameId: number;
    const canvas = canvasRef.current;
    const context: CanvasRenderingContext2D | null =
      canvas && (canvas as HTMLCanvasElement)!.getContext("2d");

    const render = () => {
      drawStatic(context!, bagpipeType, notesNameToLine, bagpipeNotes, activeHole);

      animationFrameId = window.requestAnimationFrame(render);
    };
    render();
    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [activeHole, songNotes, bagpipeType]);

  return canvasRef;
};
