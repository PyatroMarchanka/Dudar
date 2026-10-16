// Turns a performed MIDI melody into something that can be engraved as a
// conventional score: onsets are snapped to a grid, notes are split into bars
// (with ties across barlines and beats), gaps become rests, and very short
// ornament notes become grace notes.
//
// Everything here works in a normalised timeline of TICKS_PER_QUARTER ticks per
// quarter note, whatever the source file's ppq is.

export const TICKS_PER_QUARTER = 480;

const BEAT = TICKS_PER_QUARTER;
// Notes this short (a bit under a 1/32) are ornaments, not melody notes.
const GRACE_MAX_TICKS = 50;
// Onsets are snapped per beat to one of these grids (ticks).
const GRID_SIXTEENTH = 120;
const GRID_THIRTY_SECOND = 60;
const GRID_TRIPLET = 80; // 1/16 triplet, so 1/8 triplets fit too
// Main notes shorter than this ask for the 1/32 grid in their beat.
const SHORT_NOTE_TICKS = 90;

export interface MidiNoteLike {
  midi: number;
  ticks: number;
  durationTicks: number;
}

export interface NoteValue {
  dur: string; // VexFlow duration: w, h, q, 8, 16, 32
  dots: number;
}

export interface SheetElement {
  kind: 'note' | 'rest';
  midi: number; // unused for rests
  start: number; // absolute, normalised ticks
  length: number; // real length in normalised ticks
  value: NoteValue;
  tieToNext: boolean;
  // Elements that share a tuplet id (the beat they are in) form one triplet (3:2) group.
  tuplet?: number;
  graces: number[];
  // Index of the source note (in the melody note list) this element plays.
  sourceIndex?: number;
}

export interface SheetMeasure {
  start: number;
  length: number;
  elements: SheetElement[];
}

export interface Sheet {
  measures: SheetMeasure[];
  numBeats: number;
  beatValue: number;
  timeSignature: string;
}

interface Segment {
  kind: 'note' | 'rest';
  midi: number;
  start: number;
  end: number;
  graces: number[];
  sourceIndex?: number;
}

const STRAIGHT_VALUES: [number, NoteValue][] = [
  [1920, { dur: 'w', dots: 0 }],
  [1440, { dur: 'h', dots: 1 }],
  [960, { dur: 'h', dots: 0 }],
  [720, { dur: 'q', dots: 1 }],
  [480, { dur: 'q', dots: 0 }],
  [360, { dur: '8', dots: 1 }],
  [240, { dur: '8', dots: 0 }],
  [180, { dur: '16', dots: 1 }],
  [120, { dur: '16', dots: 0 }],
  [60, { dur: '32', dots: 0 }],
];

// Values inside a 3:2 triplet beat, in real ticks (the written value is 3/2 longer).
const TRIPLET_VALUES: [number, NoteValue][] = [
  [480, { dur: 'q', dots: 1 }],
  [320, { dur: 'q', dots: 0 }],
  [240, { dur: '8', dots: 1 }],
  [160, { dur: '8', dots: 0 }],
  [80, { dur: '16', dots: 0 }],
];

export const parseTimeSignature = (timeSignature: string | undefined) => {
  const [num, den] = (timeSignature || '4/4').split('/').map(Number);
  if (!num || !den || ![2, 4, 8, 16].includes(den)) {
    return { numBeats: 4, beatValue: 4 };
  }
  return { numBeats: num, beatValue: den };
};

export const getMeasureTicks = (numBeats: number, beatValue: number) => (numBeats * 4 * BEAT) / beatValue;

// The span a note may not cross unless it starts on it: the beat for simple
// meters, the dotted quarter for compound ones and the eighth for odd x/8 meters.
const getNotationBeat = (numBeats: number, beatValue: number) => {
  if (beatValue === 8) {
    return numBeats % 3 === 0 ? BEAT * 1.5 : BEAT / 2;
  }
  return (4 * BEAT) / beatValue;
};

const snap = (value: number, origin: number, grid: number) => origin + Math.round((value - origin) / grid) * grid;

const chooseGrid = (onsets: number[], durations: number[], beatStart: number) => {
  const candidates = [GRID_SIXTEENTH, GRID_TRIPLET];
  if (durations.some((duration) => duration < SHORT_NOTE_TICKS)) {
    candidates.push(GRID_THIRTY_SECOND);
  }
  let best = GRID_SIXTEENTH;
  let bestError = Infinity;
  candidates.forEach((grid) => {
    const error = onsets.reduce((sum, onset) => sum + Math.abs(onset - snap(onset, beatStart, grid)), 0);
    // Only switch away from plain 1/16s when another grid is clearly better.
    if (error + (grid === GRID_SIXTEENTH ? 0 : 10) < bestError) {
      best = grid;
      bestError = error + (grid === GRID_SIXTEENTH ? 0 : 10);
    }
  });
  return best;
};

