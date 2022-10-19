import { Note } from "@tonejs/midi/dist/Note";
import { Notes, SharpNotes } from "../../interfaces";

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

const formatOctave = (octave: number, lowestOctave?: number) => {
  if (octave === 6) {
    return undefined;
  } else if (lowestOctave && lowestOctave === 3) {
    return ++octave;
  }

  return octave;
};

export const getYposByNote = (
  note: SharpNotes,
  octave: number,
  lowestOctave?: number
) => {
  const yPoses = [375, 318, 261, 216, 165, 122, 83, 40, 8];
  const formattedOctave = formatOctave(octave, lowestOctave);

  if (
    !formattedOctave ||
    !yPoses[(numbers as any)[formattedOctave]?.[note[0]]]
  ) {
    return;
  }
  const result = yPoses[(numbers as any)[formattedOctave][note[0]]];

  return result;
};

export const drawActiveHole = (
  ctx: CanvasRenderingContext2D,
  lowestOctave: number,
  activeHole?: { note: SharpNotes; octave: number } | null
) => {
  if (!activeHole) {
    return;
  }

  const yPos = getYposByNote(activeHole.note, activeHole?.octave, lowestOctave);
  if (!yPos) {
    return;
  }

  ctx.arc(18, yPos + 15, 10, 0, 2 * Math.PI);
  ctx.fillStyle = "#fff";
  ctx.fill();
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
  if (!y) {
    return;
  }

  const coefficient = 0.3;
  const brickhHeight = 30;

  const startPos = start * coefficient - tick * coefficient;
  if (startPos < 0) {
    ctx.fillStyle = "#b8440a";
  } else {
    ctx.fillStyle = "#b8720a";
  }
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 5;
  ctx.stroke();

  ctx.fillRect(startPos, y, dur * coefficient, brickhHeight);

  ctx.strokeRect(startPos, y, dur * coefficient, brickhHeight);
};

export const draw = (
  ctx: CanvasRenderingContext2D,
  tick: number,
  nextNotes?: Note[],
  nextToNextNotes?: Note[]
) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
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
  image.src = "/images/bagpipe-9-holes.png";

  ctx.fillStyle = "#ffffff";

  ctx.fillRect(0, 0, 30, 500);
  ctx.drawImage(image, -50, 0, 136, 500);
};
