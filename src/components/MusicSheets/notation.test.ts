import { buildSheet, MidiNoteLike } from './notation';

const n = (midi: number, ticks: number, durationTicks: number): MidiNoteLike => ({ midi, ticks, durationTicks });

const describeMeasure = (elements: ReturnType<typeof buildSheet>['measures'][number]['elements']) =>
  elements
    .map(
      (e) =>
        (e.graces.length ? `{${e.graces.join(',')}}` : '') +
        (e.kind === 'rest' ? 'r' : e.midi) +
        ':' +
        e.value.dur +
        '.'.repeat(e.value.dots) +
        (e.tuplet !== undefined ? '³' : '') +
        (e.tieToNext ? '~' : '')
    )
    .join(' ');

describe('buildSheet', () => {
  it('splits a melody into bars and ties notes over the barline', () => {
    const sheet = buildSheet([n(69, 0, 960), n(71, 960, 1440), n(73, 2400, 1440)], 480, '4/4');
    expect(sheet.measures.map((m) => describeMeasure(m.elements))).toEqual(['69:h 71:h~', '71:q 73:h.']);
  });

  it('snaps sloppy timing to the grid and closes small gaps', () => {
    const sheet = buildSheet([n(69, 3, 220), n(71, 236, 230), n(73, 482, 400), n(74, 960, 940)], 480, '4/4');
    expect(describeMeasure(sheet.measures[0].elements)).toBe('69:8 71:8 73:q 74:h');
  });

  it('fills gaps and the end of the last bar with rests', () => {
    const sheet = buildSheet([n(69, 0, 480), n(71, 960, 480)], 480, '3/4');
    expect(describeMeasure(sheet.measures[0].elements)).toBe('69:q r:q 71:q');
    const pickup = buildSheet([n(69, 960, 480)], 480, '4/4');
    expect(describeMeasure(pickup.measures[0].elements)).toBe('r:h 69:q r:q');
  });

  it('turns very short ornament notes into grace notes', () => {
    const sheet = buildSheet([n(76, 0, 20), n(74, 20, 20), n(69, 40, 440), n(71, 480, 1440)], 480, '4/4');
    expect(describeMeasure(sheet.measures[0].elements)).toBe('{76,74}69:q 71:h.');
  });

  it('writes triplets as 3:2 groups', () => {
    const sheet = buildSheet([n(69, 0, 160), n(71, 160, 160), n(73, 320, 160), n(74, 480, 1440)], 480, '4/4');
    expect(describeMeasure(sheet.measures[0].elements)).toBe('69:8³ 71:8³ 73:8³ 74:h.');
  });

  it('uses the time signature for bar length and beat grouping', () => {
    const jig = buildSheet([n(69, 0, 480), n(71, 480, 240), n(73, 720, 720)], 480, '6/8');
    expect(describeMeasure(jig.measures[0].elements)).toBe('69:q 71:8 73:q.');
    const balkan = buildSheet([n(69, 0, 480), n(71, 480, 480), n(73, 960, 720)], 480, '7/8');
    expect(describeMeasure(balkan.measures[0].elements)).toBe('69:q 71:q 73:q.');
  });

  it('normalises files with a different ppq', () => {
    const sheet = buildSheet([n(69, 0, 96), n(71, 96, 96)], 96, '2/4');
    expect(describeMeasure(sheet.measures[0].elements)).toBe('69:q 71:q');
  });
});
