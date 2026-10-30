import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { mainColors } from '../../utils/theme';
import { getBarTicks, getRollEnd, MelodyRoll } from '../../utils/midiUtils/melodyRoll';
import { transposeNoteWithOctave } from '../../utils/midiUtils';
import { getLaneIndex, Lane } from './lanes';

interface Props {
  roll: MelodyRoll;
  lanes: Lane[];
  // Pitch each lane adds on a tap
  laneChoices: number[];
  transpose: number;
  viewStart: number;
  viewTicks: number;
  // Grid of the selected note length
  snap: number;
  selected: number | null;
  playheadTick: number | null;
  emptyHint: string;
  onTap: (laneIndex: number, tick: number) => void;
  onLabelTap: (laneIndex: number, position: { x: number; y: number }) => void;
  onSwipe: (direction: 1 | -1) => void;
}

// Width of the note names at the left
const GUTTER = 44;
const RIGHT_PAD = 8;
const TOP_PAD = 18;
const BOTTOM_PAD = 6;
// A horizontal move longer than this is a swipe to the next or previous page, not a tap
const SWIPE_PX = 50;
const TAP_SLOP_PX = 12;

const noteLabel = (note: string, transpose: number) => {
  const transposed = transposeNoteWithOctave(note as any, transpose);
  return transposed.slice(0, -1);
};

interface Layout {
  width: number;
  height: number;
  laneHeight: number;
  pxPerTick: number;
}

const getLayout = (width: number, height: number, laneCount: number, viewTicks: number): Layout => ({
  width,
  height,
  laneHeight: (height - TOP_PAD - BOTTOM_PAD) / Math.max(laneCount, 1),
  pxPerTick: (width - GUTTER - RIGHT_PAD) / viewTicks,
});

const laneCenter = (layout: Layout, index: number) => TOP_PAD + layout.laneHeight * (index + 0.5);

