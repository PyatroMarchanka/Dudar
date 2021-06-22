import React from 'react';
import { Midi } from '@tonejs/midi';
import { Note } from '@tonejs/midi/dist/Note';
import * as Tone from 'tone';
const synth = new Tone.Synth().toDestination();

export const playMidi = (midi: Midi, cb?: (note: string, octave: number) => void) => {
  Tone.Transport.start();

  const now = Tone.now() + 1;
  let delay = 0;
  midi?.tracks?.[0].notes.forEach((note: Note) => {
    Tone.Transport.schedule((time) => {
      synth.triggerAttackRelease(note.pitch + note.octave, note.duration, time);
      console.log('note.pitch', note.pitch);
      if (cb) cb(note.pitch, note.octave);
    }, now + delay);

    delay += note.duration;
  });
};
