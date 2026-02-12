import {
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  Slide,
  IconButton,
} from "@material-ui/core";
import { TransitionProps } from "@material-ui/core/transitions";
import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { store } from "../../context";
import { MidiPlayer } from "../../utils/MidiPlayer";
import { theme, mainColors } from "../../utils/theme";
import { Icon } from "../global/Icon";
import { useUpdateUserSettings } from "../../hooks/useGoogleProfile";

interface Props {
  player: MidiPlayer | null;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const TempoSlider = ({ player }: Props) => {
  const { t } = useTranslation("translation");
  const {
    state: { tempo, metronome },
    setTempo,
    setMetronome,
  } = useContext(store);
  const { updateUserSettings } = useUpdateUserSettings();
  const [tapTimes, setTapTimes] = useState<number[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTempoChange = (newTempo: number) => {
    const boundedTempo = Math.min(360, Math.max(60, newTempo));
    setTempo(boundedTempo);
    player?.checkTempo(boundedTempo);
    updateUserSettings({ tempo: boundedTempo });
  };

  const handleTapTempo = () => {
    const now = Date.now();
    const newTapTimes = [...tapTimes, now].filter((time) => now - time < 3000);
    setTapTimes(newTapTimes);

    if (newTapTimes.length > 1) {
      const intervals = newTapTimes
        .slice(1)
        .map((time, i) => time - newTapTimes[i]);
      const averageInterval =
        intervals.reduce((a, b) => a + b) / intervals.length;
      const newTempo = Math.round(60000 / averageInterval) * 2;
      handleTempoChange(newTempo);
    }
  };

  const handleTempoMultiply = (multiplier: number) => {
    const newTempo = Math.min(600, Math.max(60, tempo * multiplier));
    handleTempoChange(newTempo);
  };

  const toggleMetronome = () => {
    setMetronome(!metronome);
    player?.setMetronome(!metronome);
  };

  const MetronomeButton = () => (
    <IconButton onClick={toggleMetronome}>
      <Icon
        type={metronome ? "metr-on" : "metr-off"}
        fill={theme.colors.black}
        className="play-icon"
      />
    </IconButton>
  );

  const TempoSettings = () => (
    <Container>
      <HeaderContainer>
        <Typography variant="h6">Tempo Settings</Typography>
        <MetronomeButton />
      </HeaderContainer>
      <StyledCard>
        <CardContent>
          <TempoControls>
            <Typography className="tempo-text" variant="h6">
              {tempo / 2} bpm
            </Typography>
          </TempoControls>

          <TempoControls>
            <Button
              className="tempo-button"
              variant="outlined"
              onClick={() => handleTempoChange(tempo - 10)}
            >
              -5
            </Button>
            <Button
              className="tempo-button"
              variant="outlined"
              onClick={() => handleTempoMultiply(0.5)}
            >
              ½
            </Button>
            <Button
              className="tempo-button"
              variant="outlined"
              onClick={() => handleTempoMultiply(2)}
            >
              ×2
            </Button>
            <Button
              className="tempo-button"
              variant="outlined"
              onClick={() => handleTempoChange(tempo + 10)}
            >
              +5
            </Button>
          </TempoControls>

          <TapTempoButton
            className="tap-tempo-button"
            variant="outlined"
            fullWidth
            onClick={handleTapTempo}
          >
            Tap Tempo
          </TapTempoButton>
        </CardContent>
      </StyledCard>
    </Container>
  );

  return (
    <>
      <CompactView>
        <MetronomeButton />
        <div onClick={() => setIsModalOpen(true)}>
          <Typography variant="h6">{tempo / 2} bpm</Typography>
        </div>
      </CompactView>

      <Dialog
        maxWidth="xl"
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        TransitionComponent={Transition}
        PaperProps={{
          style: {
            position: "fixed",
            bottom: 0,
            margin: 0,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            maxWidth: "100%",
            backgroundColor: mainColors.lightestGrey,
          },
        }}
      >
        <TempoSettings />
      </Dialog>
    </>
  );
};

const Container = styled.div`
  padding: 1rem;
  background-color: ${mainColors.lightestGrey};

  .tap-tempo-button {
    background-color: ${mainColors.lightestGrey};
    color: ${mainColors.darkerGray};
    border-color: ${mainColors.lightGrey};
  }

  .tempo-text {
    color: ${mainColors.darkerGray};
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  h6 {
    color: ${mainColors.darkerGray};
  }
`;

const CompactView = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  padding: 0 16px;

  > div {
    cursor: pointer;
    padding: 4px 4px;

    &:hover {
      background-color: rgba(0, 0, 0, 0.04);
      border-radius: 4px;
    }
  }

  h6 {
    color: ${mainColors.darkerGray};
  }
`;

const TempoControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;

  button {
    min-width: 48px;
    color: ${mainColors.darkerGray};
    border-color: ${mainColors.lightGrey};
    font-weight: 600;
    background-color: ${mainColors.lightestGrey};

    &:hover {
      background-color: ${mainColors.lightGrey};
    }
  }

  h6 {
    min-width: 100px;
    text-align: center;
    color: ${mainColors.midGrey};
  }
`;

const TapTempoButton = styled(Button)`
  margin: 1rem 0;
  height: 48px;
  background-color: ${mainColors.darkRed};
  color: ${mainColors.darkerGray};
  border-color: ${mainColors.lightGrey};

  &:hover {
    background-color: ${mainColors.lightGrey};
  }
`;

const StyledCard = styled(Card)`
  background-color: ${mainColors.lightestGrey};
  box-shadow: none;
  border: 1px solid ${mainColors.lightGrey};
`;
