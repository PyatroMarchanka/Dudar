import React, { useContext, useState } from "react";
import { IconButton, Slider } from "@material-ui/core";
import styled from "styled-components";
import { store } from "../../../context";
import { MidiPlayer } from "../../../utils/MidiPlayer";
import { PlayStopButton } from "../../global/PlayStopButton";
import PauseIcon from "@material-ui/icons/Pause";
import { Icon } from "../../global/Icon";
import { theme } from "../../../utils/theme";

interface Props {
  player: MidiPlayer | null;
}

export const PlayerControls = ({ player }: Props) => {
  const {
    state: { midi, progress, isPlaying },
    setProgress,
    setIsPlaying,
  } = useContext(store);

  const onPlay = () => {
    setIsPlaying(true);
    player?.playMidi(midi, progress || 0);
  };

  const onStop = () => {
    setIsPlaying(false);
    player?.stop();
    setProgress(100);
  };

  const onPause = () => {
    setIsPlaying(false);
    player?.stop();
  };

  if (!midi) {
    return null;
  }

  return (
    <Container>
      <IconButton onClick={onPause} disabled={!isPlaying} className="icon">
        <Icon
          type="material"
          fill={theme.colors.black}
          Icon={PauseIcon}
          className="play-icon"
        />
      </IconButton>
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
