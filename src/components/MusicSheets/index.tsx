import React, { useContext, useEffect, useRef, useState } from "react";
import { VexFlow } from "vexflow";
import styled from "styled-components";
import { store } from "../../context";
import { transposeNote } from "../../utils/midiUtils";
import { renderBar, splitNotesIntoBars } from "./utils";
import { MidiPlayer } from "../../utils/MidiPlayer";
import { useNotesMoving } from "../../hooks/useNotesMoving";
import { PlayerControls } from "../Controls/PlayerControls";
import { useTranslation } from "react-i18next";
import { Typography } from "@material-ui/core";

const { Renderer } = VexFlow;

interface MusicSheetProps {
  player: MidiPlayer | null;
}

const MusicSheet: React.FC<MusicSheetProps> = ({ player }) => {
  const {
    state: { transpose, midiData, activeSong },
  } = useContext(store);
  const { t } = useTranslation("translation");
  const { setTick, tick } = useNotesMoving();
  const tonality = transposeNote("A", transpose);
  const containerRef = useRef<HTMLDivElement>(null);
  const [bars, setBars] = useState<any[][]>([[]]);
  const [activeBarNote, setActiveBarNote] = useState([0, 0]);
  const [isMusicViewValid, setIsMusicViewValid] = useState(true);

  useEffect(() => {
    if (player) {
      player.handleNotesMoving = setTick;
    }
  }, [player, setTick]);

  useEffect(() => {
    if (!midiData) return;

    if (containerRef.current) {
      containerRef.current.innerHTML = "";
      const renderer = new Renderer(
        containerRef.current,
        Renderer.Backends.SVG
      );
      const context = renderer.getContext();

      context.clear();
      const bars = splitNotesIntoBars(
        midiData.tracks[0].notes,
        activeSong?.timeSignature!
      );
      setBars(bars);
      renderer.resize(500, bars.length * 80 + 200);

      for (let index = 0; index < bars.length; index++) {
        const bar = bars[index];
        const isOk = renderBar(
          bar,
          index,
          context,
          tonality,
          activeBarNote,
          midiData
        );
        if (!isOk) {
          setIsMusicViewValid(false);
          break;
        }
      }
    }
  }, [midiData, tonality, activeBarNote]);

  useEffect(() => {
    if (!midiData || !bars[0]?.length) return;

    const currentBar = bars.findIndex((bar) => {
      const lastNote = bar.at(-1);
      return lastNote?.ticks + lastNote?.durationTicks > tick;
    });

    let noteIndex = 0;

    for (let i = 0; i < bars[currentBar]?.length; i++) {
      const note = bars[currentBar][i];
      if (note.ticks > tick) {
        noteIndex = i - 1;
        break;
      } else if (i === bars[currentBar].length - 1) {
        noteIndex = i;
        break;
      }
    }

    if (currentBar !== activeBarNote[0] || noteIndex !== activeBarNote[1]) {
      setActiveBarNote([currentBar, noteIndex]);
    }
  }, [tick, midiData, tonality]);

  return (
    <CenteredContainer>
      {isMusicViewValid ? (
        <>
          <CanvasContainer ref={containerRef} />
          <PlayerControlsContainer>
            <PlayerControls player={player} />
          </PlayerControlsContainer>
        </>
      ) : (
        <FallbackContainer>
          <Typography variant="h4">{t("noMusicSheets")}</Typography>
          <Typography variant="h6">{t("noMusicSheetsSubtitle")}</Typography>
        </FallbackContainer>
      )}
    </CenteredContainer>
  );
};

export default MusicSheet;

const CenteredContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const CanvasContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  overflow-y: scroll;
`;

const PlayerControlsContainer = styled.div`
  position: fixed;
  bottom: 0;
  display: flex;
  margin-top: auto;
`;

const FallbackContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  text-align: center;
`;
