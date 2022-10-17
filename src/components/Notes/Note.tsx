import React from "react";
import { Note as NoteType } from "@tonejs/midi/dist/Note";
import styled from "styled-components";

interface Props {
  //   tick: number;
  note: NoteType;
  className: string;
}

enum NotesMap {
  A4 = 0,
  G4 = 1,
  "F#4" = 2,
  E4 = 3,
  D4 = 4,
  "C#4" = 5,
  B3 = 6,
  A3 = 6,
  G3 = 6,
}

export const Note = ({ note, className }: Props) => {
  return (
    <Container className={`${className} note`}>
      <NoteComponent
        width={note.durationTicks}
        note={(note.pitch + note.octave) as any}
        noteTick={note.ticks}
      />
    </Container>
  );
};

export const multCoefficient = 4;
const minWidth = 40;

const NoteComponent = styled.div<{
  width: number;
  note: keyof typeof NotesMap;
  noteTick: number;
}>`
  height: 18px;

  background-color: #b8720a;
  color: yellow;
  text-transform: lowercase;
  border-radius: 4px;
  border: 2px solid white;
  padding: 5px;
  visibility: ${({ width }) => (width > minWidth ? "visible" : "hidden")};
  width: ${({ width }) => Math.floor(width / multCoefficient)}px;
  transform: translateX(
    ${({ noteTick }) => Math.floor(noteTick / multCoefficient)}px
  );
`;

const Container = styled.div`
  &.active {
    ${NoteComponent} {
      background-color: #52514f;
    }
  }
`;
