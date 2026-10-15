import { bagpipes } from "./../../dataset/bagpipes";
import { BagpipeTypes, SharpNotes } from "../../interfaces";

export type NotesMap = { note: string; yPos: number }[];

export const drawBagpipe = (
  ctx: CanvasRenderingContext2D,
  bagpipeType: BagpipeTypes,
  activeNote?: { note: SharpNotes; octave: number } | null
) => {
  const { images, imagesProperties, overblownNotes } = bagpipes[bagpipeType];
  const isOverblown = !!activeNote && !!overblownNotes?.includes(activeNote.note + activeNote.octave);
  const bagpipeImage = (isOverblown && images.mainPipeOverblown) || images.mainPipe;
  ctx.fillStyle = "#FCF7F2";
  ctx.fillRect(0, 0, 50, 800);
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
  notesNameToLine: NotesMap
) => {
  const { noteNameColor, notesNamesLeftMargin } = bagpipes[bagpipeType].imagesProperties.notes;

  ctx.fillStyle = noteNameColor;

  notesNameToLine?.forEach((noteData, i) => {
    ctx.font = "bold 15px Arial";

    ctx.fillText(noteData.note, notesNamesLeftMargin, noteData.yPos);
  });
};

export const drawShadow = (ctx: CanvasRenderingContext2D, bagpipeType: BagpipeTypes) => {
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
