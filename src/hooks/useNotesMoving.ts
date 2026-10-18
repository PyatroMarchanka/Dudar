import { Note } from '@tonejs/midi/dist/Note';
import { useContext, useEffect, useMemo, useState } from 'react';
import { store } from '../context';

export const useNotesMoving = () => {
  const {
    state: { midiData, isPlaying, progress },
  } = useContext(store);
  const [tick, setTick] = useState(0);

  // Melody notes sorted by start tick. The piano roll picks the visible ones on every frame
  // from the current tick and the canvas width (see drawNotes), so nothing here has to track
  // which part of the song is on screen.
  const notes = useMemo<Note[]>(() => {
    const track = midiData?.tracks.find((track) => track.notes.length);
    return track ? [...track.notes].sort((a, b) => a.ticks - b.ticks) : [];
  }, [midiData]);

  useEffect(() => {
    if (progress === undefined || isPlaying) {
      return;
    }

    setTick(Math.floor((midiData?.durationTicks || 0) * (progress.percent / 100)));
  }, [progress, isPlaying]);

  return {
    tick,
    setTick,
    notes,
  };
};
