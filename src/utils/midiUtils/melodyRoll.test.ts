import { Midi } from '@tonejs/midi';
import { BagpipeTypes } from '../../interfaces';
import {
  addNote,
  createRoll,
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
});
