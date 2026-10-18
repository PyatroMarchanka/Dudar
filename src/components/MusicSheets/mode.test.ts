import { detectMode, signatureTonic } from './mode';

const melody = (pitches: number[]) => pitches.map((midi, index) => ({ midi, ticks: index * 480, durationTicks: 480 }));

describe('detectMode', () => {
  const A = 9;

  it('finds minor when the melody uses the minor third', () => {
    expect(detectMode(melody([69, 71, 72, 74, 76, 72, 69]), A)).toBe('minor');
  });

  it('finds major when the melody uses the major third', () => {
    expect(detectMode(melody([69, 71, 73, 74, 76, 73, 69]), A)).toBe('major');
  });

  it('weights the thirds by duration', () => {
    const notes = [
      { midi: 72, ticks: 0, durationTicks: 1920 },
      { midi: 73, ticks: 1920, durationTicks: 120 },
    ];
    expect(detectMode(notes, A)).toBe('minor');
  });

  it('falls back to the sixth without a third and to major without either', () => {
    expect(detectMode(melody([69, 71, 74, 77, 76]), A)).toBe('minor');
    expect(detectMode(melody([69, 71, 74, 76]), A)).toBe('major');
  });
});

describe('signatureTonic', () => {
  it('uses the relative major for minor keys', () => {
    expect(signatureTonic('A', 'minor')).toBe('C');
    expect(signatureTonic('B', 'minor')).toBe('D');
    expect(signatureTonic('A', 'major')).toBe('A');
  });
});
