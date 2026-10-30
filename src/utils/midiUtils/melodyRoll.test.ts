import { Midi } from '@tonejs/midi';
import { BagpipeTypes } from '../../interfaces';
import {
  addNote,
  copyBars,
  createRoll,
  pasteBars,
  dragNoteTiming,
  roundToGrid,
  setNoteTiming,
  findNoteAt,
  getBarTicks,
  insertBars,
  removeBars,
  rollToMidi,
  setTimeSignature,
  updateNote,
} from './melodyRoll';

const Q = 480;
const empty = () => createRoll(BagpipeTypes.BelarusianTraditionalDuda);

describe('melodyRoll', () => {
  it('adds notes in time order', () => {
    let { roll } = addNote(empty(), 69, Q, Q);
    const result = addNote(roll, 71, 0, Q);
    expect(result.roll.notes).toEqual([
      [71, 0, Q],
      [69, Q, Q],
    ]);
    expect(result.index).toBe(0);
  });

  it('replaces notes under a new one and shortens the one still sounding', () => {
    let roll = addNote(empty(), 69, 0, Q * 2).roll;
    roll = addNote(roll, 71, Q * 2, Q).roll;
    const result = addNote(roll, 72, Q, Q * 2);
    expect(result.roll.notes).toEqual([
      [69, 0, Q],
      [72, Q, Q * 2],
    ]);
  });

  it('adds bars when a note reaches past the end', () => {
    const roll = addNote(empty(), 69, Q * 15, Q * 2).roll;
    expect(roll.bars).toBe(5);
  });

  it('changes length and pitch of a note', () => {
    let roll = addNote(empty(), 69, 0, Q).roll;
    roll = addNote(roll, 71, Q, Q).roll;
    const longer = updateNote(roll, 0, { duration: Q * 2 });
    expect(longer.roll.notes).toEqual([[69, 0, Q * 2]]);
    const sharper = updateNote(roll, 1, { pitch: 72 });
    expect(sharper.roll.notes).toEqual([
      [69, 0, Q],
      [72, Q, Q],
    ]);
    expect(sharper.index).toBe(1);
  });

  it('finds the note sounding on a line', () => {
    const roll = addNote(empty(), 69, Q, Q).roll;
    expect(findNoteAt(roll, Q + 10, [68, 69])).toBe(0);
    expect(findNoteAt(roll, Q * 2, [69])).toBe(-1);
    expect(findNoteAt(roll, Q + 10, [71])).toBe(-1);
  });

  it('inserts and removes bars, moving later notes', () => {
    const bar = getBarTicks(empty());
    let roll = addNote(empty(), 69, 0, Q).roll;
    roll = addNote(roll, 71, bar, Q).roll;
    const inserted = insertBars(roll, 1, 1);
    expect(inserted.bars).toBe(5);
    expect(inserted.notes).toEqual([
      [69, 0, Q],
      [71, bar * 2, Q],
    ]);
    const removed = removeBars(inserted, 1, 1);
    expect(removed).toEqual({ ...roll, bars: 4 });
  });

  it('cuts a note that runs into removed bars and keeps at least one bar', () => {
    const bar = getBarTicks(empty());
    const roll = addNote(empty(), 69, bar - Q, Q * 2).roll;
    expect(removeBars(roll, 1, 1).notes).toEqual([[69, bar - Q, Q]]);
    expect(removeBars({ ...roll, bars: 1 }, 0, 1).bars).toBe(1);
  });

  it('keeps notes in place when the time signature changes', () => {
    const roll = setTimeSignature(addNote(empty(), 69, Q * 15, Q).roll, '3/4');
    expect(roll.notes).toEqual([[69, Q * 15, Q]]);
    expect(roll.bars).toBeGreaterThanOrEqual(6);
  });

  it('builds a MIDI file the player can read', () => {
    let roll = addNote({ ...empty(), timeSignature: '6/8', bpm: 120 }, 69, 0, Q).roll;
    roll = addNote(roll, 71, Q, Q / 2).roll;
    const { buffer, song } = rollToMidi(roll, 'Test');
    const midi = new Midi(buffer);
    const notes = midi.tracks.flatMap((track) => track.notes);
    expect(notes.map((note) => [note.midi, note.ticks, note.durationTicks])).toEqual([
      [69, 0, Q - 1],
      [71, Q, Q / 2 - 1],
    ]);
    expect(midi.header.tempos).toEqual([]);
    expect(song.originalTempo).toBe(240);
    expect(song.timeSignature).toBe('6/8');
    expect(song.name).toBe('Test');
  });

  it('rounds to the grid from the start of each bar', () => {
    const bar78 = 7 * 240;
    expect(roundToGrid(130, 120, 1920)).toBe(120);
    expect(roundToGrid(1920 + 170, 120, 1920)).toBe(1920 + 120);
    expect(roundToGrid(bar78 + 500, 480, bar78)).toBe(bar78 + 480);
    expect(roundToGrid(1600, 480, bar78)).toBe(bar78);
  });

  it('drags a note on the grid, pushing into its neighbours without removing them', () => {
    let roll = addNote(empty(), 69, 0, Q).roll;
    roll = addNote(roll, 71, Q, Q).roll;
    roll = addNote(roll, 72, Q * 2, Q).roll;
    // Move the middle note right by a bit more than an eighth: lands on the grid
    expect(dragNoteTiming(roll, 1, 'move', 260, Q / 2)).toEqual([Q + Q / 2, Q]);
    // ...and the next note starts later
    expect(setNoteTiming(roll, 1, Q + Q / 2, Q).notes).toEqual([
      [69, 0, Q],
      [71, Q + Q / 2, Q],
      [72, Q * 2 + Q / 2, Q / 2],
    ]);
    // It can't push a neighbour shorter than one grid step
    expect(dragNoteTiming(roll, 1, 'move', Q * 5, Q / 2)).toEqual([Q + Q / 2, Q]);
    expect(dragNoteTiming(roll, 1, 'move', -Q * 5, Q / 4)).toEqual([Q / 4, Q]);
    // Edges
    expect(dragNoteTiming(roll, 1, 'start', -Q / 2, Q / 4)).toEqual([Q / 2, Q + Q / 2]);
    expect(dragNoteTiming(roll, 1, 'start', Q * 3, Q / 4)).toEqual([Q * 2 - Q / 4, Q / 4]);
    expect(dragNoteTiming(roll, 1, 'end', 50, Q / 3)).toEqual([Q, Q]);
    expect(dragNoteTiming(roll, 1, 'end', 100, Q / 3)).toEqual([Q, Q + Q / 3]);
    // Shortening leaves a rest
    expect(setNoteTiming(roll, 1, Q, Q / 2).notes[2]).toEqual([72, Q * 2, Q]);
    // The last note can grow past the end, and bars are added
    const [tick, duration] = dragNoteTiming(roll, 2, 'end', Q * 20, Q);
    expect(setNoteTiming(roll, 2, tick, duration).bars).toBe(6);
  });

  it('copies bars and pastes them over others', () => {
    const bar = Q * 4;
    let roll = empty();
    roll = addNote(roll, 69, 0, Q).roll;
    roll = addNote(roll, 71, bar + Q, Q * 4).roll; // runs into bar 3
    roll = addNote(roll, 72, bar * 2 + Q * 2, Q).roll;
    const clip = copyBars(roll, 1, 1);
    // The long note is cut at the end of the copied bar
    expect(clip).toEqual({ ticks: bar, notes: [[71, Q, Q * 3]] });
    // Pasting over bar 1 replaces its note, and the long note sounding into bar 3 is cut
    const pasted = pasteBars(roll, clip, 2);
    expect(pasted.notes).toEqual([
      [69, 0, Q],
      [71, bar + Q, Q * 3],
      [71, bar * 2 + Q, Q * 3],
    ]);
    // Pasting past the end adds bars
    const twoBars = copyBars(roll, 0, 2);
    expect(twoBars.ticks).toBe(bar * 2);
    const longer = pasteBars(roll, twoBars, 3);
    expect(longer.bars).toBe(5);
    expect(longer.notes.slice(-2)).toEqual([
      [69, bar * 3, Q],
      [71, bar * 4 + Q, Q * 3],
    ]);
    // Copying past the last bar copies what exists
    expect(copyBars(roll, 3, 4).ticks).toBe(bar);
  });
});
