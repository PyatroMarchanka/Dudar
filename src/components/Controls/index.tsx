import React, { useEffect, useState } from 'react';
import { Midi } from '@tonejs/midi';
import * as Tone from 'tone';
import { MidiFileInput } from './MidiFileInput';
import { MidiPlayer } from './MidiPlayer';
import styled from 'styled-components';
import { Bagpipe } from '../Bagpipe';
import { playMidi } from '../../utils/midiUtils';
import { Modes } from '../../interfaces';
import { getBagpipeData } from '../../utils/bagpipesUtils';

// const holes: Hole[] = [
//   { isOpen: true, note: 'G' },
//   { isOpen: true, note: 'A' },
//   { isOpen: true, note: 'B' },
//   { isOpen: true, note: 'C' },
//   { isOpen: true, note: 'D' },
//   { isOpen: true, note: 'E' },
//   { isOpen: true, note: 'F' },
//   { isOpen: true, note: 'G' },
// ];

interface Props {}

export const Controls = ({}: Props) => {
  const [midi, setMidi] = useState<Midi | null>(null);
  const [activeNote, setActiveNote] = useState<{ note: string; octave: number } | null>(null);

  useEffect(() => {
    Tone.Transport.start();
  }, []);

  const stop = () => {
    Tone.Transport.stop();
  };

  return (
    <Container>
      <Inputs>
        <MidiFileInput setMidi={setMidi} />
        {midi && (
          <MidiPlayer
            stop={() => {
              stop();
              setActiveNote(null);
            }}
            playMidi={() => playMidi(midi!, (note, octave) => setActiveNote({ note, octave }))}
          />
        )}
      </Inputs>
      <Bagpipe bagpipe={getBagpipeData(Modes.Mixolidian, 'G')} activeNote={activeNote} />
    </Container>
  );
};

const Container = styled.div``;
const Inputs = styled.div`
  display: flex;
  align-items: center;
`;
