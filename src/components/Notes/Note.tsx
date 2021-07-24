import React from "react";
import { useSpring, animated } from "react-spring";
import { Note as NoteType } from "@tonejs/midi/dist/Note";
import styled from "styled-components";

interface Props {
  tick: number;
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
  //   const styles = useSpring({
  //     transform: `translateX(${-Math.floor((note.ticks - tick) / 3)}px)`,
  //   });

  return (
    // <animated.div className={`${className} note`} style={styles}>
    <div className={`${className} note`}>
      <NoteComponent
        width={note.durationTicks}
        note={(note.pitch + note.octave) as any}
        noteTick={note.ticks}
      >
        {note.pitch + note.octave}
      </NoteComponent>
    </div>
    // </animated.div>
  );
};

const NoteComponent = styled.div<{
  width: number;
  note: keyof typeof NotesMap;
  noteTick: number;
}>`
  background-color: #b8720a;
  color: white;
  text-transform: uppercase;
  border-radius: 4px;
  padding: 5px;
  visibility: ${({ width }) => (width > 40 ? "visible" : "hidden")};
  width: ${({ width }) => Math.floor(width / 3)}px;
  transform: translateX(${({ noteTick }) => Math.floor(noteTick / 3)}px);
`;
