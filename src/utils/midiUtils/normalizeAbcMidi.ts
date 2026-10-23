import { MidiData, MidiEvent, parseMidi, writeMidi } from "midi-file";
import { Buffer } from "buffer";

// abcjs writes MIDI a little differently from the catalog files the player
// was built around, so it's reshaped to match them:
// - No tempo event. Catalog files have none; the player takes the tempo from
//   the app's tempo setting. A tempo event inside the file overrides that
//   setting at tick 0 and restarts the player's clock.
// - A one tick gap after each note. Catalog notes end one tick before the next
//   one starts, while abcjs ends a note on the very tick the next begins.
const GAP_TICKS = 1;

type TimedEvent = { event: MidiEvent; tick: number; order: number };

const isNoteOff = (event: MidiEvent) =>
  event.type === "noteOff" || (event.type === "noteOn" && event.velocity === 0);

export interface NormalizedAbcMidi {
  buffer: Buffer;
  // Quarter notes per minute the tune was written for, from the removed tempo event
  bpm: number | undefined;
}

export const normalizeAbcMidi = (midiBuffer: Buffer): NormalizedAbcMidi => {
  const midi: MidiData = parseMidi(midiBuffer);
  let microsecondsPerBeat: number | undefined;

  const tracks = midi.tracks.map((track) => {
    let tick = 0;
    const timed: TimedEvent[] = [];
    track.forEach((event, order) => {
      tick += event.deltaTime;
      if (event.type === "setTempo") {
        microsecondsPerBeat = microsecondsPerBeat ?? event.microsecondsPerBeat;
        return;
      }
      timed.push({ event, tick, order });
    });

    const startedAt = new Map<string, number>();
    timed.forEach((item) => {
      const { event } = item;
      if (event.type !== "noteOn" && event.type !== "noteOff") return;
      const key = `${event.channel}:${event.noteNumber}`;
      if (!isNoteOff(event)) {
        startedAt.set(key, item.tick);
      } else {
        const start = startedAt.get(key);
        startedAt.delete(key);
        if (start !== undefined && item.tick - start > GAP_TICKS) {
          item.tick -= GAP_TICKS;
        }
      }
    });

    // The end of track marker has to stay last
    const end = timed.filter((item) => item.event.type === "endOfTrack");
    const rest = timed
      .filter((item) => item.event.type !== "endOfTrack")
      .sort((a, b) => a.tick - b.tick || a.order - b.order);
    const lastTick = rest.length ? rest[rest.length - 1].tick : 0;

    let previous = 0;
    return [...rest, ...end].map(({ event, tick: eventTick }) => {
      const at = Math.max(eventTick, previous, event.type === "endOfTrack" ? lastTick : 0);
      const deltaTime = at - previous;
      previous = at;
      return { ...event, deltaTime } as MidiEvent;
    });
  });

  return {
    buffer: Buffer.from(writeMidi({ header: midi.header, tracks })),
    bpm: microsecondsPerBeat ? 60_000_000 / microsecondsPerBeat : undefined,
  };
};
