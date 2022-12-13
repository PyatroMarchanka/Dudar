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
    state: { tempo, metronome, isPlaying },
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
    setIsPlaying(false);
  };

  useEffect(() => {
    const player = new MidiPlayer(playerRef, tempo, metronome);
    player.initPlayer(handleNote, handleProgress, switchIsPlaying);
    setMidiPlayer(player);
  }, []);

  return { Player: midiPlayer, MPlayer };
};

const Container = styled.div`
  .MIDISounds {
    display: none;
  }
`;
