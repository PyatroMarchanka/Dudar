import { drawStatic } from "./../utils/drawUtils/drawAll";
import { useContext, useEffect, useRef, useCallback } from "react";
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
  const prevDependenciesRef = useRef<any>(null);

  const { notesMap: notesNameToLine, bagpipeNotes } = useNotesNames();
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const context: CanvasRenderingContext2D | null =
      canvas && (canvas as HTMLCanvasElement)!.getContext("2d");

    cleanLines(context!);
  }, [activeSong, bagpipeType, isMusicSheets]);

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const context: CanvasRenderingContext2D | null =
      canvas && (canvas as HTMLCanvasElement)!.getContext("2d");
    console.log('render')
    if (context) {
      drawStatic(
        context,
        bagpipeType,
        notesNameToLine,
        bagpipeNotes,
        activeHole
      );
    }
  }, [bagpipeType, notesNameToLine, bagpipeNotes, activeHole]);

  useEffect(() => {
    if (!notesNameToLine || !bagpipeNotes) {
      return;
    }

    // Only render if dependencies have actually changed
    const currentDependencies = { activeHole, songNotes, bagpipeType, bagpipeNotes };
    const prevDependencies = prevDependenciesRef.current;

    const hasDependencyChanged =
      !prevDependencies ||
      prevDependencies.activeHole !== activeHole ||
      prevDependencies.songNotes !== songNotes ||
      prevDependencies.bagpipeType !== bagpipeType ||
      prevDependencies.bagpipeNotes !== bagpipeNotes;

    if (hasDependencyChanged) {
      prevDependenciesRef.current = currentDependencies;
      const animationFrameId = window.requestAnimationFrame(renderCanvas);
      return () => {
        window.cancelAnimationFrame(animationFrameId);
      };
    }
  }, [activeHole, songNotes, bagpipeType, bagpipeNotes, renderCanvas]);

  return canvasRef;
};
