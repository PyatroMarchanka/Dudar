import fs from 'fs';
import path from 'path';
import { Midi } from '@tonejs/midi';
import { TimeSignatures } from '../../dataset/songs/interfaces';
import { BagpipeTypes } from '../../interfaces';
import { midiToRoll } from './midiToRoll';
import { ROLL_TIME_SIGNATURES, rollToMidi } from './melodyRoll';
import { prepareSongMidi } from './prepareSongMidi';

const midiDir = path.join(process.cwd(), 'public', 'midi');

const listMidiFiles = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === 'common' ? [] : listMidiFiles(full);
    return entry.name.toLowerCase().endsWith('.mid') ? [full] : [];
  });

// Made with the test environment's own ArrayBuffer: one from fs fails the instanceof checks of the MIDI libraries
const toArrayBuffer = (file: Buffer) => {
  const buffer = new ArrayBuffer(file.length);
  new Uint8Array(buffer).set(file);
  return buffer;
};

// prepareSongMidi loads the metronome file with fetch
beforeAll(() => {
  (global as any).fetch = async (url: string) => {
    const file = fs.readFileSync(path.join(process.cwd(), 'public', url));
    return { arrayBuffer: async () => toArrayBuffer(file) };
  };
});

// The notes the player plays: the first track with notes after prepareSongMidi
const playedNotes = (midi: Midi) =>
  midi.tracks
    .find((track) => track.notes.length)!
    .notes.map((note) => [note.midi, note.ticks, note.durationTicks])
    .sort((a, b) => a[1] - b[1] || a[0] - b[0]);

describe('midiToRoll', () => {
  const files = listMidiFiles(midiDir);

  it('finds the catalog files', () => {
    expect(files.length).toBeGreaterThan(200);
  });

  // The converted notes must play exactly what the .mid file plays now
  it('keeps every note of every catalog file', async () => {
    const mismatches: string[] = [];
    const failed: string[] = [];
    const warned: string[] = [];
    let converted = 0;

    for (const file of files) {
      const name = path.relative(midiDir, file);
      const buffer = toArrayBuffer(fs.readFileSync(file));
      let header;
      try {
        header = new Midi(buffer).header;
      } catch (error: any) {
        failed.push(`${name}: not a MIDI file (${error.message})`);
        continue;
      }
      const meter = header.timeSignatures[0]?.timeSignature;
      const timeSignature = (meter ? `${meter[0]}/${meter[1]}` : '4/4') as TimeSignatures;
      if (!ROLL_TIME_SIGNATURES.includes(timeSignature)) {
        failed.push(`${name}: meter ${timeSignature}`);
        continue;
      }

      let result;
      try {
        result = midiToRoll(buffer, { bagpipeType: BagpipeTypes.BelarusianTraditionalDuda, timeSignature });
      } catch (error: any) {
        failed.push(`${name}: ${error.message}`);
        continue;
      }
      converted++;
      if (result.warnings.length) warned.push(`${name}: ${result.warnings.join(' ')}`);

      let original;
      try {
        original = await prepareSongMidi(buffer, timeSignature, 200, 100);
      } catch (error: any) {
        throw new Error(`${name} (${timeSignature}): ${error.message}`);
      }
      const { buffer: rollBuffer } = rollToMidi(result.roll, 'test');
      const fromRoll = await prepareSongMidi(rollBuffer, timeSignature, 200, 100, false);

      const expected = playedNotes(original.midi);
      const actual = playedNotes(fromRoll.midi);
      const scale = fromRoll.midi.header.ppq / original.midi.header.ppq;
      const same =
        expected.length === actual.length &&
        expected.every(
          (note, index) =>
            note[0] === actual[index][0] &&
            Math.abs(note[1] * scale - actual[index][1]) <= 1 &&
            // rollToMidi ends each note one tick early
            Math.abs(note[2] * scale - actual[index][2]) <= 3
        );
      if (!same) mismatches.push(name);
    }

    // eslint-disable-next-line no-console
    console.log(
      `converted ${converted} of ${files.length}; not converted:\n${failed.join('\n')}\nwith warnings (${warned.length}):\n${warned.join('\n')}`
    );
    expect(mismatches).toEqual([]);
  }, 120_000);
});
