import React, { useContext, useEffect, useRef, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { SharpNotes } from "../../interfaces";
import { PlayerControls } from "../Controls/PlayerControls";
import { useMidiPlayer } from "../../hooks/useMidiPlayer";
import { Settings } from "../Controls/Settings";
import { SongList } from "../SongList";
import { noSongsLabel, store } from "../../context";
import { useLoadSong } from "../../hooks/useLoadSong";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { mainColors } from "../../utils/theme";
import { StaticCanvas } from "../Canvas/StaticCanvas";
import { BackCanvas } from "../Canvas/BackCanvas";
import { DynamicCanvas } from "../Canvas/DynamicCanvas";
import {
  convertMidiPitchToNote,
  getSongListWithBagpipeTypes,
} from "../../utils/midiUtils";
import { MidiPlayerComponent } from "../MidiPlayerComponent";
import { useSongTitle } from "../../hooks/useSongTitle";
import { BackdropSpinner } from "../global/BackdropSpinner";
import { DonationButton } from "../global/DonationButton";
import { useHistory } from "react-router-dom";
import { getUserOnboardingFinished } from "../../constants/localStorage";
import ChangeLogPopup from "../ChangeLogPopup";
import { Logo } from "../global/Logo";
import { routes } from "../../router/routes";

export const Dudar = () => {
  const history = useHistory();
  const {
    state: { midiData, isSongLoading },
    setProgress,
    setScreenSize,
  } = useContext(store);
  const [activeNote, setActiveNote] = useState<{
    note: SharpNotes;
    octave: number;
  } | null>(null);

  const isUserOnboardingCompleted = getUserOnboardingFinished();

  const songTitle = useSongTitle();
  const handleNote = (event: any) => {
    setActiveNote(convertMidiPitchToNote(event.noteNumber));
  };
  const playerRef = useRef(null);
  const { Player: midiPlayer } = useMidiPlayer(
    handleNote,
    setProgress,
    playerRef
  );

  const setDimensions = () => {
    const height = window.innerHeight;
    const width = window.innerWidth;

    setScreenSize({ width, height });
  };

  useEffect(() => {
    if (midiData) {
      midiPlayer?.setMidiData(midiData);
    }
  }, [midiPlayer, midiData]);

  useLocalStorage();
  useLoadSong();

  useEffect(() => {
    if (!isUserOnboardingCompleted) {
      history.replace(routes.start);
    }

    setDimensions();
    window.addEventListener("resize", setDimensions);

    return () => window.removeEventListener("resize", setDimensions);
  }, [history]);

  return (
    <Container>
      <GlobalStyle />
      <DonationButton />
      <BackdropSpinner isOpen={isSongLoading} />
      <SettingsButtons>
        <SongList player={midiPlayer} />
        <Header>
          <SongTitle>{songTitle || noSongsLabel}</SongTitle>
        </Header>
        <ChangeLogPopup />
        <LogoContainer>
          <Logo variant="small" width={26} height={40} />
        </LogoContainer>
        <Settings midiPlayer={midiPlayer} />
      </SettingsButtons>
      <BagpipeContainer>
        <BackCanvas />
        <DynamicCanvas player={midiPlayer} />
        <StaticCanvas activeHole={activeNote} />
      </BagpipeContainer>
      <Inputs>
        <PlayerControls player={midiPlayer} />
      </Inputs>
      <MidiPlayerComponent playerRef={playerRef} />
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
  overflow-y: hidden;
  .last {
    margin-top: auto;
    margin-bottom: 20px;
  }
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 5px 0;
`;

const SongTitle = styled.h1`
  font-size: 16px;
  font-family: Arial, Helvetica, sans-serif;
  text-align: center;
  margin: 0;
  max-width: 150px;
`;

const BagpipeContainer = styled.div`
  display: flex;

  > div {
    position: relative;
  }
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

const LogoContainer = styled.div`
  margin-left: 10px;
`;
