import React, { useContext, useState } from "react";
import styled from "styled-components";
import { Bagpipe } from "../Bagpipe";
import { convertMidiPitchToNote, Modes } from "../../interfaces";
import { getBagpipeData } from "../../utils/bagpipesUtils";
import { PlayStopMidi } from "./MidiPlayer";
import { useMidiPlayer } from "../../utils/useMidiPlayer";
import Transpose from "./Transpose";
import SongList from "../SongList";
import { store } from "../../context";
import { useLoadSong } from "../../hooks/useLoadSong";
import { useSongList } from "../../hooks/useSongLIst";

interface Props {}

export const Controls = ({}: Props) => {
  const {
    state: { midi, midiData, activeSong },
    setActiveSong,
  } = useContext(store);

  const [activeNote, setActiveNote] = useState<{
    note: string;
    octave: number;
  } | null>(null);

  const handleNote = (midiPitch: number) => {
    setActiveNote(convertMidiPitchToNote(midiPitch));
  };

  const { Player: midiPlayer, MPlayer } = useMidiPlayer(handleNote);

  const { songList } = useSongList();
  useLoadSong();

  return (
    <div>
      <h3>{activeSong?.split(".midi").join("")}</h3>
      <Container>
        <Inputs>
          {/* <MidiFileInput setMidiData={setMidiData} setMidi={setMidi} /> */}
          <PlayStopMidi
            disabled={!midi}
            playMidi={() => midiPlayer?.playMidi(midi, midiData)}
            stop={midiPlayer?.stop}
          />
          <Bagpipe
            bagpipe={getBagpipeData(Modes.Mixolidian, "A")}
            activeNote={activeNote}
          />
          <Transpose setTranspose={midiPlayer?.setTranspose} />
          {MPlayer}
        </Inputs>
        <SongList list={songList} setActiveSong={setActiveSong} />
      </Container>
    </div>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: space-between;
`;
const Inputs = styled.div`
  /* display: flex; */
`;
