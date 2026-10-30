import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Button as MuiButton,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Snackbar,
  TextField,
  Typography,
} from '@material-ui/core';
import {
  Add,
  ArrowBack,
  Assignment,
  ChevronLeft,
  ChevronRight,
  Delete,
  DeleteSweep,
  FileCopy,
  GridOn,
  LayersClear,
  MusicNote,
  ViewWeek,
  OpenInNew,
  PlayArrow,
  Redo,
  Repeat,
  RepeatOne,
  Settings,
  SkipPrevious,
  Stop,
  Undo,
} from '@material-ui/icons';
import { store } from '../../context';
import { bagpipes } from '../../dataset/bagpipes';
import { TimeSignatures } from '../../dataset/songs/interfaces';
import { BagpipeTypes } from '../../interfaces';
import { routes } from '../../router/routes';
import { mainColors } from '../../utils/theme';
import { getMelodyError, melodiesApi } from '../../api/melodies';
import {
  addNote,
  BarsClip,
  clearBars,
  copyBars,
  createRoll,
  findNoteAt,
  getBarTicks,
  getRollEnd,
  insertBars,
  MAX_ROLL_BPM,
  MAX_ROLL_NOTES,
  MelodyRoll,
  MIN_ROLL_BPM,
  pasteBars,
  removeBars,
  removeNote,
  ROLL_TIME_SIGNATURES,
  setNoteTiming,
  setTimeSignature,
  updateNote,
} from '../../utils/midiUtils/melodyRoll';
// Installs the roundRect fallback the canvas uses on older browsers
import '../../utils/drawUtils/drawNotes';
import { EditorCanvas } from './EditorCanvas';
import { clearDraft, loadDraft, NEW_DRAFT_KEY, saveDraft } from './draft';
import { getLaneChoices, getLaneIndex, getLanes } from './lanes';
import {
  DEFAULT_LENGTH_ID,
  findNoteLength,
  getGridTicks,
  getNoteLength,
  GRID_AUTO,
  GRIDS,
  NOTE_LENGTHS,
  snapTick,
} from './lengths';
import { useHistory as useUndoHistory } from './useHistory';
import { auditionNote, LoopRange, usePreview } from './usePreview';
import { transposeNoteWithOctave } from '../../utils/midiUtils';

const MAX_TITLE_LENGTH = 200;
const VIEW_BARS = ['0.5', '1', '2', '4'];
// Two taps on the loop button this close together switch its mode
const DOUBLE_TAP_MS = 350;

// Loop the whole melody, or the bars on screen
type LoopMode = 'all' | 'view';

// Copied bars stay while the app is open, so they can be pasted into another melody
let copiedBars: BarsClip | null = null;

interface NoteMenu {
  top: number;
  left: number;
  laneIndex: number;
  // Set when changing a note, unset when picking what a lane adds
  noteIndex?: number;
}

const snapshotOf = (title: string, roll: MelodyRoll) => JSON.stringify({ title: title.trim(), roll });

