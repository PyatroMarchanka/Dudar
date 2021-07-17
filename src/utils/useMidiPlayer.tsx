import React, { useEffect, useRef, useState } from 'react';
import { bagpipeInstr, MidiNoteHandler, MidiPlayer } from './MidiPlayer';
// @ts-ignore
import MIDISounds from 'midi-sounds-react';
import styled from 'styled-components';

export const useMidiPlayer = (handleNote: MidiNoteHandler) => {
  const [midiPlayer, setMidiPlayer] = useState<MidiPlayer | null>(null);

  const playerRef = useRef(null);

  const MPlayer = (
    <Container>
      <MIDISounds ref={playerRef} appElementName='root' instruments={bagpipeInstr} />
    </Container>
  );

  useEffect(() => {
    const player = new MidiPlayer(playerRef, 120);
    player.initPlayer(handleNote);
    setMidiPlayer(player);
  }, []);

  return { Player: midiPlayer, MPlayer };
};

const Container = styled.div`
  .MIDISounds {
    display: none;
  }
`;
