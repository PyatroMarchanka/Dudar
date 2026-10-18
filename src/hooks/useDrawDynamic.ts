import { useContext, useEffect, useRef, useState } from 'react';
import { store } from '../context';
import { cleanLines, drawDynamic } from '../utils/drawUtils/drawAll';
import { MidiPlayer } from '../utils/MidiPlayer';
import { sizes } from '../constants/style';

import { useNotesMoving } from './useNotesMoving';

// The player reports its position from a timer, a few times per screen frame and unevenly.
// Between reports the roll keeps moving at the song's speed, but never more than this far ahead.
const maxExtrapolationMs = 80;
// A reported jump bigger than this (seek, loop, restart) is shown at once instead of smoothed
const maxSmoothedGapTicks = 200;

export const useDrawDynamic = (player: MidiPlayer | null) => {
  const {
    state: { showPianoRoll, activeSong, bagpipeType, midiData, isPlaying, songLength },
    setProgress,
  } = useContext(store);
  const canvasRef = useRef(null);
  const { notes, setTick, tick } = useNotesMoving();

  // The latest playhead position and when it arrived. Updated on every player report without
  // re-rendering React; the animation loop below reads it once per frame.
  const reportedRef = useRef({ tick: 0, at: 0 });
  const drawnTickRef = useRef(0);
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;
  const playerRef = useRef(player);
  playerRef.current = player;

  const moveTo = (newTick: number) => {
    reportedRef.current = { tick: newTick, at: performance.now() };
  };

  // Position set from React state: paused seeking, stop, a new song
  useEffect(() => {
    moveTo(tick);
    drawnTickRef.current = tick;
  }, [tick]);

  const dragStateRef = useRef<{ pointerId: number; startX: number; startTick: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!midiData || !activeSong) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStateRef.current = { pointerId: e.pointerId, startX: e.clientX, startTick: drawnTickRef.current };
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
      player.handleNotesMoving = moveTo;
    }
  }, [player, showPianoRoll]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context: CanvasRenderingContext2D | null = canvas && (canvas as HTMLCanvasElement)!.getContext('2d');

    cleanLines(context!);
  }, [activeSong, bagpipeType]);

  // One draw per screen frame
  useEffect(() => {
    let animationFrameId: number;
    const canvas = canvasRef.current;
    const context: CanvasRenderingContext2D | null = canvas && (canvas as HTMLCanvasElement)!.getContext('2d');

    if (!context || !activeSong || !midiData) return;

    const render = () => {
      const reported = reportedRef.current;
      let frameTick = reported.tick;

      if (isPlayingRef.current && !dragStateRef.current) {
        const ticksPerMs = playerRef.current?.getTicksPerMs() || 0;
        const sinceReport = Math.min(performance.now() - reported.at, maxExtrapolationMs);
        frameTick = reported.tick + Math.max(sinceReport, 0) * ticksPerMs;

        // Small step backwards: a report landed slightly behind what was already drawn. Hold
        // still for a moment rather than jitter back.
        const drawn = drawnTickRef.current;
        if (frameTick < drawn && drawn - frameTick < maxSmoothedGapTicks) {
          frameTick = drawn;
        }
      }

      drawnTickRef.current = frameTick;
      drawDynamic(context, bagpipeType, frameTick, midiData, notes, activeSong);
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [bagpipeType, midiData, notes, activeSong]);

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
