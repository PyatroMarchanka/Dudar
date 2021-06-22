import React, { useEffect, useRef } from 'react';
import { Midi } from '@tonejs/midi';

interface Props {}

export const MidiFileInput = ({}: Props) => {
  useEffect(() => {
    let source = document.getElementById('filereader') as HTMLInputElement;

    source!.addEventListener('change', function () {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const midi = new Midi(e.target?.result as ArrayBuffer);
        const name = midi?.name;
        midi?.tracks?.forEach((track: any) => {
          const notes = track.notes;
          notes.forEach((note: any) => {
            console.log('note', note);
          });
        });
      };
      reader.readAsArrayBuffer(source?.files?.[0] as any);
    });
  }, []);

  return (
    <div>
      <input type='file' id='filereader' />
    </div>
  );
};