// The piano-roll editor for My melodies: /melodies/editor (new) and /melodies/editor/:id
export const MelodyEditor = () => {
  const { t: translate } = useTranslation('translation');
  const t = (key: string, options?: object): string => String(translate(key, options as any) ?? '');
  const history = useHistory();
  const { id } = useParams<{ id?: string }>();
  const draftKey = id || NEW_DRAFT_KEY;
  const {
    state: { bagpipeType: settingsBagpipe, transpose, userData },
  } = useContext(store);
  const isLoggedIn = !!userData?._id;

  const undoable = useUndoHistory<MelodyRoll>(createRoll(settingsBagpipe));
  const { value: roll, set: setRoll, reset: resetRoll } = undoable;
  const [title, setTitle] = useState('');
  // What the server has, to tell whether there is anything to save. Null until first saved.
  const [savedSnapshot, setSavedSnapshot] = useState<string | null>(null);
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error' | 'notRoll'>(id ? 'loading' : 'ready');

  const [lengthId, setLengthId] = useState(DEFAULT_LENGTH_ID);
  const [gridId, setGridId] = useState(GRID_AUTO);
  const [viewBars, setViewBars] = useState('1');
  const [viewStart, setViewStart] = useState(0);
  // Where Play starts: the start of a bar, moved by dragging the marker above the bars
  const [playStart, setPlayStart] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [loopOn, setLoopOn] = useState(false);
  const [loopMode, setLoopMode] = useState<LoopMode>('all');
  const lastLoopTapRef = useRef(0);
  const [clip, setClip] = useState<BarsClip | null>(copiedBars);
  const [laneOverrides, setLaneOverrides] = useState<Record<number, number>>({});
  const [noteMenu, setNoteMenu] = useState<NoteMenu | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [titleError, setTitleError] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  // A new melody that was just saved moves to its own address; it's already loaded
  const justSavedIdRef = useRef<string | null>(null);

  // Load the melody, or the unsaved draft of it
  useEffect(() => {
    if (id && justSavedIdRef.current === id) {
      justSavedIdRef.current = null;
      return;
    }
    let cancelled = false;
    const draft = loadDraft(draftKey);
    setSelected(null);
    setViewStart(0);
    setPlayStart(0);
    setLaneOverrides({});

    if (!id) {
      resetRoll(draft?.roll ?? createRoll(settingsBagpipe));
      setTitle(draft?.title ?? '');
      setSavedSnapshot(null);
      setLoadState('ready');
      return;
    }

    setLoadState('loading');
    melodiesApi
      .getMelody(id)
      .then((melody) => {
        if (cancelled) return;
        if (melody.format !== 'roll' || !melody.roll) {
          setLoadState('notRoll');
          return;
        }
        setSavedSnapshot(snapshotOf(melody.title, melody.roll));
        resetRoll(draft?.roll ?? melody.roll);
        setTitle(draft?.title ?? melody.title);
        setLoadState('ready');
      })
      .catch((error) => {
        if (cancelled) return;
        console.log(error);
        setLoadState('error');
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const isDirty =
    savedSnapshot === null ? roll.notes.length > 0 || !!title.trim() : snapshotOf(title, roll) !== savedSnapshot;

  // Keep unsaved edits in the browser
  useEffect(() => {
    if (loadState !== 'ready') return;
    if (isDirty) {
      saveDraft(draftKey, { title, roll });
    } else {
      clearDraft(draftKey);
    }
  }, [loadState, isDirty, draftKey, title, roll]);

  const bagpipeType: BagpipeTypes = bagpipes[roll.bagpipeType] ? roll.bagpipeType : settingsBagpipe;
  const lanes = useMemo(() => getLanes(bagpipeType), [bagpipeType]);
  const usedChoices = useMemo(() => getLaneChoices(lanes, roll.notes), [lanes, roll.notes]);
  const laneChoices = useMemo(
    () => usedChoices.map((pitch, index) => laneOverrides[index] ?? pitch),
    [usedChoices, laneOverrides]
  );

  const length = getNoteLength(lengthId);
  const grid = getGridTicks(gridId, length);
  const barTicks = getBarTicks(roll);
  const rollEnd = getRollEnd(roll);
  const viewTicks = barTicks * Number(viewBars);
  const secondsPerTick = 60 / (roll.bpm * roll.ppq);

  const { play, stop, isPlaying, playheadTick } = usePreview({ ...roll, bagpipeType }, transpose);

  const loopRange: LoopRange | undefined = !loopOn
    ? undefined
    : loopMode === 'all'
      ? [0, rollEnd]
      : [viewStart, Math.min(viewStart + viewTicks, rollEnd)];
  const loopKey = loopRange ? loopRange.join('-') : 'off';

  // The loop was switched or moved to other bars while playing: carry on with the new one
  const lastLoopKeyRef = useRef(loopKey);
  useEffect(() => {
    if (lastLoopKeyRef.current === loopKey) return;
    lastLoopKeyRef.current = loopKey;
    if (playheadTick !== null) play(Math.floor(playheadTick), loopRange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loopKey]);

  // Bars were removed or got shorter: stay inside the melody
  useEffect(() => {
    if (viewStart > 0 && viewStart >= rollEnd) {
      setViewStart(Math.max(0, Math.floor((rollEnd - 1) / viewTicks) * viewTicks));
    }
  }, [viewStart, rollEnd, viewTicks]);

  // Bars were removed: the start marker stays on a bar that exists
  useEffect(() => {
    if (playStart >= rollEnd) setPlayStart(Math.max(0, rollEnd - barTicks));
  }, [playStart, rollEnd, barTicks]);

  // The page follows the playhead, unless the bars on screen are looped (then paging moves the loop)
  const loopsView = loopOn && loopMode === 'view';
  useEffect(() => {
    if (playheadTick === null || loopsView) return;
    if (playheadTick >= viewStart + viewTicks || playheadTick < viewStart) {
      setViewStart(Math.floor(playheadTick / viewTicks) * viewTicks);
    }
  }, [playheadTick, viewStart, viewTicks, loopsView]);

  const selectedNote = selected !== null ? roll.notes[selected] : undefined;
  const selectedLane = selectedNote ? getLaneIndex(lanes, selectedNote[0]) : -1;

  const sound = useCallback(
    (pitch: number, ticks: number) => {
      if (!isPlaying) auditionNote(bagpipeType, pitch, transpose, ticks * secondsPerTick);
    },
    [bagpipeType, transpose, secondsPerTick, isPlaying]
  );

  const onTap = (laneIndex: number, tick: number) => {
    const lane = lanes[laneIndex];
    if (!lane) return;
    const existing = findNoteAt(roll, tick, lane.pitches);
    if (existing !== -1) {
      const [pitch, , duration] = roll.notes[existing];
      setSelected(existing);
      const noteLength = findNoteLength(duration);
      if (noteLength) setLengthId(noteLength.id);
      sound(pitch, duration);
      return;
    }
    if (roll.notes.length >= MAX_ROLL_NOTES) {
      setMessage(t('melodyEditor.tooManyNotes', { max: MAX_ROLL_NOTES }));
      return;
    }
    const pitch = laneChoices[laneIndex];
    const start = snapTick(tick, grid, barTicks);
    const result = addNote(roll, pitch, start, length.ticks);
    setRoll(result.roll);
    setSelected(result.index);
    sound(pitch, length.ticks);
  };

  const onLabelTap = (laneIndex: number, position: { x: number; y: number }) => {
    const lane = lanes[laneIndex];
    if (!lane) return;
    sound(laneChoices[laneIndex], roll.ppq);
    if (lane.pitches.length > 1) {
      setNoteMenu({ top: position.y, left: position.x, laneIndex });
    }
  };

  const onLengthChange = (newId: string) => {
    setLengthId(newId);
    if (selected !== null) {
      const result = updateNote(roll, selected, { duration: getNoteLength(newId).ticks });
      setRoll(result.roll);
      setSelected(result.index);
    }
  };

  const onPickNote = (pitch: number) => {
    if (!noteMenu) return;
    setLaneOverrides((overrides) => ({ ...overrides, [noteMenu.laneIndex]: pitch }));
    if (noteMenu.noteIndex !== undefined) {
      const result = updateNote(roll, noteMenu.noteIndex, { pitch });
      setRoll(result.roll);
      setSelected(result.index);
      sound(pitch, roll.notes[noteMenu.noteIndex][2]);
    } else {
      sound(pitch, roll.ppq);
    }
    setNoteMenu(null);
  };

  const onDeleteNote = () => {
    if (selected === null) return;
    setRoll(removeNote(roll, selected));
    setSelected(null);
  };

  const canGoNext = viewStart + viewTicks < rollEnd;
  const goTo = (start: number) => {
    setSelected(null);
    setViewStart(Math.max(0, start));
  };
  const goNext = () => canGoNext && goTo(viewStart + viewTicks);
  const goPrev = () => viewStart > 0 && goTo(viewStart - viewTicks);

  const onAddBar = () => {
    const atBar = Math.min(roll.bars, Math.ceil((viewStart + viewTicks) / barTicks));
    setRoll(insertBars(roll, atBar, 1));
    goTo(atBar * barTicks);
  };

  const barsOnScreen = Math.max(1, Math.floor(Number(viewBars)));
  const onDeleteBars = () => {
    const fromBar = Math.floor(viewStart / barTicks);
    setRoll(removeBars(roll, fromBar, barsOnScreen));
    goTo(fromBar * barTicks);
  };

  const firstBarOnScreen = Math.floor(viewStart / barTicks);
  const screenEnd = (firstBarOnScreen + barsOnScreen) * barTicks;
  const hasNotesOnScreen = roll.notes.some(
    (note) => note[1] < screenEnd && note[1] + note[2] > firstBarOnScreen * barTicks
  );
  const onClearBars = () => {
    setRoll(clearBars(roll, firstBarOnScreen, barsOnScreen));
    setSelected(null);
  };

  const onCopyBars = () => {
    const fromBar = Math.floor(viewStart / barTicks);
    const copied = copyBars(roll, fromBar, barsOnScreen);
    copiedBars = copied;
    setClip(copied);
    const count = Math.round(copied.ticks / barTicks);
    setMessage(
      count > 1
        ? t('melodyEditor.copiedBars', { from: fromBar + 1, to: fromBar + count })
        : t('melodyEditor.copiedBar', { bar: fromBar + 1 })
    );
  };

  const onPasteBars = () => {
    if (!clip) return;
    const atBar = Math.floor(viewStart / barTicks);
    const pasted = pasteBars(roll, clip, atBar);
    if (pasted.notes.length > MAX_ROLL_NOTES) {
      setMessage(t('melodyEditor.tooManyNotes', { max: MAX_ROLL_NOTES }));
      return;
    }
    setRoll(pasted);
    setSelected(null);
    setViewStart(atBar * barTicks);
    setMessage(t('melodyEditor.pasted', { bar: atBar + 1 }));
  };

  // One tap turns the loop on or off, two quick taps switch between looping
  // the whole melody and the bars on screen
  const onLoopTap = () => {
    const now = Date.now();
    const isDoubleTap = now - lastLoopTapRef.current < DOUBLE_TAP_MS;
    lastLoopTapRef.current = isDoubleTap ? 0 : now;
    if (isDoubleTap) {
      const mode = loopMode === 'all' ? 'view' : 'all';
      setLoopMode(mode);
      setLoopOn(true);
      setMessage(t(mode === 'all' ? 'melodyEditor.loopAll' : 'melodyEditor.loopView'));
    } else {
      setLoopOn(!loopOn);
      setMessage(
        loopOn ? t('melodyEditor.loopOff') : t(loopMode === 'all' ? 'melodyEditor.loopAll' : 'melodyEditor.loopView')
      );
    }
  };

  const onViewChange = (value: string) => {
    const ticks = barTicks * Number(value);
    setViewBars(value);
    setViewStart(Math.floor(viewStart / ticks) * ticks);
  };

  const onUndo = () => {
    setSelected(null);
    undoable.undo();
  };
  const onRedo = () => {
    setSelected(null);
    undoable.redo();
  };

  const onPlay = () => {
    if (isPlaying) {
      stop();
    } else {
      setSelected(null);
      play(playStart, loopRange);
    }
  };

  const onOpenPlayer = () => {
    if (!roll.notes.length) {
      setMessage(t('melodyEditor.noNotes'));
      return;
    }
    stop();
    if (id && !isDirty) {
      history.push(`${routes.app}/${routes.melody}/${id}`);
    } else {
      saveDraft(draftKey, { title, roll });
      history.push(`${routes.app}/${routes.draft}/${draftKey}`);
    }
  };

  const onSave = async () => {
    if (!roll.notes.length) {
      setMessage(t('melodyEditor.noNotes'));
      return;
    }
    const finalTitle = title.trim().slice(0, MAX_TITLE_LENGTH);
    if (!finalTitle) {
      setTitleError(true);
      setMessage(t('melodyEditor.titleRequired'));
      titleRef.current?.focus();
      return;
    }
    if (!isLoggedIn) {
      if (window.confirm(t('melodyEditor.loginToSave') ?? '')) {
        history.push(routes.login);
      }
      return;
    }
    setIsSaving(true);
    try {
      const input = { title: finalTitle, format: 'roll' as const, roll };
      const saved = id ? await melodiesApi.updateMelody(id, input) : await melodiesApi.addMelody(input);
      setSavedSnapshot(snapshotOf(finalTitle, roll));
      setTitle(finalTitle);
      clearDraft(draftKey);
      setMessage(t('melodyEditor.saved'));
      if (!id) {
        justSavedIdRef.current = saved.id;
        history.replace(`${routes.melodyEditor}/${saved.id}`);
      }
    } catch (error) {
      console.log(error);
      setMessage(getMelodyError(error) || t('melodyEditor.saveError'));
    } finally {
      setIsSaving(false);
    }
  };

  const onClear = () => {
    if (!window.confirm(t('melodyEditor.confirmClear') ?? '')) return;
    setRoll({ ...roll, notes: [] });
    setSelected(null);
    setSettingsOpen(false);
  };

  // Keyboard shortcuts on a computer
  const keyHandlerRef = useRef<(e: KeyboardEvent) => void>(() => {});
  keyHandlerRef.current = (e: KeyboardEvent) => {
    const target = e.target as HTMLElement;
    if (settingsOpen || ['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName)) return;
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      e.shiftKey ? onRedo() : onUndo();
    } else if ((e.key === 'Delete' || e.key === 'Backspace') && selected !== null) {
      e.preventDefault();
      onDeleteNote();
    } else if (e.key === 'ArrowRight') {
      goNext();
    } else if (e.key === 'ArrowLeft') {
      goPrev();
    } else if (e.key === ' ') {
      e.preventDefault();
      onPlay();
    } else if (e.key === 'Escape') {
      setSelected(null);
    }
  };
  useEffect(() => {
    const listener = (e: KeyboardEvent) => keyHandlerRef.current(e);
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, []);

  const firstBar = Math.floor(viewStart / barTicks) + 1;
  const lastBar = Math.min(roll.bars, Math.ceil((viewStart + viewTicks) / barTicks));
  const barText =
    lastBar > firstBar
      ? t('melodyEditor.barsOf', { from: firstBar, to: lastBar, total: roll.bars })
      : t('melodyEditor.barOf', { bar: firstBar, total: roll.bars });

  // Short enough to read in a closed select on a phone: "1/4 ·" is dotted, "1/8 ³" a triplet (the 3 over a triplet in a score)
  const lengthLabel = (lengthOption: (typeof NOTE_LENGTHS)[number]) =>
    `${lengthOption.label}${lengthOption.dotted ? ' ·' : ''}${lengthOption.triplet ? ' ³' : ''}`;

  const noteName = (note: string) => transposeNoteWithOctave(note as any, transpose);

  const loopLabel = `${t(loopMode === 'all' ? 'melodyEditor.loopAll' : 'melodyEditor.loopView')}. ${t(
    'melodyEditor.loopHint'
  )}`;

  // Loop, Play and "open in player": in the top bar on a sideways screen, in the toolbar on an upright one
  const playControls = (
    <>
      <LoopButton
        size="small"
        className={loopOn ? 'on' : undefined}
        onClick={onLoopTap}
        aria-label={loopLabel}
        aria-pressed={loopOn}
        title={loopLabel}
      >
        {loopMode === 'all' ? <Repeat /> : <RepeatOne />}
      </LoopButton>
      <PlayButton
        size="small"
        variant="outlined"
        startIcon={isPlaying ? <Stop /> : <PlayArrow />}
        onClick={onPlay}
        disabled={!roll.notes.length && !isPlaying}
        aria-label={isPlaying ? t('melodyEditor.stop') : t('melodyEditor.play')}
      >
        <span>{isPlaying ? t('melodyEditor.stop') : t('melodyEditor.play')}</span>
      </PlayButton>
      <IconButton
        size="small"
        onClick={onOpenPlayer}
        aria-label={t('melodyEditor.openPlayer')}
        title={t('melodyEditor.openPlayer') ?? ''}
      >
        <OpenInNew />
      </IconButton>
    </>
  );

  if (loadState !== 'ready') {
    return (
      <Screen>
        <Centered>
          {loadState === 'loading' ? (
            <CircularProgress />
          ) : (
            <>
              <Typography>
                {loadState === 'notRoll' ? t('melodyEditor.notRoll') : t('melodyEditor.loadError')}
              </Typography>
              <MuiButton variant="outlined" onClick={() => history.push(routes.melodies)}>
                {t('melodyEditor.back')}
              </MuiButton>
            </>
          )}
        </Centered>
      </Screen>
    );
  }

  return (
    <Screen>
      <TopBar>
        <IconButton size="small" onClick={() => history.push(routes.melodies)} aria-label={t('melodyEditor.back')}>
          <ArrowBack />
        </IconButton>
        <TitleInput
          inputRef={titleRef}
          value={title}
          placeholder={t('melodyEditor.untitled')}
          onChange={(e) => {
            setTitle(e.target.value);
            setTitleError(false);
          }}
          error={titleError}
          inputProps={{ maxLength: MAX_TITLE_LENGTH, 'aria-label': t('melodies.nameLabel') }}
        />
        <IconButton size="small" onClick={onUndo} disabled={!undoable.canUndo} aria-label={t('melodyEditor.undo')}>
          <Undo />
        </IconButton>
        <IconButton size="small" onClick={onRedo} disabled={!undoable.canRedo} aria-label={t('melodyEditor.redo')}>
          <Redo />
        </IconButton>
        <IconButton size="small" onClick={() => setSettingsOpen(true)} aria-label={t('melodyEditor.settings')}>
          <Settings />
        </IconButton>
        <LandscapeOnly>{playControls}</LandscapeOnly>
        <SaveButton
          variant="contained"
          size="small"
          disableElevation
          onClick={onSave}
          disabled={isSaving || (!isDirty && !!id)}
        >
          {isSaving ? <CircularProgress size={16} color="inherit" /> : t('melodyEditor.save')}
        </SaveButton>
      </TopBar>

      <Toolbar>
        <ToolbarRow aria-label={t('melodyEditor.notesGroup')}>
          <SelectIcon as={MusicNote} />
          <Select
            value={lengthId}
            onChange={(e) => onLengthChange(e.target.value)}
            aria-label={t('melodyEditor.length')}
            title={t('melodyEditor.length')}
          >
            {NOTE_LENGTHS.map((option) => (
              <option key={option.id} value={option.id}>
                {lengthLabel(option)}
              </option>
            ))}
          </Select>
          <SelectIcon as={GridOn} />
          <Select
            value={gridId}
            onChange={(e) => setGridId(e.target.value)}
            aria-label={t('melodyEditor.gridLabel')}
            title={t('melodyEditor.gridLabel')}
          >
            <option value={GRID_AUTO}>{t('melodyEditor.gridAuto')}</option>
            {GRIDS.map((option) => (
              <option key={option.id} value={option.id}>
                {lengthLabel(option)}
              </option>
            ))}
          </Select>
          <Divider />
          <NoteButton
            size="small"
            disabled={selectedLane === -1 || lanes[selectedLane].pitches.length < 2}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setNoteMenu({ top: rect.bottom, left: rect.left, laneIndex: selectedLane, noteIndex: selected! });
            }}
            aria-label={t('melodyEditor.chooseNote')}
            title={t('melodyEditor.chooseNote')}
          >
            {selectedNote && selectedLane !== -1
              ? `${noteName(lanes[selectedLane].notes[lanes[selectedLane].pitches.indexOf(selectedNote[0])])} ▾`
              : '–'}
          </NoteButton>
          <IconButton
            size="small"
            onClick={onDeleteNote}
            disabled={!selectedNote}
            aria-label={t('melodyEditor.deleteNote')}
            title={t('melodyEditor.deleteNote')}
          >
            <Delete />
          </IconButton>
        </ToolbarRow>
        <ToolbarRow aria-label={t('melodyEditor.barsGroup')}>
          <SelectIcon as={ViewWeek} className="wide-only" />
          <Select
            className="narrow"
            value={viewBars}
            onChange={(e) => onViewChange(e.target.value)}
            aria-label={t('melodyEditor.view')}
            title={t('melodyEditor.view')}
          >
            {VIEW_BARS.map((value) => (
              <option key={value} value={value}>
                {t(`melodyEditor.viewBars.${value.replace('.', '_')}`)}
              </option>
            ))}
          </Select>
          <IconButton
            size="small"
            onClick={onCopyBars}
            aria-label={t('melodyEditor.copyBars')}
            title={t('melodyEditor.copyBars')}
          >
            <FileCopy />
          </IconButton>
          {clip && (
            <IconButton
              size="small"
              onClick={onPasteBars}
              aria-label={t('melodyEditor.pasteBars')}
              title={t('melodyEditor.pasteBars')}
            >
              <Assignment />
            </IconButton>
          )}
          <IconButton
            size="small"
            onClick={onClearBars}
            disabled={!hasNotesOnScreen}
            aria-label={t('melodyEditor.clearBars')}
            title={t('melodyEditor.clearBars')}
          >
            <LayersClear />
          </IconButton>
          <IconButton
            size="small"
            onClick={onDeleteBars}
            disabled={roll.bars <= barsOnScreen}
            aria-label={t('melodyEditor.deleteBars')}
            title={t('melodyEditor.deleteBars')}
          >
            <DeleteSweep />
          </IconButton>
          <PortraitOnly>
            <Divider />
            {playControls}
          </PortraitOnly>
        </ToolbarRow>
      </Toolbar>

      <CanvasArea>
        <EditorCanvas
          roll={roll}
          lanes={lanes}
          laneChoices={laneChoices}
          transpose={transpose}
          viewStart={viewStart}
          viewTicks={viewTicks}
          snap={grid}
          selected={selected}
          playheadTick={playheadTick}
          playStart={playStart}
          emptyHint={t('melodyEditor.emptyHint')}
          onTap={onTap}
          onLabelTap={onLabelTap}
          onSwipe={(direction) => (direction > 0 ? goNext() : goPrev())}
          onDragStart={(index) => setSelected(index)}
          onNoteTiming={(index, tick, duration) => {
            setRoll(setNoteTiming(roll, index, tick, duration));
            setSelected(index);
          }}
          onNoteDoubleTap={(index) => {
            setRoll(removeNote(roll, index));
            setSelected(null);
          }}
          onPlayStart={setPlayStart}
        />
        <Footer>
          <PageButton onClick={goPrev} disabled={viewStart === 0} aria-label={t('melodyEditor.prev')}>
            <ChevronLeft />
          </PageButton>
          <Group>
            <IconButton
              size="small"
              onClick={() => goTo(0)}
              disabled={viewStart === 0}
              aria-label={t('melodyEditor.toStart')}
              title={t('melodyEditor.toStart')}
            >
              <SkipPrevious />
            </IconButton>
            <BarText>{barText}</BarText>
            <Divider />
            <AddBarButton size="small" startIcon={<Add />} onClick={onAddBar} title={t('melodyEditor.addBar')}>
              <span>{t('melodyEditor.bar')}</span>
            </AddBarButton>
          </Group>
          <PageButton onClick={goNext} disabled={!canGoNext} aria-label={t('melodyEditor.next')}>
            <ChevronRight />
          </PageButton>
        </Footer>
      </CanvasArea>

      <Menu
        open={!!noteMenu}
        onClose={() => setNoteMenu(null)}
        anchorReference="anchorPosition"
        anchorPosition={noteMenu ? { top: noteMenu.top, left: noteMenu.left } : undefined}
      >
        {noteMenu &&
          lanes[noteMenu.laneIndex]?.notes.map((note, index) => {
            const pitch = lanes[noteMenu.laneIndex].pitches[index];
            const current =
              noteMenu.noteIndex !== undefined ? roll.notes[noteMenu.noteIndex]?.[0] : laneChoices[noteMenu.laneIndex];
            return (
              <MenuItem key={note} selected={pitch === current} onClick={() => onPickNote(pitch)}>
                {noteName(note)}
              </MenuItem>
            );
          })}
      </Menu>

      <SettingsDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        roll={roll}
        bagpipeName={t(`dudas.${bagpipes[bagpipeType].name}`)}
        onTimeSignature={(timeSignature) => {
          setRoll(setTimeSignature(roll, timeSignature));
          setSelected(null);
          setViewStart(0);
        }}
        onTempo={(bpm) => setRoll({ ...roll, bpm })}
        onClear={onClear}
      />

      <Snackbar
        open={!!message}
        message={message}
        autoHideDuration={3000}
        onClose={() => setMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Screen>
  );
};

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
  roll: MelodyRoll;
  bagpipeName: string;
  onTimeSignature: (timeSignature: TimeSignatures) => void;
  onTempo: (bpm: number) => void;
  onClear: () => void;
}

const SettingsDialog = ({
  open,
  onClose,
  roll,
  bagpipeName,
  onTimeSignature,
  onTempo,
  onClear,
}: SettingsDialogProps) => {
  const { t: translate } = useTranslation('translation');
  const t = (key: string, options?: object): string => String(translate(key, options as any) ?? '');
  const [tempo, setTempo] = useState(String(roll.bpm));

  useEffect(() => {
    if (open) setTempo(String(roll.bpm));
  }, [open, roll.bpm]);

  const commitTempo = () => {
    const bpm = Math.round(Number(tempo));
    if (Number.isFinite(bpm) && bpm >= MIN_ROLL_BPM && bpm <= MAX_ROLL_BPM) {
      if (bpm !== roll.bpm) onTempo(bpm);
    } else {
      setTempo(String(roll.bpm));
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        commitTempo();
        onClose();
      }}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>{t('melodyEditor.settings')}</DialogTitle>
      <DialogContent>
        <Field>
          <label htmlFor="melody-time-signature">{t('melodyEditor.timeSignature')}</label>
          <Select
            id="melody-time-signature"
            value={roll.timeSignature}
            onChange={(e) => onTimeSignature(e.target.value as TimeSignatures)}
          >
            {ROLL_TIME_SIGNATURES.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </Select>
        </Field>
        <Field>
          <label htmlFor="melody-tempo">{t('melodyEditor.tempo')}</label>
          <TempoInput
            id="melody-tempo"
            type="number"
            inputMode="numeric"
            min={MIN_ROLL_BPM}
            max={MAX_ROLL_BPM}
            value={tempo}
            onChange={(e) => setTempo(e.target.value)}
            onBlur={commitTempo}
          />
        </Field>
        <Field>
          <span>{t('melodyEditor.bagpipe')}</span>
          <strong>{bagpipeName}</strong>
        </Field>
        <MuiButton startIcon={<Delete />} onClick={onClear} disabled={!roll.notes.length}>
          {t('melodyEditor.clear')}
        </MuiButton>
      </DialogContent>
      <DialogActions>
        <MuiButton
          color="primary"
          onClick={() => {
            commitTempo();
            onClose();
          }}
        >
          {t('melodyEditor.done')}
        </MuiButton>
      </DialogActions>
    </Dialog>
  );
};

const Screen = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  background-color: ${mainColors.lightestGrey};
  overflow: hidden;
  padding: 0 env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
  box-sizing: border-box;
  font-family: 'Roboto', sans-serif;
`;

const Centered = styled.div`
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  text-align: center;
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 4px 6px;
  background: white;
  border-bottom: 1px solid ${mainColors.lightGrey};
`;

const TitleInput = styled(TextField)`
  flex: 1 1 auto;
  min-width: 0;
  margin: 0 6px !important;

  input {
    /* iOS Safari zooms into inputs under 16px */
    font-size: 16px;
    font-weight: 500;
    color: ${mainColors.darkerGray};
    padding: 6px 0;
  }
`;

const SaveButton = styled(MuiButton)`
  margin-left: 4px !important;
  background-color: ${mainColors.orange} !important;
  color: white !important;
  min-width: 64px !important;

  &.Mui-disabled {
    background-color: ${mainColors.lightGrey} !important;
  }
`;

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 2px 4px;
  padding: 2px 6px;
`;

const Group = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`;

// On an upright phone each row takes the full width, spread out
const ToolbarRow = styled(Group)`
  @media (orientation: portrait) {
    flex: 1 1 100%;
    justify-content: space-between;
  }
`;

const Select = styled.select`
  /* iOS Safari zooms into controls under 16px */
  font-size: 16px;
  font-family: inherit;
  color: ${mainColors.darkerGray};
  background: white;
  border: 1px solid ${mainColors.lightGrey};
  border-radius: 8px;
  padding: 4px 6px;
  height: 34px;
  /* Long choices ("1/16 triplet") are cut short when closed, so the toolbar fits one row on a sideways phone */
  max-width: 7rem;
  text-overflow: ellipsis;

  &.narrow {
    max-width: 6rem;
  }
`;

// Tells the note length and grid selects apart
const SelectIcon = styled.span`
  font-size: 18px !important;
  color: ${mainColors.midGrey};
  margin-left: 4px;

  &.wide-only {
    @media (max-width: 400px) {
      display: none;
    }
  }
`;

const Divider = styled.span`
  width: 1px;
  height: 24px;
  margin: 0 6px;
  background: ${mainColors.lightGrey};
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  padding: 2px 4px;
  border-top: 1px solid ${mainColors.lightGrey};
  background: ${mainColors.lightestGrey};
`;

// Previous and next page, in the bottom corners where thumbs reach them
const PageButton = styled(IconButton)`
  width: 44px;
  height: 36px;
  border-radius: 10px !important;
  background: white !important;
  border: 1px solid ${mainColors.lightGrey} !important;
  color: ${mainColors.darkerGray} !important;

  &.Mui-disabled {
    opacity: 0.4;
  }
`;

const LandscapeOnly = styled.div`
  display: contents;

  @media (orientation: portrait) {
    display: none;
  }
`;

const PortraitOnly = styled.div`
  display: none;

  @media (orientation: portrait) {
    display: contents;
  }
`;

// The "Bar" label drops on narrow screens, leaving the + icon
const AddBarButton = styled(MuiButton)`
  min-width: 0 !important;

  @media (max-width: 760px) {
    .MuiButton-startIcon {
      margin: 0;
    }
    span > span:not(.MuiButton-startIcon) {
      display: none;
    }
  }
`;

const BarText = styled.span`
  min-width: 4.8rem;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  color: ${mainColors.darkerGray};
  white-space: nowrap;
`;

// Lit up while looping; the icon tells which loop
const LoopButton = styled(IconButton)`
  &.on {
    color: white !important;
    background: ${mainColors.orange} !important;
  }
`;

// On narrow phones the label drops, leaving the icon
const PlayButton = styled(MuiButton)`
  color: ${mainColors.darkerGray} !important;
  border-color: ${mainColors.orange} !important;

  @media (max-width: 400px) {
    min-width: 40px !important;
    .MuiButton-startIcon {
      margin: 0;
    }
    span > span:not(.MuiButton-startIcon) {
      display: none;
    }
  }
`;

const CanvasArea = styled.div`
  position: relative;
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
  margin: 0 6px 6px;
  border: 1px solid ${mainColors.lightGrey};
  border-radius: 8px;
  overflow: hidden;
  background: white;
`;

const NoteButton = styled(MuiButton)`
  min-width: 52px !important;
  text-transform: none !important;
  font-size: 15px !important;
  color: ${mainColors.darkerGray} !important;

  &.Mui-disabled {
    color: ${mainColors.midGrey} !important;
  }
`;

const Field = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
  color: ${mainColors.darkerGray};
  font-family: 'Roboto', sans-serif;
`;

const TempoInput = styled.input`
  font-size: 16px;
  width: 5.5rem;
  padding: 4px 6px;
  height: 34px;
  box-sizing: border-box;
  border: 1px solid ${mainColors.lightGrey};
  border-radius: 8px;
  color: ${mainColors.darkerGray};
`;
