import React, { useContext, useState } from "react";
import { IconButton, Slider, Typography } from "@material-ui/core";
import styled from "styled-components";
import { store } from "../../../context";
import { MidiPlayer } from "../../../utils/MidiPlayer";
import { PlayStopButton } from "../../global/PlayStopButton";
import PauseIcon from "@material-ui/icons/Pause";
import { Icon } from "../../global/Icon";
import { mainColors, theme } from "../../../utils/theme";
import { createTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

interface Props {
  player: MidiPlayer | null;
}

const muiTheme = createTheme({
  overrides: {
    MuiSlider: {
      thumb: {
        color: "#fff",
      },
      track: {
        color: mainColors.greyColor,
      },
      rail: {
        color: "black",
      },
    },
  },
});

export const PlayerControls = ({ player }: Props) => {
  const {
    state: { midi, progress, isPlaying, tempo },
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
      <ThemeProvider theme={muiTheme}>
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
      </ThemeProvider>
      <Buttons>
        <Tempo>
          <Icon
            type="metr_off"
            fill={theme.colors.black}
            Icon={PauseIcon}
            className="play-icon"
          />
          <h3>{tempo / 2} BPM</h3>
        </Tempo>
        <IconButton onClick={onStop} disabled={!isPlaying} className="icon">
          <Icon
            type="stop"
            fill={theme.colors.black}
            Icon={PauseIcon}
            className="play-icon"
          />
        </IconButton>
        <PlayStopButton
          isPlaying={isPlaying}
          handlePlaying={isPlaying ? onPause : onPlay}
        />
      </Buttons>
    </Container>
  );
};
const Tempo = styled.div`
  display: flex;
  align-items: center;

  h3 {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 24px;
    font-weight: 600;
  }
`;

const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  .MuiSlider-root {
    width: 300px;
    height: 3px;
  }

  .MuiSlider-thumb {
    display: none;
  }

  .MuiSlider-rail {
    background-color: ${mainColors.greyColor};
    border-radius: 4px;
    height: 8px;
  }
  .MuiSlider-track {
    background-color: ${mainColors.darkRed};
    height: 8px;
    border-radius: 4px;
  }
`;
