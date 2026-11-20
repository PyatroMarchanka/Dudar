import { BagpipeTypes } from '../../interfaces';
import { cleanSegments, recognizeNotes } from './recognize';
import { quantizeNotes } from './quantize';

const RATE = 44100;

// A bagpipe-like test signal: a drone on the tonic below the chanter, and the
// chanter's notes with several harmonics, a little sharp of A = 440
const render = (
  notes: { midi: number; start: number; end: number }[],
  { length, cents = 0, drone = 45 + 12, noise = 0 }: { length: number; cents?: number; drone?: number; noise?: number }
) => {
  const samples = new Float32Array(Math.round(length * RATE));
  // Repeatable noise (room, mic)
  let seed = 1;
  const random = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;
  const hz = (midi: number) => 440 * Math.pow(2, (midi + cents / 100 - 69) / 12);
  const droneHz = hz(drone);
  for (let i = 0; i < samples.length; i++) {
    const t = i / RATE;
    let value = 0;
    [1, 0.6, 0.5, 0.3, 0.2].forEach((amp, h) => (value += 0.25 * amp * Math.sin(2 * Math.PI * droneHz * (h + 1) * t)));
    samples[i] = value + noise * random();
  }
  notes.forEach(({ midi, start, end }) => {
    const f = hz(midi);
    for (let i = Math.round(start * RATE); i < Math.min(samples.length, Math.round(end * RATE)); i++) {
      const t = i / RATE;
      [0.8, 1, 0.6, 0.4, 0.3, 0.2].forEach(
        (amp, h) => (samples[i] += 0.4 * amp * Math.sin(2 * Math.PI * f * (h + 1) * t))
      );
    }
  });
  return samples;
};

describe('recognizeNotes', () => {
  it('finds a melody over a drone, splits repeated notes at grace notes and puts it on the grid', async () => {
    const bpm = 100;
    const quarter = 60 / bpm;
    const first = 0.5;
    // [midi, start in quarters, length in quarters], written in A; the pipe plays it 1 semitone up (B flat)
    const melody: [number, number, number][] = [
      [69, 0, 1],
      [71, 1, 0.5],
      [73, 1.5, 0.5],
      [74, 2, 1],
      [69, 3, 0.5],
      [69, 3.5, 0.5],
      [76, 4, 2],
      [73, 6, 1],
      [71, 7, 1],
    ];
    const keyTranspose = 1;
    const jitter = [0.01, -0.015, 0.02, 0, -0.01, 0.015, -0.02, 0.01, 0];
    const notes = melody.map(([midi, start, length], i) => ({
      midi: midi + keyTranspose,
      start: first + start * quarter + jitter[i],
      end: first + (start + length) * quarter + (jitter[i + 1] ?? 0),
    }));
    // A 30 ms E5 grace note between the two A4s
    const graceAt = notes[5].start;
    notes[4].end = graceAt - 0.03;
    notes.push({ midi: 76 + keyTranspose, start: graceAt - 0.03, end: graceAt });

    const audio = render(notes, {
      length: first + 8 * quarter + 0.5,
      cents: 25,
      drone: 57 + keyTranspose,
      noise: 0.15,
    });
    const result = await recognizeNotes(audio, RATE, {
      bagpipeType: BagpipeTypes.BelarusianTraditionalDuda,
      transpose: 0,
    });

    expect(result.keyTranspose).toBe(keyTranspose);
    expect(result.tuningOffset).toBeCloseTo(0.25, 1);
    expect(result.fit).toBeGreaterThan(0.9);
    expect(result.ornaments).toBe(1);
    expect(result.notes.map((note) => note.pitch)).toEqual(melody.map(([midi]) => midi));

    const roll = quantizeNotes(result.notes, {
      bagpipeType: BagpipeTypes.BelarusianTraditionalDuda,
      timeSignature: '4/4',
      bpm,
      gridTicks: 240,
      keyTranspose: result.keyTranspose,
    });
    expect(roll.notes).toEqual(melody.map(([midi, start, length]) => [midi, start * 480, length * 480]));
    expect(roll.bars).toBe(2);
    expect(roll.tonic).toBe(10);
  });

  it('returns nothing for silence', async () => {
    const result = await recognizeNotes(new Float32Array(RATE), RATE, {
      bagpipeType: BagpipeTypes.Highlander,
      transpose: 0,
    });
    expect(result.notes).toEqual([]);
  });
});

