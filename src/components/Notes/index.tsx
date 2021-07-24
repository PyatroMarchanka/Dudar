import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSpring, animated } from "react-spring";

import { useNotesMoving } from "../../hooks/useNotesMoving";
import { MidiPlayer } from "../../utils/MidiPlayer";
import { Note } from "./Note";

interface Props {
  player: MidiPlayer | null;
  activeEvent: any;
}

export default ({ player, activeEvent }: Props) => {
  const [index, setIndex] = useState(0);
  const { nextNotes, setTick, tick } = useNotesMoving(index);

  const styles = useSpring({
    transform: `translateX(${-Math.floor(tick / 3)}px)`,
  });

  useEffect(() => {
    if (player) {
      player.handleNotesMoving = setTick;
    }
  }, [player]);

  useEffect(() => {
    setIndex(index + 1);
  }, [activeEvent]);

  return (
    <Container className="notes-bricks">
      <animated.div style={styles}>
        {nextNotes?.map((note, i) => (
          <Note
            key={`${note.pitch[0] + note.octave}-${i}`}
            note={note}
            tick={tick}
            className={note.pitch[0] + note.octave}
          />
        ))}
      </animated.div>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  position: relative;
  overflow-x: auto;
  .note {
    position: absolute;
  }

  .note.A4 {
    top: 20px;
  }

  .note.G4 {
    top: 64px;
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
