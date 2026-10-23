import { parseMidi } from "midi-file";
import { Buffer } from "buffer";
import { abcToMidi } from "./abcToMidi";

const WALTZ = `X: 1
T: The Banks Of Sullane
R: waltz
M: 3/4
L: 1/8
K: Ddor
DE | F2 c2 DD | E2 D2 E2 | D2 C4- | C4 CD |
E2 D2 A,2 | C2 D2 C2 | D6- | D4 DE |`;

const readNotes = (buffer: ArrayBuffer) => {
  const midi = parseMidi(Buffer.from(buffer));
  const events = midi.tracks.flatMap((track) => {
    let tick = 0;
    return track.map((event) => ({ ...event, tick: (tick += event.deltaTime) }));
  });
  return { midi, events };
};

describe("abcToMidi", () => {
  it("leaves the tempo to the app: no tempo event in the file", () => {
    const { events } = readNotes(abcToMidi(WALTZ).buffer);
    expect(events.filter((e) => e.type === "setTempo")).toHaveLength(0);
  });

  it("keeps the tune's tempo, doubled like catalog songs", () => {
    expect(abcToMidi(WALTZ).song.originalTempo).toBe(360);
    expect(abcToMidi(WALTZ.replace("M: 3/4", "M: 3/4\nQ: 1/4=90")).song.originalTempo).toBe(180);
  });

  it("reads the tempo of compound meters from the MIDI, not from getBpm", () => {
    const jig = `X:1\nT:Jig\nM:6/8\nL:1/8\nQ:1/8=130\nK:D\nDEF GAB|`;
    const { song } = abcToMidi(jig);
    // abcjs writes this tune at 65 quarter notes a minute
    expect(song.originalTempo).toBe(130);
  });

  it("ends every note before the next one starts", () => {
    const { events } = readNotes(abcToMidi(WALTZ).buffer);
    const ons = events.filter((e) => e.type === "noteOn" && e.velocity > 0);
    const offs = events.filter((e) => e.type === "noteOff" || (e.type === "noteOn" && e.velocity === 0));
    expect(ons).toHaveLength(offs.length);

    ons.forEach((on, i) => {
      const next = ons[i + 1];
      const off = offs.find((o) => (o as any).noteNumber === (on as any).noteNumber && o.tick > on.tick)!;
      expect(off.tick).toBeGreaterThan(on.tick);
      if (next) expect(off.tick).toBeLessThan(next.tick);
    });
  });

  it("keeps every note and the written length of the tune", () => {
    const { events } = readNotes(abcToMidi(WALTZ).buffer);
    expect(events.filter((e) => e.type === "noteOn" && e.velocity > 0)).toHaveLength(22);
    const lastOff = Math.max(...events.filter((e) => e.type === "noteOff").map((e) => e.tick));
    // The tune is 12 000 ticks long, the last note ends one tick early
    expect(lastOff).toBe(11999);
  });
});
