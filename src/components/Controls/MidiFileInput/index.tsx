import React, { useEffect, useRef, useState } from 'react';
import { Midi, Track } from '@tonejs/midi';
import { Note } from '@tonejs/midi/dist/Note';
import * as Tone from 'tone';

import styled from 'styled-components';

interface Props {
  setMidi: (midi: Midi) => void;
}

export const MidiFileInput = ({ setMidi }: Props) => {
  const synth = new Tone.Synth().toDestination();

  useEffect(() => {
    let source = document.getElementById('filereader') as HTMLInputElement;

    source!.addEventListener('change', () => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const midi = new Midi(e.target?.result as ArrayBuffer);
        setMidi(midi);
      };

      if (source?.files?.[0]) {
        reader.readAsArrayBuffer(source?.files?.[0] as any);
      }
    });
  }, []);

  return (
    <div>
      <Input type='file' id='filereader' />
    </div>
  );
};

const Input = styled.input`
  color: #6c5f2e;
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid #6c5f2e;
  border-radius: 3px;
`;
