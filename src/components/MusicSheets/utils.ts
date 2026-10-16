import {
  Accidental,
  Beam,
  BarlineType,
  Dot,
  Formatter,
  GraceNote,
  GraceNoteGroup,
  Renderer,
  Stave,
  StaveNote,
  StaveTie,
  Tuplet,
  Voice,
} from 'vexflow';
import { Sheet, SheetElement, SheetMeasure } from './notation';

const MARGIN_X = 10;
const MAX_MEASURES_PER_LINE = 4;
const MEASURE_PADDING = 16;
const STAFF_HEIGHT = 40; // five lines, 10px apart
const STAVE_TOP_SPACE = 40; // VexFlow puts the top staff line 4 spaces below the stave's y
const LINE_GAP = 16;
const NARROW_SCREEN = 600;
const NARROW_SCALE = 0.75;

// Key signatures by the number of sharps (positive) or flats (negative).
const KEYS: { [key: string]: number } = {
  C: 0,
  G: 1,
  D: 2,
  A: 3,
  E: 4,
  B: 5,
  'F#': 6,
  F: -1,
  Bb: -2,
  Eb: -3,
  Ab: -4,
  Db: -5,
};
// Keys the transposed tonality may come in that are easier to read enharmonically.
const ENHARMONIC_KEYS: { [key: string]: string } = { 'A#': 'Bb', 'D#': 'Eb', 'G#': 'Ab', 'C#': 'Db' };
const SHARP_NAMES = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];
const FLAT_NAMES = ['c', 'db', 'd', 'eb', 'e', 'f', 'gb', 'g', 'ab', 'a', 'bb', 'b'];
const SHARP_ORDER = ['f', 'c', 'g', 'd', 'a', 'e', 'b'];
const FLAT_ORDER = ['b', 'e', 'a', 'd', 'g', 'c', 'f'];

export interface KeyInfo {
  key: string;
  flats: boolean;
  // Accidental the key signature gives each letter ('#', 'b' or '').
  alterations: { [letter: string]: string };
}

export const getKeyInfo = (tonality: string): KeyInfo => {
  const key = ENHARMONIC_KEYS[tonality] || (tonality in KEYS ? tonality : 'C');
  const count = KEYS[key];
  const alterations: { [letter: string]: string } = {};
  SHARP_ORDER.slice(0, Math.max(0, count)).forEach((letter) => (alterations[letter] = '#'));
  FLAT_ORDER.slice(0, Math.max(0, -count)).forEach((letter) => (alterations[letter] = 'b'));
  return { key, flats: count < 0, alterations };
};

const spellMidi = (midi: number, keyInfo: KeyInfo) => {
  const pitchClass = ((midi % 12) + 12) % 12;
  let octave = Math.floor(midi / 12) - 1;
  const sharp = SHARP_NAMES[pitchClass];
  const flat = FLAT_NAMES[pitchClass];
  // Prefer the spelling that the key signature already provides.
  let name = keyInfo.flats ? flat : sharp;
  if (keyInfo.alterations[sharp[0]] === '#' && sharp.length > 1) name = sharp;
  if (keyInfo.alterations[flat[0]] === 'b' && flat.length > 1) name = flat;
  // E# / B# / Cb / Fb in keys with many sharps or flats.
  if (pitchClass === 5 && keyInfo.alterations.e === '#') name = 'e#';
  if (pitchClass === 0 && keyInfo.alterations.b === '#') {
    name = 'b#';
    octave -= 1;
  }
  if (pitchClass === 4 && keyInfo.alterations.f === 'b') name = 'fb';
  if (pitchClass === 11 && keyInfo.alterations.c === 'b') {
    name = 'cb';
    octave += 1;
  }
  return { name, octave };
};

const midiToKey = (midi: number, keyInfo: KeyInfo) => {
  const { name, octave } = spellMidi(midi, keyInfo);
  return `${name}/${octave}`;
};

// Accidental to draw on a note that is not checked against the bar (grace notes).
const accidentalAgainstKey = (midi: number, keyInfo: KeyInfo) => {
  const { name } = spellMidi(midi, keyInfo);
  const accidental = name.slice(1);
  const fromKey = keyInfo.alterations[name[0]] || '';
  if (accidental === fromKey) return undefined;
  return accidental || 'n';
};

interface BuiltMeasure {
  measure: SheetMeasure;
  voice: Voice;
  notes: StaveNote[];
  beams: Beam[];
  tuplets: Tuplet[];
}

