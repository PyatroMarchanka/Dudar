import { bagpipes } from "./../../dataset/bagpipes";
import { BagpipeTypes, SharpNotesEnum } from "../../interfaces";

export type NotesMap = { [key: string]: number };

export type SongNotesData = {
  songNotes: SharpNotesEnum[] | null;
  notesNameToLine: NotesMap;
};

export const drawBagpipe = (
  ctx: CanvasRenderingContext2D,
  bagpipeType: BagpipeTypes
) => {
  const bagpipeImage = bagpipes[bagpipeType].images.mainPipe;
  const imagesProperties = bagpipes[bagpipeType].imagesProperties;

  bagpipeImage &&
    ctx.drawImage(
      bagpipeImage,
      imagesProperties.main_pipe.leftMargin,
      imagesProperties.main_pipe.topMargin,
      imagesProperties.main_pipe.width,
      imagesProperties.main_pipe.heigth
    );
};

export const drawNotesNames = (
  ctx: CanvasRenderingContext2D,
  bagpipeType: BagpipeTypes,
  songNotesData: SongNotesData
) => {
  const { songNotes, notesNameToLine } = songNotesData;
  const linesYpositions = bagpipes[bagpipeType].holesPositions.linesYPositions;

  const { noteNameColor, notesNamesLeftMargin } =
    bagpipes[bagpipeType].imagesProperties.notes;

  ctx.fillStyle = noteNameColor;

  songNotes?.forEach((note, i) => {
    ctx.font = "bold 15px Arial";
    songNotes?.[i] &&
      ctx.fillText(
        note,
        notesNamesLeftMargin,
        linesYpositions[notesNameToLine[note]]
      );
  });
};

export const drawShadow = (
  ctx: CanvasRenderingContext2D,
  bagpipeType: BagpipeTypes
) => {
  const bgImage = bagpipes[bagpipeType].images.bgImage;
  const imagesProperties = bagpipes[bagpipeType].imagesProperties;

  bgImage &&
    imagesProperties.bg &&
    ctx.drawImage(
      bgImage,
      imagesProperties.bg.leftMargin,
      imagesProperties.bg.topMargin,
      imagesProperties.bg.width,
      imagesProperties.bg.heigth
    );
};
