import React from "react";
import styled from "styled-components";
import { SharpNotes } from "../../interfaces";
import { BagpipeNotes } from "../../utils/bagpipesUtils";

interface HoleProps {
  isOpen: boolean;
  className: string;
  note: string;
}

export const HoleComponent = ({ isOpen, className, note }: HoleProps) => {
  return <HoleWrapper className={className} />;
};

interface Props {
  bagpipe: BagpipeNotes;
  activeNote: { note: string; octave: number } | null;
}

export const Bagpipe = ({ bagpipe, activeNote }: Props) => {
  const notes = [bagpipe.entry, ...bagpipe.main].filter(
    Boolean
  ) as SharpNotes[];

  return (
    <Container>
      <Holes>
        {notes.map((note, i) => (
          <HoleComponent
            note={note}
            className={`hole hole-${i + 1} ${
              note === activeNote?.note ? "active" : ""
            }`}
            isOpen={note === activeNote?.note}
          />
        ))}
      </Holes>
      <BagpipeImage src="images/bagpipe.png" alt="bagpipe" />
    </Container>
  );
};

const Container = styled.div`
  margin-top: 10px;
  position: relative;
  width: 30px;
  transform: translateX(-40px);
`;

const BagpipeImage = styled.img`
  height: 500px;
  width: auto;
`;

const HoleWrapper = styled.div`
  width: 20px;
  height: 20px;
  background-color: black;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Arial, Helvetica, sans-serif;

  position: absolute;

  &.active {
    background-color: white;
  }
`;

const Holes = styled.div`
  .hole-7 {
    top: 84px;
    left: 58px;
  }

  .hole-6 {
    top: 126px;
    left: 58px;
  }

  .hole-5 {
    top: 171px;
    left: 58px;
  }

  .hole-4 {
    top: 222px;
    left: 58px;
  }

  .hole-3 {
    top: 267px;
    left: 58px;
  }

  .hole-2 {
    top: 322px;
    left: 58px;
  }

  .hole-1 {
    top: 382px;
    left: 58px;
  }

  .hole-8 {
    top: 55px;
    left: 90px;
  }
`;
