import React, { useContext, useState } from "react";
import styled from "styled-components";
import { Bagpipe } from "../Bagpipe";
import { convertMidiPitchToNote, Modes } from "../../interfaces";
import { getBagpipeData } from "../../utils/bagpipesUtils";
import { PlayerControls } from "./PlayerControls";
import { useMidiPlayer } from "../../utils/useMidiPlayer";
import Transpose from "./Transpose";
import SongList from "../SongList";
import { noSongsLabel, store } from "../../context";
import { useLoadSong } from "../../hooks/useLoadSong";
import { TempoSlider } from "./TempoSlider";
import Notes from "../Notes";
import { Button } from "@material-ui/core";
import { mediaQueries } from "../../constants/style";

export const Dudar = () => {
  const {
    state: { activeSong, showPianoRoll },
    setProgress,
    togglePianoRoll,
  } = useContext(store);

  const [activeNote, setActiveNote] = useState<{
    note: string;
    octave: number;
  } | null>(null);

  const handleNote = (event: any) => {
    setActiveNote(convertMidiPitchToNote(event.noteNumber));
  };

  const { Player: midiPlayer, MPlayer } = useMidiPlayer(
    handleNote,
    setProgress
  );

  useLoadSong();

  return (
    <Container>
      <Header>
        <h3>{activeSong?.split(".midi").join("") || noSongsLabel}</h3>
        <Row>
          <Inputs>
            <PlayerControls player={midiPlayer} />
          </Inputs>
          <Inputs>
            <Column>
              <Transpose setTranspose={midiPlayer?.setTranspose} />
              <SongList />
              <TempoSlider player={midiPlayer} />
              <Button
                size="small"
                variant="outlined"
                onClick={() => togglePianoRoll(!showPianoRoll)}
              >
                {showPianoRoll ? "Hide notes" : "Show notes"}
              </Button>
            </Column>
          </Inputs>
        </Row>
      </Header>
      <BagpipeContainer className={showPianoRoll ? "" : "center"}>
        {/* <MidiFileInput setMidiData={setMidiData} setMidi={setMidi} /> */}
        <Bagpipe
          bagpipe={getBagpipeData(Modes.Mixolidian, "A")}
          activeNote={activeNote}
        />
        {showPianoRoll && <Notes player={midiPlayer} />}
      </BagpipeContainer>

      {MPlayer}
    </Container>
  );
};

const Container = styled.div``;

const Header = styled.div`
  h3 {
    text-align: center;
    margin: 0;
  }
  padding: 5px 0;
  border-bottom: 1px solid black;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;

  @media (max-width: ${mediaQueries.mobile}) {
    flex-direction: column;
  }
`;

const Column = styled.div`
  display: flex;
  flex-wrap: wrap;
  > button {
    flex-basis: 50%;
  }
  @media (max-width: ${mediaQueries.mobile}) {
    > button {
      flex-basis: 25%;
    }
    width: 100%;
    display: flex;
    align-items: flex-end;
  }
`;

const BagpipeContainer = styled.div`
  display: flex;
  position: relative;

  &.center {
    justify-content: center;
  }

  .notes-bricks {
    transform: translate(-59px, 0);
  }
`;

const Inputs = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;

  &:last-child {
    justify-content: flex-start;
  }
`;
