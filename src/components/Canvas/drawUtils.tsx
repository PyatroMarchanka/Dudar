import { Note } from "@tonejs/midi/dist/Note";
import { mediaQueries } from "../../constants/style";
import { SharpNotes } from "../../interfaces";

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
  coeff(375),
  coeff(318),
  coeff(261),
  coeff(216),
  coeff(165),
  coeff(122),
  coeff(83),
  coeff(40),
  coeff(8),
];
const yPosesReversed = [
  coeff(375),
  coeff(318),
  coeff(261),
  coeff(216),
  coeff(165),
  coeff(122),
  coeff(83),
  coeff(40),
  coeff(8),
].reverse();

const brickhHeight = coeff(25);

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
  const radius = coeff(10);
  const margin = coeff(15);

  if (!isClosedManer) {
    yPosesReversed.forEach((pos, i) => {
      if (i <= yPoses.length - yPos.position - 1) {
        ctx.arc(18, pos + margin, radius, 0, 2 * Math.PI);
        ctx.fillStyle = "#fff";
        ctx.fill();
      }
    });
  } else {
    ctx.arc(18, yPos.yPosInPx + margin, radius, 0, 2 * Math.PI);
    ctx.fillStyle = "#fff";
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

  const coefficient = 0.3;

  const startPos = start * coefficient - tick * coefficient;
  if (startPos < 0) {
    ctx.fillStyle = "#b8440a";
  } else {
    ctx.fillStyle = "#b8720a";
  }
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = coeff(5);
  ctx.stroke();

  ctx.fillRect(startPos, y.yPosInPx, dur * coefficient, brickhHeight);

  ctx.strokeRect(startPos, y.yPosInPx, dur * coefficient, brickhHeight);
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

export const drawBagpipe = (ctx: CanvasRenderingContext2D) => {
  const image = new Image();
  image.src = "/images/half-duda-mono-30px-275px.png";

  ctx.fillStyle = "#ffffff";
  const coefficient = 30 / 275;
  const width = coeff(40);
  const height = width / coefficient;
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
