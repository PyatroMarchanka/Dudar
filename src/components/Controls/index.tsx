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

export const Dudar = () => {
  const {
    state: { activeSong },
    setProgress,
  } = useContext(store);

  const [activeNote, setActiveNote] = useState<{
    note: string;
    octave: number;
  } | null>(null);

  const handleNote = (midiPitch: number) => {
    setActiveNote(convertMidiPitchToNote(midiPitch));
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
        <Inputs>
          <PlayerControls player={midiPlayer} />
        </Inputs>
        <Inputs>
          <Transpose setTranspose={midiPlayer?.setTranspose} />
          <Column>
            <SongList />
            <TempoSlider player={midiPlayer} />
          </Column>
        </Inputs>
      </Header>
      <BagpipeContainer>
        {/* <MidiFileInput setMidiData={setMidiData} setMidi={setMidi} /> */}
        <Bagpipe
          bagpipe={getBagpipeData(Modes.Mixolidian, "A")}
          activeNote={activeNote}
        />
      </BagpipeContainer>
      <Notes player={midiPlayer} />
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

const Column = styled.div``;

const BagpipeContainer = styled.div`
  display: flex;
  justify-content: center;
`;
const Inputs = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;
