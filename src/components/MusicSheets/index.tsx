import { Midi } from "@tonejs/midi";
import React, { useContext, useEffect, useRef, useState } from "react";
import { VexFlow } from "vexflow";
import styled from "styled-components";
import { store } from "../../context";
import { transposeNote } from "../../utils/midiUtils";
import { renderBar, splitNotesIntoBars } from "./utils";
import { MidiPlayer } from "../../utils/MidiPlayer";
import { useNotesMoving } from "../../hooks/useNotesMoving";
import { PlayerControls } from "../Controls/PlayerControls";

const { Renderer } = VexFlow;

interface MusicSheetProps {
  midiFile: Midi | null;
  player: MidiPlayer | null;
}

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

const MusicSheet: React.FC<MusicSheetProps> = ({ midiFile, player }) => {
  const {
    state: { transpose },
  } = useContext(store);
  const { setTick, tick } = useNotesMoving();
  const tonality = transposeNote("A", transpose);
  const containerRef = useRef<HTMLDivElement>(null);
  const [bars, setBars] = useState<any[][]>([[]]);
  const [activeBarNote, setActiveBarNote] = useState([0, 0]);
  console.log(midiFile);
  useEffect(() => {
    if (player) {
      player.handleNotesMoving = setTick;
    }
  }, [player, setTick]);

  useEffect(() => {
    if (!midiFile) return;

    if (containerRef.current) {
      containerRef.current.innerHTML = "";
      const renderer = new Renderer(
        containerRef.current,
        Renderer.Backends.SVG
      );
      const context = renderer.getContext();

      context.clear();
      const bars = splitNotesIntoBars(midiFile.tracks[0].notes, 2);
      setBars(bars);
      renderer.resize(500, bars.length * 80 + 200);

      bars.forEach((bar, index) => {
        renderBar(bar, index, context, tonality, activeBarNote);
      });
    }
  }, [midiFile, tonality, activeBarNote]);

  useEffect(() => {
    if (!midiFile) return;
    const currentBar = Math.floor(
      (tick % midiFile.durationTicks) / (midiFile?.header.ppq * 4)
    );

    let noteIndex = 0;
    const note = bars[currentBar].find((note, index) => {
      if (note.ticks > tick) {
        noteIndex = index - 1;
        return true;
      } else if (index === bars[currentBar].length - 1) {
        noteIndex = index;
        return true;
      }

      return false;
    });

    setActiveBarNote([currentBar, noteIndex]);
  }, [tick, midiFile, tonality]);

  return (
    <CenteredContainer>
      <CanvasContainer ref={containerRef} />
      <PlayerControlsContainer>
        <PlayerControls player={player} />
      </PlayerControlsContainer>
    </CenteredContainer>
  );
};

export default MusicSheet;
