import * as Tone from "tone";

// On-screen playback log for phones, where there is no console: open a player
// page with `debug=1` in the address (e.g. /app/abc?abc=...&debug=1).
export const isPlaybackDebug = () =>
  typeof window !== "undefined" && new URLSearchParams(window.location.search).has("debug");

const MAX_LINES = 40;

type Listener = (lines: string[]) => void;

let lines: string[] = [];
const listeners = new Set<Listener>();
const startedAt = performance.now();
// When each note started, to show how long it was held
const noteOnTimes = new Map<number, number>();

const stamp = () => ((performance.now() - startedAt) / 1000).toFixed(2).padStart(6, " ");

export const logPlayback = (message: string) => {
  if (!isPlaybackDebug()) return;
  lines = [`${stamp()} ${message}`, ...lines].slice(0, MAX_LINES);
  listeners.forEach((listener) => listener(lines));
};

export const logNoteOn = (note: number) => {
  if (!isPlaybackDebug()) return;
  noteOnTimes.set(note, performance.now());
  logPlayback(`ON  ${note}`);
};

export const logNoteOff = (note: number) => {
  if (!isPlaybackDebug()) return;
  const startedNote = noteOnTimes.get(note);
  noteOnTimes.delete(note);
  logPlayback(`OFF ${note}${startedNote === undefined ? "" : ` held ${Math.round(performance.now() - startedNote)}ms`}`);
};

export const subscribePlaybackLog = (listener: Listener) => {
  listeners.add(listener);
  listener(lines);
  return () => {
    listeners.delete(listener);
  };
};

export const getAudioInfo = () => {
  const context = Tone.getContext();
  const raw = context.rawContext as AudioContext;
  return [
    `tone ${raw.state} ${raw.sampleRate}Hz`,
    `lookAhead ${context.lookAhead}s`,
    `ctxTime ${raw.currentTime.toFixed(2)}`,
    `vis ${document.visibilityState}`,
  ].join(" | ");
};
