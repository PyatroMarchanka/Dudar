import React, { useContext, useEffect, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { convertMidiPitchToNote, SharpNotes } from "../../interfaces";
import { PlayerControls } from "./PlayerControls";
import { useMidiPlayer } from "../../utils/useMidiPlayer";
import Transpose from "./Transpose";
import SongList from "../SongList";
import { noSongsLabel, store } from "../../context";
import { useLoadSong } from "../../hooks/useLoadSong";
import { TempoSlider } from "./TempoSlider";
import { mediaQueries } from "../../constants/style";
import { formatMidiFileName } from "../../utils/textUtils";
import Canvas from "../Canvas";
import ManerCheckBox from "./ManerCheckBox";

export const Dudar = () => {
  const {
    state: { activeSong },
    setProgress,
    setScreenSize,
    setTranspose: setTransposeCtx,
  } = useContext(store);

  const [activeNote, setActiveNote] = useState<{
    note: SharpNotes;
    octave: number;
  } | null>(null);

  const handleNote = (event: any) => {
    setActiveNote(convertMidiPitchToNote(event.noteNumber));
  };

  const { Player: midiPlayer, MPlayer } = useMidiPlayer(
    handleNote,
    setProgress
  );

  const { lowestOctave } = useLoadSong();

  const setDimensions = () => {
    const height = window.innerHeight;
    const width = window.innerWidth;

    setScreenSize({ width, height });
  };

  useEffect(() => {
    setDimensions();
    window.addEventListener("resize", setDimensions);
    return () => window.removeEventListener("resize", setDimensions);
  }, []);

  const setTranspose = (num: number) => {
    setTransposeCtx(num);
    midiPlayer?.setTranspose(num);
  };

  return (
    <Container>
      <GlobalStyle />
      <Header>
        <h3>{formatMidiFileName(activeSong!) || noSongsLabel}</h3>
        <Row>
          <Inputs>
            <PlayerControls player={midiPlayer} />
          </Inputs>
          <Inputs>
            <Column>
              <Transpose setTranspose={setTranspose} />
              <SongList player={midiPlayer} />
              <TempoSlider player={midiPlayer} />
              <ManerCheckBox />
            </Column>
          </Inputs>
        </Row>
      </Header>
      <BagpipeContainer className={"center"}>
        {/* <MidiFileInput setMidiData={setMidiData} setMidi={setMidi} /> */}
        <Canvas
          player={midiPlayer}
          activeHole={activeNote}
          lowestOctave={lowestOctave}
        />
      </BagpipeContainer>
      <Link className="last">
        <a href="https://github.com/PyatroMarchanka/Dudar">
          <i className="fa fa-github fa_custom"></i>
          <div>GitHub</div>
        </a>
      </Link>
      {MPlayer}
    </Container>
  );
};

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;

  .last {
    margin-top: auto;
  }
`;

const Link = styled.div`
  display: flex;
  justify-content: center;

  > a {
    display: flex;
    justify-content: center;
    width: 100px;
    padding: 5px;
    justify-content: center;
    border: 1px solid black;
    border-radius: 4px;
    background-color: #c9c9c9bf;

    font-family: Arial, Helvetica, sans-serif;
    font-size: 15px;
    color: black;
    text-decoration: none;
    &:hover {
      cursor: pointer;
    }
  }

  i {
    display: flex;
    margin-right: 5px;
  }
`;

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
      height: 60px;
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
    transform: translate(0px, 0);
  }
`;

const Inputs = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;

  &:first-child {
    justify-content: space-around;
  }

  &:last-child {
    justify-content: flex-start;
  }
`;
