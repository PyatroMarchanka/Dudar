import React, { useContext, useEffect, useRef, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { SharpNotes } from "../../interfaces";
import { PlayerControls } from "../Controls/PlayerControls";
import { useMidiPlayer } from "../../hooks/useMidiPlayer";
import { mainColors } from "../../utils/theme";
import { StaticCanvas } from "../Canvas/StaticCanvas";
import { BackCanvas } from "../Canvas/BackCanvas";
import { DynamicCanvas } from "../Canvas/DynamicCanvas";
import { convertMidiPitchToNote } from "../../utils/midiUtils";
import { MidiPlayerComponent } from "../MidiPlayerComponent";
import { BackdropSpinner } from "../global/BackdropSpinner";
import { DonationButton } from "../global/DonationButton";
import { Route, Switch, useHistory, useRouteMatch } from "react-router-dom";
import { routes } from "../../router/routes";
import { SongPage } from "./SongPage";
import { PlayPageHeader } from "../Dudar/PlayPage";
import { InfoPageHeader } from "../Dudar/InfoPage";
import { store } from "../../context";
import { useDimensions } from "../../hooks/useDimensions";
import { useGoogleProfile } from "../../hooks/useGoogleProfile";
import { NoSong } from "../NoSong";
import { LoginReminderContainer } from "../LoginReminder";
import { getUserOnboardingFinished } from "../../constants/localStorage";
import Logger from "../global/Logger";

export const Dudar = () => {
  let { path } = useRouteMatch();
  const {
    state: { midiData, isSongLoading, bagpipeType, isSongUnavailable },
    setProgress,
  } = useContext(store);
  const [activeNote, setActiveNote] = useState<{
    note: SharpNotes;
    octave: number;
  } | null>(null);
  const handleNote = (event: any) => {
    setActiveNote(convertMidiPitchToNote(event.noteNumber));
  };
  const history = useHistory();
  const isUserOnboardingCompleted = getUserOnboardingFinished();

  const playerRef = useRef(null);
  const { Player: midiPlayer, continueElement } = useMidiPlayer(
    handleNote,
    setProgress,
    playerRef
  );

  useEffect(() => {
    if (midiData) {
      midiPlayer?.setMidiData(midiData);
    }
  }, [midiPlayer, midiData]);

  useDimensions();
  useGoogleProfile();

  useEffect(() => {
    if (!isUserOnboardingCompleted) {
      history.replace(routes.start);
    }
  }, [history]);

  return (
    <Container>
      <GlobalStyle />
      {continueElement}
      <LoginReminderContainer />
      <DonationButton />
      <Logger />
      <BackdropSpinner isOpen={isSongLoading} />
      <Switch>
        <Route exact path={`${path}/${routes.play}/:id`}>
          <PlayPageHeader midiPlayer={midiPlayer} />
          {isSongUnavailable || !bagpipeType ? (
            <NoSong />
          ) : (
            <>
              <BagpipeContainer>
                <BackCanvas />
                <DynamicCanvas player={midiPlayer} />
                <StaticCanvas activeHole={activeNote} />
              </BagpipeContainer>
              <Inputs>
                <PlayerControls player={midiPlayer} />
              </Inputs>
              <MidiPlayerComponent playerRef={playerRef} />
            </>
          )}
        </Route>
      </Switch>
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
  height: 100vh;
  background-color: ${mainColors.lightestGrey};
  overflow-y: hidden;
  .last {
    margin-top: auto;
    margin-bottom: 20px;
  }

  .button {
    z-index: 1000;
  }
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

  &:first-child {
    justify-content: space-around;
  }

  &:last-child {
    justify-content: flex-start;
  }
`;
