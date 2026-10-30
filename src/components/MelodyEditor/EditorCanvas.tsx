import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { mainColors } from '../../utils/theme';
import {
  dragNoteTiming,
  getBarTicks,
  getRollEnd,
  MelodyRoll,
  NoteDragMode,
  setNoteTiming,
} from '../../utils/midiUtils/melodyRoll';
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
  // Grid that new and dragged notes snap to
  snap: number;
  selected: number | null;
  playheadTick: number | null;
  emptyHint: string;
  onTap: (laneIndex: number, tick: number) => void;
  onLabelTap: (laneIndex: number, position: { x: number; y: number }) => void;
  onSwipe: (direction: 1 | -1) => void;
  // A note was picked up to drag
  onDragStart: (index: number) => void;
  // A dragged note was let go at a new place
  onNoteTiming: (index: number, tick: number, duration: number) => void;
}

// Width of the note names at the left
const GUTTER = 44;
const RIGHT_PAD = 8;
const TOP_PAD = 18;
const BOTTOM_PAD = 6;
// A horizontal move longer than this is a swipe to the next or previous page, not a tap
const SWIPE_PX = 50;
const TAP_SLOP_PX = 12;
// A press on a note becomes a drag once it moves this far
const DRAG_START_PX = 6;
// How far from a note's edge a press grabs the edge instead of the whole note
const EDGE_TOUCH_PX = 16;
const EDGE_MOUSE_PX = 8;

interface Drag {
  pointerId: number;
  index: number;
  mode: NoteDragMode;
  startX: number;
  active: boolean;
}

interface DragPreview {
  index: number;
  tick: number;
  duration: number;
}

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
    onDragStart,
    onNoteTiming,
  } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const pointerRef = useRef<{ id: number; x: number; y: number } | null>(null);
  const dragRef = useRef<Drag | null>(null);
  const [preview, setPreview] = useState<DragPreview | null>(null);
  const [cursor, setCursor] = useState('default');

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
    // While a note is dragged, it and the neighbours it pushes are drawn where they'd land
    const notes = preview ? setNoteTiming(roll, preview.index, preview.tick, preview.duration).notes : roll.notes;
    notes.forEach(([pitch, tick, duration], index) => {
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
        // Grips at both ends: drag them to change where the note starts and ends
        if (w > 14) {
          ctx.fillStyle = 'white';
          const gripHeight = brickHeight * 0.5;
          const gripY = y + (brickHeight - gripHeight) / 2;
          ctx.fillRect(x + 3, gripY, 2, gripHeight);
          ctx.fillRect(x + w - 5, gripY, 2, gripHeight);
        }
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
  }, [
    size,
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
    preview,
  ]);

  // The note under a point and which part of it: an edge or the whole note
  const hitNote = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (x < GUTTER) return null;
    const layout = getLayout(rect.width, rect.height, lanes.length, viewTicks);
    const laneIndex = Math.floor((y - TOP_PAD) / layout.laneHeight);
    if (laneIndex < 0 || laneIndex >= lanes.length) return null;
    const tick = viewStart + (x - GUTTER) / layout.pxPerTick;
    // A little slack around short notes, so they can still be grabbed by a finger
    const slack = (e.pointerType === 'mouse' ? 2 : 6) / layout.pxPerTick;
    const index = roll.notes.findIndex(
      ([pitch, start, duration]) =>
        lanes[laneIndex].pitches.includes(pitch) && start - slack <= tick && tick < start + duration + slack
    );
    if (index === -1) return null;
    const [, start, duration] = roll.notes[index];
    const width = duration * layout.pxPerTick;
    const edge = Math.min(e.pointerType === 'mouse' ? EDGE_MOUSE_PX : EDGE_TOUCH_PX, width / 3);
    const fromStart = (tick - start) * layout.pxPerTick;
    const mode: NoteDragMode = fromStart < edge ? 'start' : fromStart > width - edge ? 'end' : 'move';
    return { index, mode, pxPerTick: layout.pxPerTick };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) {
      // A mouse hovering over a note shows what a drag would do
      if (e.pointerType === 'mouse' && !pointerRef.current) {
        const hit = hitNote(e);
        setCursor(!hit ? 'default' : hit.mode === 'move' ? 'grab' : 'ew-resize');
      }
      return;
    }
    const dx = e.clientX - drag.startX;
    if (!drag.active) {
      if (Math.abs(dx) < DRAG_START_PX) return;
      drag.active = true;
      e.currentTarget.setPointerCapture(e.pointerId);
      onDragStart(drag.index);
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const { pxPerTick } = getLayout(rect.width, rect.height, lanes.length, viewTicks);
    const [tick, duration] = dragNoteTiming(roll, drag.index, drag.mode, dx / pxPerTick, snap);
    setPreview({ index: drag.index, tick, duration });
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (pointerRef.current) return;
    pointerRef.current = { id: e.pointerId, x: e.clientX, y: e.clientY };
    const hit = hitNote(e);
    dragRef.current = hit
      ? { pointerId: e.pointerId, index: hit.index, mode: hit.mode, startX: e.clientX, active: false }
      : null;
  };

  const cancelDrag = () => {
    pointerRef.current = null;
    dragRef.current = null;
    setPreview(null);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const start = pointerRef.current;
    const drag = dragRef.current;
    pointerRef.current = null;
    dragRef.current = null;
    if (!start || start.id !== e.pointerId) return;

    if (drag?.active) {
      setPreview(null);
      const [, tick, duration] = roll.notes[drag.index];
      if (preview && preview.index === drag.index && (preview.tick !== tick || preview.duration !== duration)) {
        onNoteTiming(drag.index, preview.tick, preview.duration);
      }
      return;
    }

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
        style={{
          width: size.width,
          height: size.height,
          cursor: preview ? (dragRef.current?.mode === 'move' ? 'grabbing' : 'ew-resize') : cursor,
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={cancelDrag}
        onPointerLeave={(e) => e.pointerType === 'mouse' && !dragRef.current && setCursor('default')}
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
