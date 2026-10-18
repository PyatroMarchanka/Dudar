import * as Tone from 'tone';

// How long after a note is triggered it is actually heard, and how much to hold
// the visuals back so the fingering and the notes roll line up with the sound.
//
// Three parts add up:
// - Tone.js lookAhead: samplers triggered "now" are scheduled lookAhead seconds
//   in the future (0.1 s by default), on every device.
// - baseLatency: the AudioContext's own processing delay.
// - outputLatency: the delay of the output device itself. This is the big one
//   for Bluetooth headphones (often 150-300 ms). Chrome and Firefox report it;
//   Safari does not, and some systems under-report Bluetooth.
// The manual offset, set per device in the settings, covers what the browser
// doesn't report.

const offsetStorageKey = 'audioSyncOffsetMs';
const maxAutoLatencyMs = 1000;

// Marker value for "No delay": the visuals are not held back at all.
export const noDelayOffsetMs = -1;

export const syncOffsetOptionsMs = [noDelayOffsetMs, -100, -50, 0, 50, 100, 150, 200, 250, 300, 400, 500];

let manualOffsetMs = readStoredOffset();

function readStoredOffset(): number {
  try {
    const value = Number(localStorage.getItem(offsetStorageKey));
    return Number.isFinite(value) ? value : 0;
  } catch {
    return 0;
  }
}

export const getSyncOffsetMs = () => manualOffsetMs;

export const setSyncOffsetMs = (ms: number) => {
  manualOffsetMs = ms;
  try {
    localStorage.setItem(offsetStorageKey, String(ms));
  } catch {
    // Storage blocked: the offset still applies for this visit.
  }
};

export const getAutoLatencyMs = (): number => {
  try {
    const context = Tone.getContext();
    const raw = context.rawContext as AudioContext;
    const seconds = (context.lookAhead || 0) + (raw.baseLatency || 0) + (raw.outputLatency || 0);
    return Math.min(Math.round(seconds * 1000), maxAutoLatencyMs);
  } catch {
    return 0;
  }
};

export const getVisualDelayMs = () =>
  manualOffsetMs === noDelayOffsetMs ? 0 : Math.max(getAutoLatencyMs() + manualOffsetMs, 0);
