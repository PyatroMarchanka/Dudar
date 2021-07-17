import React, { useState } from 'react';
import { PlayStopButton } from '../../global/PlayStopButton';

interface Props {
  playMidi: () => void;
  stop?: () => void;
  disabled: boolean;
}

export const PlayStopMidi = ({ playMidi, stop, disabled }: Props) => {
  const [isPlaying, setIsPlayed] = useState(false);

  const onPlay = () => {
    setIsPlayed(true);
    playMidi();
  };

  const onStop = () => {
    setIsPlayed(false);
    if (stop) {
      stop();
    }
  };

  if (disabled) {
    return null;
  }

  return (
    <div>
      <PlayStopButton isPlaying={isPlaying} handlePlaying={isPlaying ? onStop : onPlay} />
    </div>
  );
};
