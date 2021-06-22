import React from 'react';
import styled from 'styled-components';
import { Hole } from '../../interfaces';

interface HoleProps {
  isOpen: boolean;
  className: string;
}

export const HoleComponent = ({ isOpen, className }: HoleProps) => {
  return <HoleWrapper className={className} isOpen={isOpen} />;
};

interface Props {
  holes: Hole[];
  activeNote: { note: string; octave: number } | null;
}

export const Bagpipe = ({ holes, activeNote }: Props) => {
  return (
    <Container>
      <Holes>
        {holes.map((hole, i) => (
          <HoleComponent className={`hole-${i + 1}`} isOpen={hole.note === activeNote?.note} />
        ))}
      </Holes>
      <BagpipeImage src='images/bagpipe.png' alt='bagpipe' />
    </Container>
  );
};

const Container = styled.div`
  position: relative;
`;

const BagpipeImage = styled.img`
  height: 500px;
  width: auto;
`;

const HoleWrapper = styled.div<{ isOpen: boolean }>`
  width: 20px;
  height: 20px;
  background-color: ${({ isOpen }) => (isOpen ? 'white' : 'black')};
  border-radius: 50%;

  position: absolute;
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
    top: 84px;
    left: 20px;
  }
`;