const extractGraces = (notes: MidiNoteLike[]) => {
  const main: { note: MidiNoteLike; index: number; graces: number[] }[] = [];
  let pendingGraces: number[] = [];
  notes.forEach((note, index) => {
    const next = notes[index + 1];
    const isOrnament =
      note.durationTicks <= GRACE_MAX_TICKS &&
      !!next &&
      next.ticks - (note.ticks + note.durationTicks) <= GRACE_MAX_TICKS;
    if (isOrnament) {
      pendingGraces.push(note.midi);
      return;
    }
    main.push({ note, index, graces: pendingGraces });
    pendingGraces = [];
  });
  return main;
};

// Snaps the melody onto a grid and returns a gapless list of note and rest
// segments starting at tick 0.
export const quantizeMelody = (
  sourceNotes: MidiNoteLike[],
  ppq: number
): { segments: Segment[]; tripletBeats: Set<number> } => {
  const scale = TICKS_PER_QUARTER / (ppq || TICKS_PER_QUARTER);
  const notes = sourceNotes
    .map((note) => ({
      midi: note.midi,
      ticks: Math.round(note.ticks * scale),
      durationTicks: Math.max(1, Math.round(note.durationTicks * scale)),
    }))
    .sort((a, b) => a.ticks - b.ticks || b.durationTicks - a.durationTicks)
    // A melody plays one note at a time; drop doubled notes on the same onset.
    .filter((note, index, all) => index === 0 || note.ticks !== all[index - 1].ticks);

  const main = extractGraces(notes);

  // Pick a grid for each beat from the onsets that fall in it.
  const beatOf = (tick: number) => Math.floor((tick + GRID_THIRTY_SECOND / 2) / BEAT);
  const beatData = new Map<number, { onsets: number[]; durations: number[] }>();
  main.forEach(({ note }) => {
    const beat = beatOf(note.ticks);
    const data = beatData.get(beat) || { onsets: [], durations: [] };
    data.onsets.push(note.ticks);
    data.durations.push(note.durationTicks);
    beatData.set(beat, data);
  });
  const grids = new Map<number, number>();
  beatData.forEach((data, beat) => grids.set(beat, chooseGrid(data.onsets, data.durations, beat * BEAT)));
  const gridAt = (tick: number) => grids.get(beatOf(tick)) || GRID_SIXTEENTH;
  const quantize = (tick: number) => {
    const beat = beatOf(tick);
    return Math.max(0, snap(tick, beat * BEAT, gridAt(tick)));
  };

  // Snap onsets. Two notes landing on the same onset: the earlier one becomes a grace note.
  const placed: { midi: number; start: number; rawEnd: number; graces: number[]; index: number }[] = [];
  main.forEach(({ note, index, graces }) => {
    const start = quantize(note.ticks);
    const previous = placed[placed.length - 1];
    if (previous && previous.start >= start) {
      placed.pop();
      graces = [...previous.graces, previous.midi, ...graces];
    }
    placed.push({ midi: note.midi, start, rawEnd: note.ticks + note.durationTicks, graces, index });
  });

  const segments: Segment[] = [];
  let cursor = 0;
  placed.forEach((note, i) => {
    const nextStart = placed[i + 1]?.start;
    let end = quantize(note.rawEnd);
    if (nextStart !== undefined) {
      end = Math.min(end, nextStart);
      // Close articulation gaps (bagpipes play legato): anything under the grid step
      // or under a quarter of the note's length is not a rest.
      if (nextStart - end < gridAt(end) || nextStart - note.rawEnd <= (nextStart - note.start) / 4) {
        end = nextStart;
      }
    }
    if (end <= note.start) {
      end = nextStart !== undefined ? nextStart : note.start + gridAt(note.start);
    }
    if (note.start > cursor) {
      segments.push({ kind: 'rest', midi: 0, start: cursor, end: note.start, graces: [] });
    }
    segments.push({
      kind: 'note',
      midi: note.midi,
      start: note.start,
      end,
      graces: note.graces,
      sourceIndex: note.index,
    });
    cursor = end;
  });

  const tripletBeats = new Set<number>();
  grids.forEach((grid, beat) => {
    if (grid === GRID_TRIPLET) tripletBeats.add(beat);
  });
  return { segments, tripletBeats };
};

const pickValue = (table: [number, NoteValue][], length: number) => table.find(([ticks]) => ticks <= length);

