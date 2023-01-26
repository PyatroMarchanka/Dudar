import React, { useContext, useEffect, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { SharpNotes } from "../../interfaces";
import { PlayerControls } from "./PlayerControls";
import { useMidiPlayer } from "../../hooks/useMidiPlayer";
import Transpose from "./Settings";
import SongList from "../SongList";
import { noSongsLabel, store } from "../../context";
import { useLoadSong } from "../../hooks/useLoadSong";
import { mediaQueries, numberQueries } from "../../constants/style";
import Canvas from "../Canvas";
import LandscapeAlert from "../global/LandscapeAlert";
import { landscapeAlertId } from "../../constants/localStorage";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { mainColors } from "../../utils/theme";
import { convertMidiPitchToNote } from "../../utils/midiUtils";

export const Dudar = () => {
  const {
    state: { activeSong, screenSize },
    setProgress,
    setScreenSize,
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

  const setDimensions = () => {
    const height = window.innerHeight;
    const width = window.innerWidth;
    if (width > 600) {
      localStorage.setItem(landscapeAlertId, "closed");
    }

    setScreenSize({ width, height });
  };

  useLocalStorage();

  useEffect(() => {
    setDimensions();
    window.addEventListener("resize", setDimensions);

    return () => window.removeEventListener("resize", setDimensions);
  }, []);

  return (
    <Container>
      <GlobalStyle />
      <SettingsButtons>
        <SongList player={midiPlayer} />
        {/* <Right> */}
        <Header>
          <h3>{activeSong?.name || noSongsLabel}</h3>
        </Header>
        <Transpose midiPlayer={midiPlayer} />
        {/* </Right> */}
      </SettingsButtons>
      <LandscapeAlert isMobile={screenSize.width < numberQueries.mobile} />
      <BagpipeContainer className={"center"}>
        {/* <MidiFileInput setMidiData={setMidiData} setMidi={setMidi} /> */}
        <Canvas player={midiPlayer} activeHole={activeNote} />
      </BagpipeContainer>
      <Inputs>
        <PlayerControls player={midiPlayer} />
      </Inputs>

      {MPlayer}
    </Container>
  );
};

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
  }
`;

const SettingsButtons = styled.div`
  position: absolute;
  display: flex;
  top: 3px;
  justify-content: space-between;
  align-items: center;
  z-index: 12;
  width: 100%;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: ${mainColors.lightestGrey};

  .last {
    margin-top: auto;
    margin-bottom: 20px;
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
  width: 100%;
  display: flex;
  justify-content: center;
  h3 {
    font-family: Arial, Helvetica, sans-serif;
    text-align: center;
    margin: 0;
    max-width: 150px;
  }
  padding: 5px 0;
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
  position: absolute;
  width: 100%;
  /* padding: 0 0; */
  bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;

  /* background-color: ${mainColors.lightestGrey}; */

  &:first-child {
    justify-content: space-around;
  }

  &:last-child {
    justify-content: flex-start;
  }
`;
