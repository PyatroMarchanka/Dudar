import { useContext, useEffect, useRef, useMemo } from 'react';
import { store } from '../context';
import { cleanLines, drawDynamic } from '../utils/drawUtils/drawAll';
import { MidiPlayer } from '../utils/MidiPlayer';

import { useNotesMoving } from './useNotesMoving';

export const useDrawDynamic = (player: MidiPlayer | null) => {
  const {
    state: { showPianoRoll, activeSong, songNotes, bagpipeType, midiData, progress, isPlaying },
  } = useContext(store);
  const canvasRef = useRef(null);
  const { previousPreviousNotes, previousNotes, nextNotes, nextToNextNotes, nextToNextToNextNotes, setTick, tick } =
    useNotesMoving();

  useEffect(() => {
    if (player && showPianoRoll) {
      player.handleNotesMoving = setTick;
    }
  }, [player, showPianoRoll]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context: CanvasRenderingContext2D | null = canvas && (canvas as HTMLCanvasElement)!.getContext('2d');

    cleanLines(context!);
  }, [activeSong, bagpipeType]);

  useEffect(() => {
    let animationFrameId: number;
    const canvas = canvasRef.current;
    const context: CanvasRenderingContext2D | null = canvas && (canvas as HTMLCanvasElement)!.getContext('2d');

    if (!context) return;

    //RENDER
    const render = () => {
      drawDynamic(
        context,
        bagpipeType,
        tick,
        midiData,
        previousNotes,
        nextNotes,
        nextToNextNotes,
        activeSong!,
        previousPreviousNotes,
        nextToNextToNextNotes
      );
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [
    tick,
    bagpipeType,
    midiData,
    previousNotes,
    nextNotes,
    nextToNextNotes,
    activeSong,
    previousPreviousNotes,
    nextToNextToNextNotes,
  ]);

  // Initial render to show notes before playback starts
  useEffect(() => {
    const canvas = canvasRef.current;
    const context: CanvasRenderingContext2D | null = canvas && (canvas as HTMLCanvasElement)!.getContext('2d');

    if (context && activeSong && midiData) {
      drawDynamic(
        context,
        bagpipeType,
        0,
        midiData,
        previousNotes,
        nextNotes,
        nextToNextNotes,
        activeSong,
        previousPreviousNotes,
        nextToNextToNextNotes
      );
    }
  }, [activeSong, midiData]);

  // Subscribe to progress change - when stopped (percent=100, time=0), render initial state
  useEffect(() => {
    if (progress && progress.percent === 0) {
      const canvas = canvasRef.current;
      const context: CanvasRenderingContext2D | null = canvas && (canvas as HTMLCanvasElement)!.getContext('2d');

      if (context && activeSong && midiData) {
        drawDynamic(
          context,
          bagpipeType,
          0,
          midiData,
          previousNotes,
          nextNotes,
          nextToNextNotes,
          activeSong,
          previousPreviousNotes,
          nextToNextToNextNotes
        );
      }
    }
  }, [
    progress,
    previousNotes,
    nextNotes,
    nextToNextNotes,
    previousPreviousNotes,
    nextToNextToNextNotes,
    activeSong,
    midiData,
    bagpipeType,
  ]);

  return canvasRef;
};
