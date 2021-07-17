import React, { useState } from 'react';
import { PlayStopButton } from '../../global/PlayStopButton';

interface Props {
  playMidi: () => void;
  stop?: () => void;
}

export const PlayStopMidi = ({ playMidi, stop }: Props) => {
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
  return (
    <div>
      <PlayStopButton isPlaying={isPlaying} handlePlaying={isPlaying ? onStop : onPlay} />
    </div>
  );
};
