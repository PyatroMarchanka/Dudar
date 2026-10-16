import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { store } from '../../context';
import { transposeNote } from '../../utils/midiUtils';
import { buildSheet, Sheet, TICKS_PER_QUARTER } from './notation';
import { findNoteAt, getKeyInfo, renderSheet, RenderedSheet } from './utils';
import { MidiPlayer } from '../../utils/MidiPlayer';
import { useNotesMoving } from '../../hooks/useNotesMoving';
import { PlayerControls } from '../Controls/PlayerControls';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import { mainColors } from '../../utils/theme';

const MAX_SHEET_WIDTH = 1000;
const ACTIVE_CLASS = 'sheet-note-active';

interface MusicSheetProps {
  player: MidiPlayer | null;
}

const MusicSheet: React.FC<MusicSheetProps> = ({ player }) => {
  const {
    state: { transpose, midiData, activeSong, isPlaying, screenSize },
  } = useContext(store);
  const { t } = useTranslation('translation');
  const { setTick, tick } = useNotesMoving();
  const tonality = transposeNote('A', transpose);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const renderedRef = useRef<RenderedSheet | null>(null);
  const activeRef = useRef<{ index: number; line: number }>({ index: -1, line: -1 });
  const [isMusicViewValid, setIsMusicViewValid] = useState(true);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (player) {
      player.handleNotesMoving = setTick;
    }
  }, [player, setTick]);

  const sheet = useMemo<Sheet | null>(() => {
    if (!midiData || !activeSong) return null;
    // The metronome is appended as the last track; the melody is the first track with notes.
    const melody = midiData.tracks.find((track) => track.notes.length);
    if (!melody) return null;
    try {
      // Show the pitches that are actually played, so they match the transposed key signature.
      const notes = melody.notes.map((note) => ({
        midi: note.midi + transpose,
        ticks: note.ticks,
        durationTicks: note.durationTicks,
      }));
      return buildSheet(notes, midiData.header.ppq, activeSong.timeSignature);
    } catch (error) {
      console.error('Failed to build music sheet', error);
      return null;
    }
  }, [midiData, activeSong, transpose]);

  useEffect(() => {
    const element = scrollRef.current;
    if (element) setWidth(Math.min(element.clientWidth, MAX_SHEET_WIDTH));
  }, [screenSize]);

  useEffect(() => {
    if (!sheetRef.current || !width) return;
    renderedRef.current = null;
    activeRef.current = { index: -1, line: -1 };
    if (!sheet) {
      setIsMusicViewValid(!midiData);
      return;
    }
    try {
      renderedRef.current = renderSheet(sheetRef.current, sheet, getKeyInfo(tonality), width);
      setIsMusicViewValid(true);
    } catch (error) {
      console.error('Failed to render music sheet', error);
      setIsMusicViewValid(false);
    }
  }, [sheet, tonality, width, midiData]);

  // Highlight the sounding note without re-rendering the score.
  useEffect(() => {
    const rendered = renderedRef.current;
    if (!rendered || !midiData) return;
    const normalisedTick = (tick * TICKS_PER_QUARTER) / (midiData.header.ppq || TICKS_PER_QUARTER);
    const index = findNoteAt(rendered.notes, normalisedTick);
    const previous = activeRef.current;
    if (index === previous.index) return;

    rendered.notes[previous.index]?.element?.classList.remove(ACTIVE_CLASS);
    const note = rendered.notes[index];
    note?.element?.classList.add(ACTIVE_CLASS);
    activeRef.current = { index, line: note ? note.line : previous.line };

    // Keep the playing line in view.
    const scroller = scrollRef.current;
    const sheetElement = sheetRef.current?.querySelector('svg');
    if (note && note.line !== previous.line && scroller && sheetElement && isPlaying) {
      const sheetTop =
        sheetElement.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop;
      const top = sheetTop + rendered.lineTops[note.line] - scroller.clientHeight / 4;
      scroller.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    }
  }, [tick, midiData, isPlaying]);

  return (
    <CenteredContainer>
      <ScrollContainer ref={scrollRef}>
        {!isMusicViewValid && (
          <FallbackContainer>
            <Typography variant="h4">{t('noMusicSheets')}</Typography>
            <Typography variant="h6">{t('noMusicSheetsSubtitle')}</Typography>
          </FallbackContainer>
        )}
        <SheetContainer ref={sheetRef} hidden={!isMusicViewValid} />
      </ScrollContainer>
      {isMusicViewValid && (
        <PlayerControlsContainer>
          <PlayerControls player={player} />
        </PlayerControlsContainer>
      )}
    </CenteredContainer>
  );
};

export default MusicSheet;

const CenteredContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  flex: 1;
  min-height: 0;
`;

const ScrollContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  display: flex;
  justify-content: center;
`;

const SheetContainer = styled.div`
  max-width: ${MAX_SHEET_WIDTH}px;
  /* room for the song header above and the fixed player controls below */
  padding-top: 90px;
  padding-bottom: 140px;

  svg {
    display: block;
  }

  .${ACTIVE_CLASS} path,
  .${ACTIVE_CLASS} text,
  .${ACTIVE_CLASS} rect {
    fill: ${mainColors.red};
    stroke: ${mainColors.red};
  }
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