const buildMeasure = (measure: SheetMeasure, sheet: Sheet, keyInfo: KeyInfo): BuiltMeasure => {
  const notes = measure.elements.map((element) => createNote(element, measure, keyInfo));

  const tupletGroups = new Map<number, StaveNote[]>();
  measure.elements.forEach((element, i) => {
    if (element.tuplet === undefined) return;
    tupletGroups.set(element.tuplet, [...(tupletGroups.get(element.tuplet) || []), notes[i]]);
  });
  const tuplets = Array.from(tupletGroups.values()).map((group) => {
    // Six triplet 1/16s read better as a sextuplet.
    const isSextuplet = group.length === 6 && group.every((note) => note.getDuration() === '16');
    return new Tuplet(group, { numNotes: isSextuplet ? 6 : 3, notesOccupied: isSextuplet ? 4 : 2, ratioed: false });
  });

  const voice = new Voice({ numBeats: sheet.numBeats, beatValue: sheet.beatValue }).setMode(Voice.Mode.SOFT);
  voice.addTickables(notes);
  Accidental.applyAccidentals([voice], keyInfo.key);

  const beams = Beam.generateBeams(notes, { groups: Beam.getDefaultBeamGroups(sheet.timeSignature) });
  return { measure, voice, notes, beams, tuplets };
};

const createNote = (element: SheetElement, measure: SheetMeasure, keyInfo: KeyInfo) => {
  const isWholeBarRest = element.kind === 'rest' && element.length === measure.length && measure.elements.length === 1;
  const note = new StaveNote({
    keys: [element.kind === 'rest' ? (isWholeBarRest ? 'd/5' : 'b/4') : midiToKey(element.midi, keyInfo)],
    duration: element.value.dur + (element.kind === 'rest' ? 'r' : ''),
    dots: element.value.dots,
    alignCenter: isWholeBarRest,
    autoStem: true,
  });
  if (element.value.dots) Dot.buildAndAttach([note], { all: true });

  if (element.graces.length) {
    const graces = element.graces.map((midi) => {
      const grace = new GraceNote({
        keys: [midiToKey(midi, keyInfo)],
        duration: element.graces.length > 1 ? '16' : '8',
        slash: element.graces.length === 1,
      });
      const accidental = accidentalAgainstKey(midi, keyInfo);
      if (accidental) grace.addModifier(new Accidental(accidental), 0);
      return grace;
    });
    const group = new GraceNoteGroup(graces, false);
    if (graces.length > 1) group.beamNotes();
    note.addModifier(group, 0);
  }
  return note;
};

const measureMinWidth = (built: BuiltMeasure) => {
  const formatter = new Formatter();
  formatter.joinVoices([built.voice]);
  return formatter.preCalculateMinTotalWidth([built.voice]) + MEASURE_PADDING;
};

const headerWidth = (keyInfo: KeyInfo, timeSignature?: string) => {
  const stave = new Stave(0, 0, 500).addClef('treble').addKeySignature(keyInfo.key);
  if (timeSignature) stave.addTimeSignature(timeSignature);
  return stave.getNoteStartX();
};

// Rough height a line needs above and below the staff for its highest and lowest notes.
const diatonicSteps = (midi: number) => Math.round(((midi - 64) * 7) / 12); // 0 = E4, the bottom line
const lineExtents = (measures: SheetMeasure[]) => {
  const pitches = measures.flatMap((m) =>
    m.elements.flatMap((e) => (e.kind === 'note' ? [e.midi, ...e.graces] : []))
  );
  if (!pitches.length) return { above: 30, below: 30 };
  const highest = diatonicSteps(Math.max(...pitches));
  const lowest = diatonicSteps(Math.min(...pitches));
  return {
    above: Math.max(30, (highest - 8) * 5 + 35),
    below: Math.max(30, -lowest * 5 + 35),
  };
};

export interface RenderedNote {
  start: number;
  end: number;
  sourceIndex?: number;
  element: SVGElement | undefined;
  line: number;
}

export interface RenderedSheet {
  notes: RenderedNote[]; // played notes, in time order
  lineTops: number[];
  height: number;
}

