import React, { useContext } from "react";
import { IconButton, Slider } from "@material-ui/core";
import styled from "styled-components";
import { store } from "../../../context";
import { MidiPlayer } from "../../../utils/MidiPlayer";
import { PlayStopButton } from "../../global/PlayStopButton";
import PauseIcon from "@material-ui/icons/Pause";
import { Icon } from "../../global/Icon";
import { mainColors, theme } from "../../../utils/theme";
import { createTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import { TempoSlider } from "../TempoSlider";

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
        <TempoSlider player={player} />
        <PlayStop>
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
        </PlayStop>
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

const PlayStop = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Buttons = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${mainColors.lightestGrey};
  margin: 0 auto;

  .MuiSlider-root {
    /* width: 100%; */
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
