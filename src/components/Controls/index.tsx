import React, { useEffect, useState } from 'react';
import * as Tone from 'tone';
import { MidiFileInput } from './MidiFileInput';
import styled from 'styled-components';
import { Bagpipe } from '../Bagpipe';
import { convertMidiPitchToNote, Modes } from '../../interfaces';
import { getBagpipeData } from '../../utils/bagpipesUtils';
import { PlayStopMidi } from './MidiPlayer';
import { useMidiPlayer } from '../../utils/useMidiPlayer';

interface Props {}

export const Controls = ({}: Props) => {
  const [midi, setMidi] = useState<ArrayBuffer | null>(null);
  const [activeNote, setActiveNote] = useState<{ note: string; octave: number } | null>(null);
  console.log('activeNote', activeNote);
  const handleNote = (midiPitch: number) => {
    setActiveNote(convertMidiPitchToNote(midiPitch));
  };

  const { Player: midiPlayer, MPlayer } = useMidiPlayer(handleNote);

  useEffect(() => {
    Tone.start();
  }, []);

  return (
    <Container>
      <Inputs>
        <MidiFileInput setMidi={setMidi} />
        <PlayStopMidi playMidi={() => midiPlayer?.playMidi(midi)} stop={midiPlayer?.stop} />
        {MPlayer}
      </Inputs>
      <Bagpipe bagpipe={getBagpipeData(Modes.Mixolidian, 'A')} activeNote={activeNote} />
    </Container>
  );
};

const Container = styled.div``;
const Inputs = styled.div`
  display: flex;
  align-items: center;
`;