describe('cleanSegments', () => {
  it('gives an ornament to the note after it', () => {
    const { notes, ornaments } = cleanSegments(
      [
        { pitch: 69, start: 0, end: 0.5 },
        { pitch: 79, start: 0.5, end: 0.53 },
        { pitch: 71, start: 0.53, end: 1 },
      ],
      0.06
    );
    expect(ornaments).toBe(1);
    expect(notes).toEqual([
      { pitch: 69, start: 0, end: 0.5 },
      { pitch: 71, start: 0.5, end: 1 },
    ]);
  });

  it('keeps notes apart across a short break and drops long silences', () => {
    const { notes } = cleanSegments(
      [
        { pitch: 69, start: 0, end: 0.5 },
        { pitch: null, start: 0.5, end: 0.55 },
        { pitch: 69, start: 0.55, end: 1 },
        { pitch: null, start: 1, end: 2 },
        { pitch: 71, start: 2, end: 2.5 },
      ],
      0.06
    );
    expect(notes).toEqual([
      { pitch: 69, start: 0, end: 0.55 },
      { pitch: 69, start: 0.55, end: 1 },
      { pitch: 71, start: 2, end: 2.5 },
    ]);
  });
});

describe('recognizeNotes on a Highland pipe', () => {
  it('finds the key of a pipe tuned well above A = 440', async () => {
    // GHB written G4 A4 B4 C#5 A4; the pipe sounds about 1.3 semitones sharp of written
    const melody = [67, 69, 71, 73, 69];
    const notes = melody.map((midi, i) => ({ midi: midi + 1, start: 0.3 + i * 0.4, end: 0.3 + (i + 1) * 0.4 }));
    const audio = render(notes, { length: 2.6, cents: 30, drone: 57 + 1 - 12, noise: 0.1 });
    const result = await recognizeNotes(audio, RATE, { bagpipeType: BagpipeTypes.Highlander, transpose: 0 });
    expect(result.keyTranspose).toBe(1);
    expect(result.notes.map((note) => note.pitch)).toEqual(melody);
  });
});

describe('quantizeNotes', () => {
  const options = {
    bagpipeType: BagpipeTypes.BelarusianTraditionalDuda,
    timeSignature: '4/4' as const,
    bpm: 60,
    gridTicks: 120,
    keyTranspose: 0,
  };

  it('starts bar 1 with the first clear note, fills rests and keeps notes on the beat', () => {
    // At 60 bpm a quarter is 1 s. A 0.05 s blip first, then the melody starts
    // at 2.37 s (mid-bar for the metronome), with a rest after the second note
    // and starts up to 0.09 s off.
    const roll = quantizeNotes(
      [
        { pitch: 76, start: 2.2, end: 2.25 },
        { pitch: 69, start: 2.37, end: 3.3 },
        { pitch: 71, start: 3.4, end: 3.7 },
        // a rest from 3.7 to 3.9
        { pitch: 73, start: 3.9, end: 4.45 },
        { pitch: 74, start: 4.46, end: 5.38 },
        { pitch: 69, start: 5.36, end: 7.3 },
      ],
      options
    );
    expect(roll.notes).toEqual([
      [69, 0, 480],
      // The rest after it is filled
      [71, 480, 240],
      [73, 720, 240],
      [74, 960, 480],
      [69, 1440, 960],
    ]);
    expect(roll.bars).toBe(2);
  });

  it('keeps a clearly played sixteenth', () => {
    const roll = quantizeNotes(
      [
        { pitch: 69, start: 0, end: 0.75 },
        { pitch: 71, start: 0.75, end: 1 },
        { pitch: 73, start: 1, end: 2 },
      ],
      options
    );
    expect(roll.notes).toEqual([
      [69, 0, 360],
      [71, 360, 120],
      [73, 480, 480],
    ]);
  });
});