// The piano roll: the bagpipe's hole lines from top (highest) to bottom, time
// running left to right, one page (half a bar to four bars) at a time.
export const EditorCanvas = (props: Props) => {
  const {
    roll,
    lanes,
    laneChoices,
    transpose,
    viewStart,
    viewTicks,
    snap,
    selected,
    playheadTick,
    emptyHint,
    onTap,
    onLabelTap,
    onSwipe,
  } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const pointerRef = useRef<{ id: number; x: number; y: number } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const measure = () => setSize({ width: container.clientWidth, height: container.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !size.width || !size.height) return;

    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.round(size.width * ratio);
    canvas.height = Math.round(size.height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    const layout = getLayout(size.width, size.height, lanes.length, viewTicks);
    const { width, height, laneHeight, pxPerTick } = layout;
    const xOf = (tick: number) => GUTTER + (tick - viewStart) * pxPerTick;
    const viewEnd = viewStart + viewTicks;
    const barTicks = getBarTicks(roll);
    const rollEnd = getRollEnd(roll);
    const beatTicks = roll.timeSignature.endsWith('/8') ? roll.ppq / 2 : roll.ppq;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);

    // Past the last bar
    if (rollEnd < viewEnd) {
      ctx.fillStyle = mainColors.lightestGrey;
      ctx.fillRect(xOf(Math.max(rollEnd, viewStart)), 0, width, height);
    }

    // Lane bands, every other one tinted, so a tap target is easy to see
    lanes.forEach((_, index) => {
      if (index % 2) {
        ctx.fillStyle = 'rgba(221, 213, 206, 0.25)';
        ctx.fillRect(GUTTER, TOP_PAD + laneHeight * index, width - GUTTER, laneHeight);
      }
    });

    // Grid: the selected length, beats, bars
    // Too dense to see (1/32 over four bars): beats only. Counted from each bar's start, like snapping.
    const gridStep = snap * pxPerTick < 6 ? beatTicks : snap;
    for (let barStart = Math.floor(viewStart / barTicks) * barTicks; barStart < viewEnd; barStart += barTicks) {
      for (let inBar = gridStep; inBar < barTicks - 0.01; inBar += gridStep) {
        const x = xOf(barStart + inBar);
        if (x < GUTTER - 0.5 || x > width) continue;
        ctx.beginPath();
        ctx.moveTo(x, TOP_PAD);
        ctx.lineTo(x, height - BOTTOM_PAD);
        ctx.strokeStyle = mainColors.lightGrey;
        ctx.lineWidth = 1;
        ctx.setLineDash(Math.abs(inBar % beatTicks) < 0.01 ? [] : [3, 4]);
        ctx.stroke();
      }
    }
    ctx.setLineDash([]);
    const firstBar = Math.floor(viewStart / barTicks);
    for (let bar = firstBar; bar * barTicks <= viewEnd; bar++) {
      const x = xOf(bar * barTicks);
      if (x < GUTTER - 0.5) continue;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height - BOTTOM_PAD);
      ctx.strokeStyle = mainColors.darkerGray;
      ctx.lineWidth = 2;
      ctx.stroke();
      if (bar < roll.bars && x < width - 20) {
        ctx.fillStyle = mainColors.darkerGray;
        ctx.font = '600 12px Roboto, sans-serif';
        ctx.textBaseline = 'top';
        ctx.textAlign = 'left';
        ctx.fillText(String(bar + 1), x + 4, 3);
      }
    }

    // Hole lines, as on the play screen
    lanes.forEach((_, index) => {
      const y = laneCenter(layout, index);
      ctx.beginPath();
      ctx.moveTo(GUTTER, y);
      ctx.lineTo(width, y);
      ctx.strokeStyle = mainColors.greyColor;
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Notes
    const brickHeight = Math.max(Math.min(laneHeight * 0.62, 30), 10);
    roll.notes.forEach(([pitch, tick, duration], index) => {
      if (tick >= viewEnd || tick + duration <= viewStart) return;
      const laneIndex = getLaneIndex(lanes, pitch);
      if (laneIndex === -1) return;
      const x = xOf(tick) + 1;
      const w = Math.max(duration * pxPerTick - 2, 4);
      const y = laneCenter(layout, laneIndex) - brickHeight / 2;
      const isSelected = index === selected;
      const isSounding = playheadTick !== null && tick <= playheadTick && playheadTick < tick + duration;
      ctx.beginPath();
      // @ts-ignore roundRect is polyfilled in drawNotes for older browsers
      ctx.roundRect(x, y, w, brickHeight, Math.min(8, brickHeight / 2));
      ctx.fillStyle = isSelected ? mainColors.orange : isSounding ? mainColors.darkRed : mainColors.darkerGray;
      ctx.fill();
      if (isSelected) {
        ctx.strokeStyle = mainColors.darkestRed;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      const lane = lanes[laneIndex];
      if (lane.pitches.length > 1 && w > 26) {
        ctx.fillStyle = 'white';
        ctx.font = '500 11px Roboto, sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        const name = noteLabel(lane.notes[lane.pitches.indexOf(pitch)], transpose);
        ctx.fillText(name, Math.max(x, GUTTER) + 5, y + brickHeight / 2);
      }
    });

    // Note names column
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, GUTTER, height);
    ctx.beginPath();
    ctx.moveTo(GUTTER, 0);
    ctx.lineTo(GUTTER, height);
    ctx.strokeStyle = mainColors.lightGrey;
    ctx.lineWidth = 1;
    ctx.stroke();
    lanes.forEach((lane, index) => {
      const choice = lane.pitches.indexOf(laneChoices[index]);
      const name = noteLabel(lane.notes[choice === -1 ? 0 : choice], transpose);
      ctx.fillStyle = mainColors.darkerGray;
      ctx.font = `600 ${Math.min(14, Math.max(laneHeight * 0.45, 10))}px Roboto, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(name + (lane.pitches.length > 1 ? '▾' : ''), GUTTER / 2, laneCenter(layout, index));
    });

    if (!roll.notes.length) {
      ctx.fillStyle = mainColors.midGrey;
      ctx.font = '500 15px Roboto, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(emptyHint, GUTTER + (width - GUTTER) / 2, TOP_PAD + laneHeight * 0.5 - 2);
    }

    if (playheadTick !== null && playheadTick >= viewStart && playheadTick <= viewEnd) {
      const x = xOf(playheadTick);
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.strokeStyle = mainColors.red;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }, [size, roll, lanes, laneChoices, transpose, viewStart, viewTicks, snap, selected, playheadTick, emptyHint]);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (pointerRef.current) return;
    pointerRef.current = { id: e.pointerId, x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const start = pointerRef.current;
    pointerRef.current = null;
    if (!start || start.id !== e.pointerId) return;

    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) > SWIPE_PX && Math.abs(dx) > Math.abs(dy)) {
      onSwipe(dx < 0 ? 1 : -1);
      return;
    }
    if (Math.abs(dx) > TAP_SLOP_PX || Math.abs(dy) > TAP_SLOP_PX) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = start.x - rect.left;
    const y = start.y - rect.top;
    const layout = getLayout(rect.width, rect.height, lanes.length, viewTicks);
    const laneIndex = Math.min(Math.max(Math.floor((y - TOP_PAD) / layout.laneHeight), 0), lanes.length - 1);

    if (x < GUTTER) {
      onLabelTap(laneIndex, { x: start.x, y: start.y });
      return;
    }
    const tick = viewStart + (x - GUTTER) / layout.pxPerTick;
    if (tick >= viewStart + viewTicks) return;
    onTap(laneIndex, tick);
  };

  return (
    <Container ref={containerRef}>
      <canvas
        ref={canvasRef}
        style={{ width: size.width, height: size.height }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => (pointerRef.current = null)}
      />
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;
  /* Taps and swipes are handled by the editor, not the browser (no scrolling or zoom) */
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;

  canvas {
    display: block;
    touch-action: none;
  }
`;
