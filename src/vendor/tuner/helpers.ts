import { allNotes, notes } from './notes';

// Autocorrelation pitch detector (the "ACF2+" method commonly used for
// real-time instrument tuners). Runs directly on the raw time-domain
// samples, so unlike an ML model it's cheap enough to call dozens of
// times per second.
export function autoCorrelate(buffer: Float32Array, sampleRate: number): number {
  const SIZE = buffer.length;

  let rms = 0;
  for (let i = 0; i < SIZE; i++) {
    rms += buffer[i] * buffer[i];
  }
  rms = Math.sqrt(rms / SIZE);
  if (rms < 0.01) return -1; // not enough signal

  // Trim silence from both ends so the autocorrelation isn't thrown off by it.
  let start = 0;
  let end = SIZE - 1;
  const threshold = 0.2;
  for (let i = 0; i < SIZE / 2; i++) {
    if (Math.abs(buffer[i]) >= threshold) {
      start = i;
      break;
    }
  }
  for (let i = 0; i < SIZE / 2; i++) {
    if (Math.abs(buffer[SIZE - 1 - i]) >= threshold) {
      end = SIZE - 1 - i;
      break;
    }
  }

  const trimmed = buffer.subarray(start, end);
  const newSize = trimmed.length;
  if (newSize < 2) return -1;

  const correlations = new Float32Array(newSize);
  for (let lag = 0; lag < newSize; lag++) {
    let sum = 0;
    for (let i = 0; i < newSize - lag; i++) {
      sum += trimmed[i] * trimmed[i + lag];
    }
    correlations[lag] = sum;
  }

  let lag = 0;
  while (lag < newSize - 1 && correlations[lag] > correlations[lag + 1]) {
    lag++;
  }

  let bestOffset = -1;
  let bestValue = -1;
  for (let i = lag; i < newSize; i++) {
    if (correlations[i] > bestValue) {
      bestValue = correlations[i];
      bestOffset = i;
    }
  }
  if (bestOffset === -1) return -1;

  // Parabolic interpolation around the peak for sub-sample precision.
  let period = bestOffset;
  const x1 = correlations[bestOffset - 1] ?? correlations[bestOffset];
  const x2 = correlations[bestOffset];
  const x3 = correlations[bestOffset + 1] ?? correlations[bestOffset];
  const a = (x1 + x3 - 2 * x2) / 2;
  const b = (x3 - x1) / 2;
  if (a) period = bestOffset - b / (2 * a);

  if (period <= 0) return -1;
  return sampleRate / period;
}

export function getNote(frequency: number) {
  // find closest frequency
  const pitch = allNotes.reduce(function (prev, curr) {
    return Math.abs(curr - frequency) < Math.abs(prev - frequency) ? curr : prev;
  });

  // find note name by closest frequency
  let note;
  if (pitch === 0) note = '-';
  else {
    const index = allNotes.indexOf(pitch) % 12;
    note = notes[index];
  }

  // calc diff
  const indexNote = allNotes.indexOf(pitch);
  let limit;
  const isSharp = frequency > pitch;
  // At the top/bottom edge of the table the neighbour we'd normally use is
  // missing, so fall back to the interval on the other side instead of
  // producing NaN (which would permanently poison the smoothing in Tuner).
  if (isSharp) {
    const next = allNotes[indexNote + 1];
    limit = next !== undefined ? next - pitch : pitch - allNotes[indexNote - 1];
  } else {
    const prev = allNotes[indexNote - 1];
    limit = prev !== undefined ? pitch - prev : allNotes[indexNote + 1] - pitch;
  }
  const diff = Math.floor(((frequency - pitch) / limit) * 200);

  return { pitch, note, diff };
}
