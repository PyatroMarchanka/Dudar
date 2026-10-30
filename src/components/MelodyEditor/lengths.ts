import { ROLL_PPQ } from '../../utils/midiUtils/melodyRoll';

export interface NoteLength {
  id: string;
  // Length in ticks at ROLL_PPQ
  ticks: number;
  // Grid a new note of this length snaps to
  snap: number;
  // Fraction of a whole note shown in the select, e.g. "1/8"
  label: string;
  dotted?: boolean;
  triplet?: boolean;
}

const Q = ROLL_PPQ;

export const NOTE_LENGTHS: NoteLength[] = [
  { id: '1', ticks: Q * 4, snap: Q * 4, label: '1' },
  { id: '2', ticks: Q * 2, snap: Q * 2, label: '1/2' },
  { id: '2.', ticks: Q * 3, snap: Q, label: '1/2', dotted: true },
  { id: '4', ticks: Q, snap: Q, label: '1/4' },
  { id: '4.', ticks: (Q * 3) / 2, snap: Q / 2, label: '1/4', dotted: true },
  { id: '8', ticks: Q / 2, snap: Q / 2, label: '1/8' },
  { id: '8.', ticks: (Q * 3) / 4, snap: Q / 4, label: '1/8', dotted: true },
  { id: '16', ticks: Q / 4, snap: Q / 4, label: '1/16' },
  { id: '32', ticks: Q / 8, snap: Q / 8, label: '1/32' },
  // Three in the time of two
  { id: '4t', ticks: (Q * 2) / 3, snap: (Q * 2) / 3, label: '1/4', triplet: true },
  { id: '8t', ticks: Q / 3, snap: Q / 3, label: '1/8', triplet: true },
  { id: '16t', ticks: Q / 6, snap: Q / 6, label: '1/16', triplet: true },
];

export const DEFAULT_LENGTH_ID = '4';

// Grids notes snap to when added or dragged. "auto" follows the note length select.
export const GRID_AUTO = 'auto';
export const GRIDS = NOTE_LENGTHS.filter((length) => ['4', '8', '16', '32', '4t', '8t', '16t'].includes(length.id));

export const getGridTicks = (gridId: string, length: NoteLength) =>
  gridId === GRID_AUTO ? length.snap : (GRIDS.find((grid) => grid.id === gridId)?.ticks ?? length.snap);

export const getNoteLength = (id: string) => NOTE_LENGTHS.find((length) => length.id === id) ?? NOTE_LENGTHS[3];

// The length a stored note matches, to show it in the select when it's selected
export const findNoteLength = (ticks: number) => NOTE_LENGTHS.find((length) => length.ticks === ticks);

// Start of the grid cell `tick` falls in, counted from the start of its bar
export const snapTick = (tick: number, snap: number, barTicks: number) => {
  const barStart = Math.floor(tick / barTicks) * barTicks;
  return barStart + Math.floor((tick - barStart) / snap) * snap;
};
