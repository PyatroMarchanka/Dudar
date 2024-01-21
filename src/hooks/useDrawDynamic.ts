import { useContext, useEffect, useRef } from "react";
import { store } from "../context";
import { cleanLines, drawDynamic } from "../utils/drawUtils/drawAll";
import { MidiPlayer } from "../utils/MidiPlayer";

import { useNotesMoving } from "./useNotesMoving";

export const useDrawDynamic = (player: MidiPlayer | null) => {
  const {
    state: { showPianoRoll, activeSong, songNotes, bagpipeType, midiData },
  } = useContext(store);
  const canvasRef = useRef(null);
  const { previousNotes, nextNotes, nextToNextNotes, setTick, tick } = useNotesMoving();

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
      drawDynamic(context!, bagpipeType, tick, midiData, previousNotes, nextNotes, nextToNextNotes, activeSong);
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [drawDynamic, tick, bagpipeType]);

  return canvasRef;
};
