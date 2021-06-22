import React, { useEffect, useState } from 'react';
import { Midi, Track } from '@tonejs/midi';
import { Note } from '@tonejs/midi/dist/Note';
import * as Tone from 'tone';
import { MidiFileInput } from './MidiFileInput';
import { MidiPlayer } from './MidiPlayer';
import styled from 'styled-components';
import { Part } from 'tone';
import { Bagpipe } from '../Bagpipe';
import { playMidi } from '../../utils/midiUtils';
import { Hole } from '../../interfaces';

const holes: Hole[] = [
  { isOpen: true, note: 'G' },
  { isOpen: true, note: 'A' },
  { isOpen: true, note: 'B' },
  { isOpen: true, note: 'C' },
  { isOpen: true, note: 'D' },
  { isOpen: true, note: 'E' },
  { isOpen: true, note: 'F' },
  { isOpen: true, note: 'G' },
];

const synth = new Tone.Synth().toDestination();
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
      <MidiFileInput setMidi={setMidi} />
      <MidiPlayer
        stop={stop}
        playMidi={() => playMidi(midi!, (note, octave) => setActiveNote({ note, octave }))}
      />
      <Bagpipe holes={holes} activeNote={activeNote} />
    </Container>
  );
};

const Container = styled.div``;
