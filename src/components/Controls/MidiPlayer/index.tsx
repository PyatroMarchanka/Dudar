import React from 'react';
import styled from 'styled-components';

interface Props {
  playMidi: () => void;
  stop: () => void;
}

export const MidiPlayer = ({ playMidi, stop }: Props) => {
  return (
    <div>
      <PlayButton onClick={playMidi}>Play</PlayButton>
      <PlayButton onClick={stop}>Stop</PlayButton>
    </div>
  );
};

const PlayButton = styled.button``;
