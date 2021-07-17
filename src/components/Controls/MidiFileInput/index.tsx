import React, { useEffect } from 'react';
import { Midi } from '@tonejs/midi';

import styled from 'styled-components';

interface Props {
  setMidi: (midi: ArrayBuffer) => void;
}

export const MidiFileInput = ({ setMidi }: Props) => {
  useEffect(() => {
    let source = document.getElementById('filereader') as HTMLInputElement;

    const onChange = () => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        // const midi = new Midi(e.target?.result as ArrayBuffer);

        setMidi(e.target?.result as ArrayBuffer);
      };

      if (source?.files?.[0]) {
        reader.readAsArrayBuffer(source?.files?.[0] as any);
      }
    };
    source!.addEventListener('change', onChange);

    return () => {
      source!.removeEventListener('change', onChange);
    };
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
