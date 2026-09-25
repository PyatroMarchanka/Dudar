import { useContext, useEffect, useRef, useMemo, useState } from 'react';
import { store } from '../context';
import { cleanLines, drawDynamic } from '../utils/drawUtils/drawAll';
import { MidiPlayer } from '../utils/MidiPlayer';
import { sizes } from '../constants/style';

import { useNotesMoving } from './useNotesMoving';

export const useDrawDynamic = (player: MidiPlayer | null) => {
  const {
    state: { showPianoRoll, activeSong, songNotes, bagpipeType, midiData, progress, isPlaying, songLength },
    setProgress,
  } = useContext(store);
  const canvasRef = useRef(null);
  const { previousPreviousNotes, previousNotes, nextNotes, nextToNextNotes, nextToNextToNextNotes, setTick, tick } =
    useNotesMoving();

  const dragStateRef = useRef<{ pointerId: number; startX: number; startTick: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!midiData || !activeSong) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStateRef.current = { pointerId: e.pointerId, startX: e.clientX, startTick: tick };
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const drag = dragStateRef.current;
    if (!drag || drag.pointerId !== e.pointerId || !midiData) return;

    const durationTicks = midiData.durationTicks || 0;
    if (!durationTicks) return;

    const deltaX = e.clientX - drag.startX;
    const rawTick = drag.startTick - deltaX / sizes.notesScale;
    const newTick = Math.min(Math.max(rawTick, 0), durationTicks);

    setTick(newTick);

    const elapsedPercent = (newTick / durationTicks) * 100;
    const timeRemaining = songLength ? (songLength * (100 - elapsedPercent)) / 100 : 0;
    setProgress(100 - elapsedPercent, songLength, timeRemaining);

    if (isPlaying) {
      player?.setTick(newTick, true);
    }
  };

  const handlePointerEnd = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const drag = dragStateRef.current;
    if (drag && drag.pointerId === e.pointerId) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    dragStateRef.current = null;
    setIsDragging(false);
  };

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

  return {
    canvasRef,
    isDragging,
    dragHandlers: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerEnd,
      onPointerCancel: handlePointerEnd,
    },
  };
};
