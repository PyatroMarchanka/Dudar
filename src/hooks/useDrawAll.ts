import { useContext, useEffect, useRef } from "react";
import { store } from "../context";
import { SharpNotes } from "../interfaces";
import { cleanLines, drawAll } from "../utils/drawUtils/drawAll";
import { MidiPlayer } from "../utils/MidiPlayer";

import { useNotesMoving } from "./useNotesMoving";
import { useNotesNames } from "./useNotesNames";

export const useDrawAll = (
  player: MidiPlayer | null,
  activeHole: { note: SharpNotes; octave: number } | null
) => {
  const {
    state: { showPianoRoll, activeSong, songNotes, bagpipeType },
  } = useContext(store);
  const canvasRef = useRef(null);
  const { nextNotes, nextToNextNotes, setTick, tick } = useNotesMoving();

  const notesMap = useNotesNames();

  useEffect(() => {
    if (player && showPianoRoll) {
      player.handleNotesMoving = setTick;
    }
  }, [player, showPianoRoll]);

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

    //RENDER
    const render = () => {
      drawAll(
        context!,
        bagpipeType,
        tick,
        { songNotes, notesNameToLine: notesMap },
        nextNotes,
        nextToNextNotes,
        activeHole
      );
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [drawAll, tick, activeHole, songNotes, bagpipeType]);

  return canvasRef;
};
