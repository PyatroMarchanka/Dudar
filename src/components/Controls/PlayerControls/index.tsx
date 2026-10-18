import React, { useContext, useRef, useState } from "react";
import { CircularProgress, IconButton, Slider } from "@material-ui/core";
import styled from "styled-components";
import { store } from "../../../context";
import { MidiPlayer } from "../../../utils/MidiPlayer";
import { PlayStopButton } from "../../global/PlayStopButton";
import PauseIcon from "@material-ui/icons/Pause";
import { Icon } from "../../global/Icon";
import { mainColors, theme } from "../../../utils/theme";
import { createTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/core";
import { TempoSlider } from "../TempoSlider";
import { secondsToTime } from "../../../utils/textUtils";
import { Preclick } from "../../Preclick";
import { LoopBars } from "./LoopBars";
import { gtmPush } from "../../../utils/gtm";
import { songApi } from "../../../api/songClient";
import { prepareAudioForPlayback } from "../../../utils/audioContext";

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
    state: { midi, progress, isPlaying, songLength, isPreclick, activeSong, metronome },
    setProgress,
    setIsPlaying,
  } = useContext(store);

  // Bumped on every play, stop and pause, so a play that is still waiting
  // for the audio doesn't start after the user has already stopped it.
  const playRequest = useRef(0);
  // True while waiting for the sounds to download before playing.
  const [isLoadingSounds, setIsLoadingSounds] = useState(false);
  // Bumped when the audio count-in starts, so the visual one starts with it.
  const [preclickStart, setPreclickStart] = useState(0);

  const onPlay = async () => {
    const request = ++playRequest.current;
    setIsPlaying(true);
    const play = isPreclick ? player?.playWithPreclick : player?.playMidi;

    if (play && player) {
      // Wake the audio up inside the tap, before the player starts: after the
      // app was in the background the context can be suspended and only a
      // user gesture is allowed to resume it. Then wait for the samples, or
      // the first notes play silently while they are still downloading.
      setIsLoadingSounds(true);
      await prepareAudioForPlayback(player.waitForSounds(isPreclick || metronome));
      if (request !== playRequest.current) {
        return;
      }
      setIsLoadingSounds(false);
      play(midi, progress?.percent || 0, activeSong!.timeSignature);
      if (isPreclick) {
        setPreclickStart((count) => count + 1);
      }
      gtmPush({ song_name: activeSong!.name });
      songApi.updateSongViewsCount(activeSong!);
    }
  };

  const onStop = () => {
    playRequest.current++;
    setIsLoadingSounds(false);
    setIsPlaying(false);
    player?.stop();
    setProgress(100, 0, 0);
  };

  const onPause = () => {
    playRequest.current++;
    setIsLoadingSounds(false);
    setIsPlaying(false);
    player?.stop();
  };

  if (!midi) {
    return null;
  }
  const timeRemainig = progress?.timeRemaining ? progress?.timeRemaining : 0;

  const songTime = songLength ? songLength : undefined;

  return (
    <Container>
      <Row>
        {<Time>{secondsToTime(timeRemainig)}</Time>}
        <ThemeProvider theme={muiTheme}>
          <Slider
            className="volume-slider"
            onChange={(e, value) => {
              if (isPlaying) {
                player?.setProgress(value as number, isPlaying);
              } else {
                setProgress(
                  100 - (value as number),
                  songTime!,
                  (songTime! * (100 - (value as number))) / 100
                );
              }
            }}
            value={progress?.percent || 0}
            defaultValue={progress?.percent || 0}
            aria-labelledby="discrete-slider"
            valueLabelDisplay="auto"
            step={1}
            min={0}
            max={100}
          />
        </ThemeProvider>
        {songTime && <Time>{secondsToTime(songTime)}</Time>}
      </Row>
      <Buttons>
        <TempoSlider player={player} />
        <Preclick startSignal={preclickStart} />
        <PlayStop>
          <IconButton onClick={onStop} className="icon">
            <Icon
              type="stop"
              fill={theme.colors.black}
              Icon={PauseIcon}
              className="play-icon"
            />
          </IconButton>
          <PlayButtonWrap>
            <PlayStopButton
              isPlaying={isPlaying}
              handlePlaying={isPlaying ? onPause : onPlay}
            />
            {isLoadingSounds && <CircularProgress size={44} className="loading-sounds" />}
          </PlayButtonWrap>
          <LoopBars player={player} />
        </PlayStop>
      </Buttons>
    </Container>
  );
};

const Row = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const Time = styled.div`
  margin-left: 10px;
  margin-right: 10px;
  font-size: 10px;
  font-family: Arial, Helvetica, sans-serif;
`;

const PlayStop = styled.div`
  display: flex;
  justify-content: space-between;

  .icon {
    padding: 0;
    margin: 12px;
  }
`;

const PlayButtonWrap = styled.div`
  position: relative;
  display: flex;

  .loading-sounds {
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -22px 0 0 -22px;
    color: ${mainColors.darkRed};
    pointer-events: none;
  }
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

  .loop-icon {
    user-select: none
  }
`;
