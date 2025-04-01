import { drawStatic } from "./../utils/drawUtils/drawAll";
import { useContext, useEffect, useRef } from "react";
import { store } from "../context";
import { SharpNotes } from "../interfaces";
import { cleanLines } from "../utils/drawUtils/drawAll";

import { useNotesNames } from "./useNotesNames";

export const useDrawStatic = (
  activeHole: { note: SharpNotes; octave: number } | null
) => {
  const {
    state: { activeSong, songNotes, bagpipeType, isMusicSheets },
  } = useContext(store);
  const canvasRef = useRef(null);

  const { notesMap: notesNameToLine, bagpipeNotes } = useNotesNames();
  useEffect(() => {
    const canvas = canvasRef.current;
    const context: CanvasRenderingContext2D | null =
      canvas && (canvas as HTMLCanvasElement)!.getContext("2d");

    cleanLines(context!);
  }, [activeSong, bagpipeType, isMusicSheets]);

  useEffect(() => {
    if (!notesNameToLine || !bagpipeNotes) {
      return;
    }

    let animationFrameId: number;
    const canvas = canvasRef.current;
    const context: CanvasRenderingContext2D | null =
      canvas && (canvas as HTMLCanvasElement)!.getContext("2d");

    const render = () => {
      drawStatic(
        context!,
        bagpipeType,
        notesNameToLine,
        bagpipeNotes,
        activeHole
      );

      animationFrameId = window.requestAnimationFrame(render);
    };
    render();
    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [activeHole, songNotes, bagpipeType, bagpipeNotes]);

  return canvasRef;
};
