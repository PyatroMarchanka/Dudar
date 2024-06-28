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
import { getUserOnboardingFinished } from "../../constants/localStorage";
import { routes } from "../../router/routes";
import { SongPage } from "./SongPage";
import { userApi } from "../../api/user";
import { PlayPageHeader } from "../Dudar/PlayPage";
import { InfoPageHeader } from "../Dudar/InfoPage";
import { store } from "../../context";
import { useDimensions } from "../../hooks/useDimensions";

export const Dudar = () => {
  const history = useHistory();
  let { path } = useRouteMatch();
  const {
    state: { midiData, isSongLoading },
    setProgress,
  } = useContext(store);
  const [activeNote, setActiveNote] = useState<{
    note: SharpNotes;
    octave: number;
  } | null>(null);
  const isUserOnboardingCompleted = getUserOnboardingFinished();

  const handleNote = (event: any) => {
    setActiveNote(convertMidiPitchToNote(event.noteNumber));
  };

  const playerRef = useRef(null);
  const { Player: midiPlayer } = useMidiPlayer(
    handleNote,
    setProgress,
    playerRef
  );

  useEffect(() => {
    if (midiData) {
      midiPlayer?.setMidiData(midiData);
    }
  }, [midiPlayer, midiData]);

  useEffect(() => {
    userApi.getUserData();
  }, []);

  useDimensions();

  useEffect(() => {
    if (!isUserOnboardingCompleted) {
      history.replace(routes.start);
    }
  }, [history]);

  return (
    <Container>
      <GlobalStyle />
      <DonationButton />
      <BackdropSpinner isOpen={isSongLoading} />
      <Switch>
        <Route exact path={`${path}/${routes.play}/:id`}>
          <PlayPageHeader midiPlayer={midiPlayer} />
          <BagpipeContainer>
            <BackCanvas />
            <DynamicCanvas player={midiPlayer} />
            <StaticCanvas activeHole={activeNote} />
          </BagpipeContainer>
          <Inputs>
            <PlayerControls player={midiPlayer} />
          </Inputs>
          <MidiPlayerComponent playerRef={playerRef} />
        </Route>
        <Route exact path={`${path}/${routes.info}/:id`}>
          <InfoPageHeader midiPlayer={midiPlayer} />
          <SongPage />
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
