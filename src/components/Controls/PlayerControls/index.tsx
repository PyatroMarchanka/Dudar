import React, { useContext, useState } from "react";
import { Slider } from "@material-ui/core";
import styled from "styled-components";
import { store } from "../../../context";
import { MidiPlayer } from "../../../utils/MidiPlayer";
import { PlayStopButton } from "../../global/PlayStopButton";

interface Props {
  player: MidiPlayer | null;
}

export const PlayerControls = ({ player }: Props) => {
  const {
    state: { midiData, midi, progress, isPlaying },
    setProgress,
    setIsPlaying,
  } = useContext(store);

  const onPlay = () => {
    setIsPlaying(true);
    player?.playMidi(midi, midiData);
  };

  const onStop = () => {
    setIsPlaying(false);
    player?.stop();
  };

  if (!midi) {
    return null;
  }

  return (
    <Container>
      <PlayStopButton
        isPlaying={isPlaying}
        handlePlaying={isPlaying ? onStop : onPlay}
      />
      <Slider
        disabled={!isPlaying}
        className="volume-slider"
        onChange={(e, value) => {
          setProgress(value as number);
          player?.setProgress(value as number);
        }}
        value={progress}
        defaultValue={progress || 0}
        aria-labelledby="discrete-slider"
        valueLabelDisplay="auto"
        step={10}
        min={0}
        max={100}
      />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  width: 100%;

  .MuiSlider-root {
    width: 300px;
  }
  .MuiSlider-rail {
    background-color: #c9b6b6;
  }
  .MuiSlider-track {
    background-color: #c9b6b6;
  }
`;
