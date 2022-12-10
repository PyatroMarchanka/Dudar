import { Note } from "@tonejs/midi/dist/Note";
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

const brickhHeight = coeff(18);
const brickHeightHalf = brickhHeight / 2;
const lineHeight = 2;
const holeImageRadius = coeff(38);
const holeImageRadiusHalf = holeImageRadius / 2;
const notesScale = 0.3;
const holeLeftMargin = 25;
const lastHoleLeftMargin = holeLeftMargin - 20;

const noteNameLeftMargin = 33;
const lastNoteNameLeftMargin = lastHoleLeftMargin + 8;

const yPoses = [
  coeff(640),
  coeff(554),
  coeff(508),
  coeff(452),
  coeff(396),
  coeff(298),
  coeff(242),
  coeff(186),
  coeff(130),
].reverse();

const yPosesReversed = [
  coeff(640),
  coeff(554),
  coeff(508),
  coeff(452),
  coeff(396),
  coeff(298),
  coeff(242),
  coeff(186),
  coeff(130),
];

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

const activeHoleImage = new Image();
activeHoleImage.src = "/images/piston_open.svg";

const backActiveHoleImage = new Image();
backActiveHoleImage.src = "/images/piston_back_open.svg";

const closedHoleImage = new Image();
closedHoleImage.src = "/images/piston_closed.svg";

const backClosedHoleImage = new Image();
backClosedHoleImage.src = "/images/piston_back_closed.svg";

const blowImage = new Image();
blowImage.src = "/images/blow.svg";

export const drawActiveHoles = (
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
  const topMargin = holeImageRadiusHalf;

  if (!isClosedManer) {
    yPosesReversed.forEach((pos, i) => {
      if (i <= yPoses.length - yPos.position - 1 && i >= 1) {
        // ctx.arc(holeLeftMargin, pos + topMargin, holeRadius, 0, 2 * Math.PI);
        // ctx.fillStyle = activeHoleColor;
        // ctx.fill();

        ctx.drawImage(
          i === 1 ? backActiveHoleImage : activeHoleImage,
          i === 1 ? lastHoleLeftMargin : holeLeftMargin,
          pos - topMargin,
          holeImageRadius,
          holeImageRadius
        );
      }
    });
  } else {
    ctx.drawImage(
      activeHoleImage,
      holeLeftMargin,
      yPos.yPosInPx - topMargin,
      holeImageRadius,
      holeImageRadius
    );
  }
};
const holes = yPosesReversed.slice(1);
const blowImageYPos = yPoses[yPoses.length - 1];

const drawClosedNotes = (ctx: CanvasRenderingContext2D) => {
  const topMargin = holeImageRadiusHalf;

  holes.forEach((pos, i) => {
    ctx.drawImage(
      i === 0 ? backClosedHoleImage : closedHoleImage,
      i === 0 ? lastHoleLeftMargin : holeLeftMargin,
      pos - topMargin,
      holeImageRadius,
      holeImageRadius
    );
  });

  ctx.drawImage(
    blowImage,
    holeLeftMargin,
    blowImageYPos - 20,
    holeImageRadius,
    holeImageRadius
  );
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
  const brickLeftMargin = 55;

  const startPos = start * notesScale - tick * notesScale + brickLeftMargin;

  if (startPos < brickLeftMargin) {
    ctx.fillStyle = mainColors.red;
  } else {
    ctx.fillStyle = mainColors.darkerGray;
  }
  // (ctx as any).roundRect(
  //   startPos,
  //   y.yPosInPx - brickHeightHalf,
  //   dur * notesScale,
  //   brickhHeight,
  //   5
  // );
  ctx.fillRect(
    startPos,
    y.yPosInPx - brickHeightHalf,
    dur * notesScale,
    brickhHeight
  );
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

const drawShadow = (ctx: CanvasRenderingContext2D) => {
  const backgoundImage = new Image();
  backgoundImage.src = "/images/BG.png";
  ctx.drawImage(backgoundImage, -10, -60, widthBackground, heightBackground);
};

const imageScale = 200 / 896;
const backgroundScale = 414 / 896;

const width = coeff(190);
const height = width / imageScale;

const widthBackground = coeff(420);
const heightBackground = widthBackground / backgroundScale;

const image = new Image();
image.src = "/images/main_pipe.png";

export const drawBagpipe = (
  ctx: CanvasRenderingContext2D,
  songNotes?: SharpNotes[]
) => {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 30, height);

  ctx.drawImage(image, -38, -27, width, height);

  if (!songNotes) {
    return;
  }

  drawClosedNotes(ctx);
};

const drawNotesNames = (
  ctx: CanvasRenderingContext2D,
  songNotes?: SharpNotes[]
) => {
  // DRAW NOTES NAMES
  ctx.fillStyle = "#ffffff";

  const pushedHoleIndex = yPoses.length - 2;

  yPoses.forEach((yPos, i) => {
    ctx.font = "bold 13px Arial";
    songNotes?.[i] &&
      ctx.fillText(
        songNotes[i],
        i === pushedHoleIndex ? lastNoteNameLeftMargin : noteNameLeftMargin,
        i === yPoses.length - 1 ? yPos + 30 : yPos + 6
      );
  });
};

const drawLines = (ctx: CanvasRenderingContext2D) => {
  ctx.fillStyle = "#D6D6D6";
  yPoses.forEach((yPos) => {
    ctx.fillRect(0, yPos, window.innerWidth, lineHeight);
  });
};

export const drawAll = (
  ctx: CanvasRenderingContext2D,
  tick: number,
  lowestOctave: number,
  nextNotes?: Note[],
  nextToNextNotes?: Note[],
  activeHole?: { note: SharpNotes; octave: number } | null,
  isClosedManer?: boolean,
  songNotes?: SharpNotes[] | null
) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  drawShadow(ctx!);
  drawLines(ctx);
  drawNotes(ctx, tick, nextNotes, nextToNextNotes);
  drawBagpipe(ctx!, songNotes!);
  drawActiveHoles(ctx!, lowestOctave, activeHole, isClosedManer);
  drawNotesNames(ctx!, songNotes!);
};
