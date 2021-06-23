import Button from '@material-ui/core/Button';
import React, { useState } from 'react';
import { PlayStopButton } from '../../global/PlayStopButton';

interface Props {
  playMidi: () => void;
  stop: () => void;
}

export const MidiPlayer = ({ playMidi, stop }: Props) => {
  const [isPlaying, setIsPlayed] = useState(false);

  const onPlay = () => {
    setIsPlayed(true);
    playMidi();
  };

  const onStop = () => {
    setIsPlayed(false);
    stop();
  };
  return (
    <div>
      <PlayStopButton isPlaying={isPlaying} handlePlaying={isPlaying ? onStop : onPlay} />
    </div>
  );
};
