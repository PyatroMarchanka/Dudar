import React, { useContext, useEffect } from "react";
import styled from "styled-components";
import { useSpring, animated } from "react-spring";

import { useNotesMoving } from "../../hooks/useNotesMoving";
import { MidiPlayer } from "../../utils/MidiPlayer";
import { multCoefficient, Note } from "./Note";
import { store } from "../../context";
import { theme } from "../../utils/theme";
import { mediaQueries } from "../../constants/style";

interface Props {
  player: MidiPlayer | null;
}

export default ({ player }: Props) => {
  const { nextNotes, nextToNextNotes, setTick, tick } = useNotesMoving();
  const {
    state: { showPianoRoll, isPlaying },
  } = useContext(store);

  const styles = useSpring({
    transform: `translateX(${-Math.floor(tick / multCoefficient)}px)`,
  });

  useEffect(() => {
    if (player && showPianoRoll) {
      player.handleNotesMoving = setTick;
    }
  }, [player, showPianoRoll]);

  return (
    <Container className="notes-bricks" isPlaying={isPlaying}>
      <NotesLines>
        <div className="note A4 line" />
        <div className="note G4 line" />
        <div className="note F4 line" />
        <div className="note E4 line" />
        <div className="note D4 line" />
        <div className="note C4 line" />
        <div className="note B3 line" />
        <div className="note A3 line" />
        <div className="note G3 line" />
      </NotesLines>
      <animated.div style={styles}>
        {nextNotes?.map((note, i) => (
          <Note
            key={`${note.pitch[0] + note.octave}-${i}`}
            note={note}
            // tick={tick}
            className={
              note.pitch[0] + note.octave + (tick > note.ticks ? " active" : "")
            }
          />
        ))}
        {nextToNextNotes?.map((note, i) => (
          <Note
            key={`next-${note.pitch[0] + note.octave}-${i}`}
            note={note}
            // tick={tick}
            className={note.pitch[0] + note.octave}
          />
        ))}
      </animated.div>
    </Container>
  );
};
const NotesLines = styled.div`
  .line {
    position: absolute;
    height: 18px;
    width: 1500px;
    padding: 5px;
    background-color: ${theme.colors.grey[100]};
    @media (max-width: ${mediaQueries.mobile}) {
      width: 500px;
    }
  }
`;

const Container = styled.div<{ isPlaying: boolean }>`
  z-index: -1;
  width: 100%;
  position: relative;
  overflow-x: ${({ isPlaying }) => (isPlaying ? "hidden" : "hidden")};
  .note {
    position: absolute;
  }

  .note.A4 {
    top: 20px;
  }

  .note.G4 {
    top: 58px;
  }

  .note.F4 {
    top: 91px;
  }

  .note.E4 {
    top: 132px;
  }

  .note.D4 {
    top: 177px;
  }

  .note.C4 {
    top: 229px;
  }

  .note.B3 {
    top: 274px;
  }

  .note.A3 {
    top: 326px;
  }

  .note.G3 {
    top: 388px;
  }
`;
