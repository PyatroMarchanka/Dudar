import React, { useContext, useEffect, useRef, useState } from "react";
import {
  bagpipeInstr,
  MidiNoteHandler,
  MidiPlayer,
  PlaybackProgressHandler,
} from "./MidiPlayer";
// @ts-ignore
import MIDISounds from "midi-sounds-react";
import styled from "styled-components";
import { store } from "../context";

export const useMidiPlayer = (
  handleNote: MidiNoteHandler,
  handleProgress: PlaybackProgressHandler
) => {
  const {
    state: { tempo, metronome , isPlaying},
    setIsPlaying,
  } = useContext(store);
  const [midiPlayer, setMidiPlayer] = useState<MidiPlayer | null>(null);

  const playerRef = useRef(null);

  const MPlayer = (
    <Container>
      <MIDISounds
        ref={playerRef}
        appElementName="root"
        instruments={bagpipeInstr}
      />
    </Container>
  );

  const switchIsPlaying = () => {
    console.log("switchIsPlaying", isPlaying);
    setIsPlaying(false);
  };

  useEffect(() => {
<<<<<<< HEAD
    const player = new MidiPlayer(playerRef, tempo, metronome);
    player.initPlayer(handleNote, handleProgress);
=======
    const player = new MidiPlayer(playerRef, tempo);
    player.initPlayer(handleNote, handleProgress, switchIsPlaying);
>>>>>>> 84609bf39ab5a545eea4967fc552740c7188f70e
    setMidiPlayer(player);
  }, []);

  return { Player: midiPlayer, MPlayer };
};

const Container = styled.div`
  .MIDISounds {
    display: none;
  }
`;