// Splits one segment (already inside one measure) into notated values.
const notateSegment = (
  segment: Segment,
  measureStart: number,
  notationBeat: number,
  syncopationGroup: number,
  tripletBeats: Set<number>
): SheetElement[] => {
  const elements: SheetElement[] = [];
  let position = segment.start;

  while (position < segment.end) {
    const beat = Math.floor(position / BEAT);
    const beatEnd = (beat + 1) * BEAT;
    let length: number;
    let value: NoteValue;
    let tupletId: number | undefined;

    if (tripletBeats.has(beat) && !(position === beat * BEAT && segment.end >= beatEnd)) {
      const entry = pickValue(TRIPLET_VALUES, Math.min(segment.end, beatEnd) - position);
      if (!entry) break;
      [length, value] = entry;
      tupletId = beat;
    } else {
      const relative = position - measureStart;
      const onBeat = relative % notationBeat === 0;
      const nextBeat = measureStart + (Math.floor(relative / notationBeat) + 1) * notationBeat;
      const from = position;
      let end = segment.end;
      // Never run a plain value into a triplet beat.
      for (let b = beat + 1; b * BEAT < end; b++) {
        if (tripletBeats.has(b)) {
          end = b * BEAT;
          break;
        }
      }
      let entry: [number, NoteValue] | undefined;
      if (onBeat) {
        // A rest longer than a beat fills whole beats and starts on a multiple of its own
        // length, so 4/4 gets a half rest on beat 3 but never on beat 2.
        entry =
          segment.kind === 'rest'
            ? STRAIGHT_VALUES.find(
                ([ticks]) =>
                  ticks <= end - from &&
                  (ticks <= notationBeat || (ticks % notationBeat === 0 && relative % ticks === 0))
              )
            : pickValue(STRAIGHT_VALUES, end - position);
      } else {
        // Off the beat a note stops at the next beat, except the usual 8-q-8 style
        // syncopation inside one half of a 2/4, 4/4 or 6/4 bar.
        if (segment.kind === 'note' && syncopationGroup) {
          const groupEnd = measureStart + (Math.floor(relative / syncopationGroup) + 1) * syncopationGroup;
          entry = STRAIGHT_VALUES.find(
            ([ticks, v]) =>
              v.dots === 0 &&
              from + ticks > nextBeat &&
              from + ticks <= Math.min(end, groupEnd) &&
              relative % (ticks / 2) === 0
          );
        }
        entry = entry || pickValue(STRAIGHT_VALUES, Math.min(end, nextBeat) - position);
      }
      if (!entry) break;
      [length, value] = entry;
    }

    elements.push({
      kind: segment.kind,
      midi: segment.midi,
      start: position,
      length,
      value,
      tieToNext: false,
      tuplet: tupletId,
      graces: elements.length === 0 ? segment.graces : [],
      sourceIndex: segment.sourceIndex,
    });
    position += length;
  }

  if (segment.kind === 'note') {
    elements.slice(0, -1).forEach((element) => (element.tieToNext = true));
  }
  return elements;
};

export const buildSheet = (notes: MidiNoteLike[], ppq: number, timeSignature: string | undefined): Sheet => {
  const { numBeats, beatValue } = parseTimeSignature(timeSignature);
  const measureTicks = getMeasureTicks(numBeats, beatValue);
  const notationBeat = getNotationBeat(numBeats, beatValue);
  const syncopationGroup = beatValue === 4 && numBeats % 2 === 0 ? 2 * notationBeat : 0;
  const { segments, tripletBeats } = quantizeMelody(notes, ppq);

  const songEnd = segments.length ? segments[segments.length - 1].end : 0;
  const measureCount = Math.max(1, Math.ceil(songEnd / measureTicks));
  // Fill the last bar with a rest so every bar is complete.
  if (measureCount * measureTicks > songEnd) {
    segments.push({ kind: 'rest', midi: 0, start: songEnd, end: measureCount * measureTicks, graces: [] });
  }

  const measures: SheetMeasure[] = Array.from({ length: measureCount }, (_, i) => ({
    start: i * measureTicks,
    length: measureTicks,
    elements: [],
  }));

  segments.forEach((segment) => {
    let start = segment.start;
    let graces = segment.graces;
    while (start < segment.end) {
      const measureIndex = Math.floor(start / measureTicks);
      const measure = measures[measureIndex];
      const end = Math.min(segment.end, measure.start + measureTicks);
      const elements = notateSegment(
        { ...segment, start, end, graces },
        measure.start,
        notationBeat,
        syncopationGroup,
        tripletBeats
      );
      if (!elements.length) break;
      const previous = measure.elements.length
        ? measure.elements[measure.elements.length - 1]
        : measures[measureIndex - 1]?.elements.slice(-1)[0];
      if (segment.kind === 'note' && start > segment.start && previous) previous.tieToNext = true;
      measure.elements.push(...elements);
      graces = [];
      start = end;
    }
  });

  // A bar that is only rests gets a single whole-bar rest.
  measures.forEach((measure) => {
    if (measure.elements.every((element) => element.kind === 'rest')) {
      measure.elements = [
        {
          kind: 'rest',
          midi: 0,
          start: measure.start,
          length: measureTicks,
          value: { dur: 'w', dots: 0 },
          tieToNext: false,
          graces: [],
        },
      ];
    }
  });

  return { measures, numBeats, beatValue, timeSignature: `${numBeats}/${beatValue}` };
};