export const renderSheet = (
  container: HTMLDivElement,
  sheet: Sheet,
  keyInfo: KeyInfo,
  width: number
): RenderedSheet => {
  container.innerHTML = '';
  const renderer = new Renderer(container, Renderer.Backends.SVG);
  const context = renderer.getContext();
  // Draw smaller on phones so a line still holds a couple of bars.
  const scale = width < NARROW_SCREEN ? NARROW_SCALE : 1;
  const layoutWidth = width / scale;

  const built = sheet.measures.map((measure) => buildMeasure(measure, sheet, keyInfo));
  const minWidths = built.map(measureMinWidth);
  const lineHeader = headerWidth(keyInfo);
  const firstHeader = headerWidth(keyInfo, sheet.timeSignature);
  const available = Math.max(200, layoutWidth - 2 * MARGIN_X);

  // Greedily pack bars into lines.
  const lines: number[][] = [];
  let current: number[] = [];
  let used = 0;
  minWidths.forEach((minWidth, i) => {
    const header = lines.length === 0 ? firstHeader : lineHeader;
    const fits = current.length < MAX_MEASURES_PER_LINE && header + used + minWidth <= available;
    if (current.length && !fits) {
      lines.push(current);
      current = [];
      used = 0;
    }
    current.push(i);
    used += minWidth;
  });
  if (current.length) lines.push(current);

  // Draw each line, stretched to the full width (the last line only if it is mostly full).
  const staveByMeasure: Stave[] = [];
  const lineTops: number[] = [];
  let cursorY = 10;
  lines.forEach((line, lineIndex) => {
    const header = lineIndex === 0 ? firstHeader : lineHeader;
    const natural = line.reduce((sum, i) => sum + minWidths[i], 0);
    const isLast = lineIndex === lines.length - 1;
    const stretch =
      isLast && natural + header < available * 0.7 ? 1 : (available - header) / Math.max(natural, 1);
    const { above, below } = lineExtents(line.map((i) => sheet.measures[i]));
    const staveY = cursorY + above - STAVE_TOP_SPACE;
    lineTops.push(cursorY);

    let x = MARGIN_X;
    line.forEach((measureIndex, positionInLine) => {
      const isFirstInLine = positionInLine === 0;
      const staveWidth = minWidths[measureIndex] * stretch + (isFirstInLine ? header : 0);
      const stave = new Stave(x, staveY, staveWidth);
      if (isFirstInLine) {
        stave.addClef('treble').addKeySignature(keyInfo.key);
        if (lineIndex === 0) stave.addTimeSignature(sheet.timeSignature);
        else stave.setMeasure(measureIndex + 1);
      }
      if (measureIndex === sheet.measures.length - 1) stave.setEndBarType(BarlineType.END);
      stave.setContext(context);
      staveByMeasure[measureIndex] = stave;
      x += staveWidth;
    });

    cursorY = staveY + STAVE_TOP_SPACE + STAFF_HEIGHT + below + LINE_GAP;
  });

  renderer.resize(width, cursorY * scale);
  context.scale(scale, scale);
  staveByMeasure.forEach((stave) => stave.draw());

  const rendered: RenderedNote[] = [];
  built.forEach((measure, measureIndex) => {
    const stave = staveByMeasure[measureIndex];
    new Formatter().joinVoices([measure.voice]).formatToStave([measure.voice], stave);
    measure.voice.draw(context, stave);
    measure.beams.forEach((beam) => beam.setContext(context).draw());
    measure.tuplets.forEach((tuplet) => tuplet.setContext(context).draw());

    const line = lines.findIndex((l) => l.includes(measureIndex));
    measure.measure.elements.forEach((element, i) => {
      if (element.kind !== 'note') return;
      rendered.push({
        start: element.start,
        end: element.start + element.length,
        sourceIndex: element.sourceIndex,
        element: measure.notes[i].getSVGElement(),
        line,
      });
    });
  });

  // Ties, including ones that run from the end of one line to the start of the next.
  const flat = built.flatMap((measure, measureIndex) =>
    measure.notes.map((note, i) => ({ note, element: measure.measure.elements[i], measureIndex }))
  );
  const lineOf = (measureIndex: number) => lines.findIndex((l) => l.includes(measureIndex));
  flat.forEach((item, i) => {
    const next = flat[i + 1];
    if (!item.element.tieToNext || !next) return;
    if (lineOf(item.measureIndex) === lineOf(next.measureIndex)) {
      new StaveTie({ firstNote: item.note, lastNote: next.note, firstIndexes: [0], lastIndexes: [0] })
        .setContext(context)
        .draw();
    } else {
      new StaveTie({ firstNote: item.note, firstIndexes: [0] }).setContext(context).draw();
      new StaveTie({ lastNote: next.note, lastIndexes: [0] }).setContext(context).draw();
    }
  });

  return { notes: rendered, lineTops: lineTops.map((top) => top * scale), height: cursorY * scale };
};

// Index of the note sounding at `tick` (normalised ticks), or -1 during a rest.
export const findNoteAt = (notes: RenderedNote[], tick: number) => {
  let low = 0;
  let high = notes.length - 1;
  let found = -1;
  while (low <= high) {
    const mid = (low + high) >> 1;
    if (notes[mid].start <= tick) {
      found = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return found !== -1 && tick < notes[found].end ? found : -1;
};
