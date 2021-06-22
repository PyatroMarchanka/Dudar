import React, { useEffect, useState } from 'react';
import { Midi, Track } from '@tonejs/midi';
import { Note } from '@tonejs/midi/dist/Note';
import * as Tone from 'tone';
import { MidiFileInput } from './MidiFileInput';
import { MidiPlayer } from './MidiPlayer';
import styled from 'styled-components';
import { Part } from 'tone';

const synth = new Tone.Synth().toDestination();
interface Props {}

export const Controls = ({}: Props) => {
  const [midi, setMidi] = useState<Midi | null>(null);
  const [part, setPart] = useState<Part | null>(null);
  useEffect(() => {
    Tone.Transport.start();
  }, []);

  const playMidi = () => {
    Tone.Transport.start();

    const now = Tone.now() + 1;
    let delay = 0;
    midi?.tracks?.[0].notes.forEach((note: Note) => {
      Tone.Transport.schedule((time) => {
        synth.triggerAttackRelease(note.pitch + note.octave, note.duration, time);
      }, now + delay);

      delay += note.duration;
    });
  };

  const pause = () => {
    Tone.Transport.cancel();
  };

  const stop = () => {
    Tone.Transport.stop();
  };

  return (
    <Container>
      <MidiFileInput setMidi={setMidi} />
      <MidiPlayer stop={stop} playMidi={playMidi} />
    </Container>
  );
};

const Container = styled.div``;
