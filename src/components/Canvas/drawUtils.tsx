import { Note } from "@tonejs/midi/dist/Note";
import { mediaQueries } from "../../constants/style";
import { SharpNotes } from "../../interfaces";
import { mainColors } from "../../utils/theme";

const numbers = {
  4: {
    G: 0,
    A: 1,
    B: 2,
  },
  5: {
    C: 3,
    D: 4,
    E: 5,
    F: 6,
    G: 7,
    A: 8,
  },
};
const coefficient = 0.8;
const coeff = (num: number) => num * coefficient;

const yPoses = [
  coeff(281),
  coeff(252),
  coeff(223),
  coeff(194),
  coeff(143),
  coeff(114),
  coeff(84),
  coeff(44),
  coeff(8),
];
const yPosesReversed = [
  coeff(281),
  coeff(252),
  coeff(223),
  coeff(194),
  coeff(143),
  coeff(114),
  coeff(84),
  coeff(44),
  coeff(8),
].reverse();

const brickhHeight = coeff(22);
const holeRadius = coeff(5);
const notesScale = 0.3;
const holeLeftMargin = 12;

const formatOctave = (octave: number, lowestOctave?: number) => {
  if (octave === 6) {
    return undefined;
  } else if (lowestOctave && lowestOctave === 3) {
    return ++octave;
  }

  return octave;
};

const getYposByNote = (
  note: SharpNotes,
  octave: number,
  lowestOctave?: number
) => {
  const formattedOctave = formatOctave(octave, lowestOctave);

  if (
    !formattedOctave ||
    !yPoses[(numbers as any)[formattedOctave]?.[note[0]]]
  ) {
    return;
  }
  const yPos = yPoses[(numbers as any)[formattedOctave][note[0]]];

  return {
    yPosInPx: yPos,
    position: (numbers as any)[formattedOctave][note[0]],
  };
};

export const drawActiveHole = (
  ctx: CanvasRenderingContext2D,
  lowestOctave: number,
  activeHole?: { note: SharpNotes; octave: number } | null,
  isClosedManer?: boolean
) => {
  if (!activeHole) {
    return;
  }

  const yPos = getYposByNote(activeHole.note, activeHole?.octave, lowestOctave);
  if (!yPos?.yPosInPx) {
    return;
  }
  const margin = coeff(11);

  if (!isClosedManer) {
    yPosesReversed.forEach((pos, i) => {
      if (i <= yPoses.length - yPos.position - 1 && i >= 1) {
        ctx.arc(holeLeftMargin, pos + margin, holeRadius, 0, 2 * Math.PI);
        ctx.fillStyle = i > 0 ? mainColors.greyColor : "#8d4444";
        ctx.fill();
      }
    });
  } else {
    ctx.arc(holeLeftMargin, yPos.yPosInPx + margin, holeRadius, 0, 2 * Math.PI);
    ctx.fillStyle = mainColors.greyColor;
    ctx.fill();
  }
};

export const drawNote = (
  ctx: CanvasRenderingContext2D,
  note: SharpNotes,
  dur: number,
  start: number,
  tick: number,
  octave: number
) => {
  const y = getYposByNote(note, octave);
  if (!y?.yPosInPx) {
    return;
  }

  const startPos = start * notesScale - tick * notesScale;
  if (startPos < 0) {
    ctx.fillStyle = mainColors.yellow;
  } else {
    ctx.fillStyle = "#5a5a5a";
  }
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = coeff(5);
  ctx.stroke();

  ctx.fillRect(startPos, y.yPosInPx, dur * notesScale, brickhHeight);

  ctx.strokeRect(startPos, y.yPosInPx, dur * notesScale, brickhHeight);
};

export const drawNotes = (
  ctx: CanvasRenderingContext2D,
  tick: number,
  nextNotes?: Note[],
  nextToNextNotes?: Note[]
) => {
  ctx.beginPath();

  nextNotes &&
    nextNotes?.forEach((note) => {
      drawNote(
        ctx,
        note.pitch as SharpNotes,
        note.durationTicks,
        note.ticks,
        tick,
        note.octave
      );
    });

  nextToNextNotes &&
    nextToNextNotes?.forEach((note) => {
      drawNote(
        ctx,
        note.pitch as SharpNotes,
        note.durationTicks,
        note.ticks,
        tick,
        note.octave
      );
    });

  ctx.fill();
};

const imageScale = 30 / 275;
const width = coeff(40);

export const drawBagpipe = (ctx: CanvasRenderingContext2D) => {
  const image = new Image();
  image.src = "/images/half-duda-mono-30px-275px.png";

  ctx.fillStyle = "#ffffff";

  const height = width / imageScale;
  ctx.drawImage(image, 0, 0, width, height);
};

const drawLines = (ctx: CanvasRenderingContext2D) => {
  ctx.fillStyle = "#eaeaea";
  yPoses.forEach((yPos) => {
    ctx.fillRect(0, yPos, window.innerWidth, brickhHeight);
  });
};

export const drawAll = (
  ctx: CanvasRenderingContext2D,
  tick: number,
  lowestOctave: number,
  nextNotes?: Note[],
  nextToNextNotes?: Note[],
  activeHole?: { note: SharpNotes; octave: number } | null,
  isClosedManer?: boolean
) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  drawLines(ctx);
  drawNotes(ctx, tick, nextNotes, nextToNextNotes);
  drawBagpipe(ctx!);
  drawActiveHole(ctx!, lowestOctave, activeHole, isClosedManer);
};
