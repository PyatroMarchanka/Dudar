import { useCallback, useEffect, useRef, useState } from 'react';
import * as Tone from 'tone';
import { BagpipeTypes } from '../../interfaces';
import { prepareAudioForPlayback } from '../../utils/audioContext';
import { getRollEnd, MelodyRoll } from '../../utils/midiUtils/melodyRoll';
import { loadSampler, playNoteFor, stopAllNotes } from '../../utils/midiUtils/sampler';

// Notes are handed to the audio clock a little ahead, so Stop never leaves
// more than this much already scheduled
const SCHEDULE_AHEAD_SEC = 0.15;
const SCHEDULE_EVERY_MS = 40;
// Time to start the first note after Play is pressed
const START_DELAY_SEC = 0.1;

export const pitchToNoteName = (pitch: number, transpose: number) => Tone.Frequency(pitch + transpose, 'midi').toNote();

// Plays the melody in the editor with the bagpipe's samples and reports where
// the playhead is (in ticks, null when stopped), without the full player.
export const usePreview = (roll: MelodyRoll, transpose: number) => {
  const [playheadTick, setPlayheadTick] = useState<number | null>(null);
  const stopRef = useRef<() => void>(() => {});

  const stop = useCallback(() => stopRef.current(), []);

  const play = useCallback(
    async (fromTick: number) => {
      stopRef.current();
      const { bagpipeType, notes, bpm, ppq } = roll;
      let cancelled = false;
      setPlayheadTick(fromTick);
      stopRef.current = () => {
        cancelled = true;
        setPlayheadTick(null);
        stopRef.current = () => {};
      };
      await prepareAudioForPlayback(loadSampler(bagpipeType));
      if (cancelled) return;

      const secondsPerTick = 60 / (bpm * ppq);
      const endTick = Math.max(getRollEnd(roll), ...notes.map((note) => note[1] + note[2]));
      const startTime = Tone.now() + START_DELAY_SEC;
      const queue = notes.filter((note) => note[1] >= fromTick);
      let next = 0;

      const schedule = () => {
        const horizon = Tone.now() + SCHEDULE_AHEAD_SEC;
        while (next < queue.length) {
          const [pitch, tick, duration] = queue[next];
          const time = startTime + (tick - fromTick) * secondsPerTick;
          if (time > horizon) break;
          playNoteFor(bagpipeType, pitchToNoteName(pitch, transpose), time, duration * secondsPerTick);
          next++;
        }
      };
      schedule();
      const timer = window.setInterval(schedule, SCHEDULE_EVERY_MS);

      let frame = 0;
      const draw = () => {
        const tick = fromTick + Math.max(Tone.now() - startTime, 0) / secondsPerTick;
        if (tick >= endTick) {
          stopRef.current();
          return;
        }
        setPlayheadTick(tick);
        frame = window.requestAnimationFrame(draw);
      };
      frame = window.requestAnimationFrame(draw);

      stopRef.current = () => {
        window.clearInterval(timer);
        window.cancelAnimationFrame(frame);
        stopAllNotes(bagpipeType as BagpipeTypes);
        setPlayheadTick(null);
        stopRef.current = () => {};
      };
    },
    [roll, transpose]
  );

  useEffect(() => stop, [stop]);

  return { play, stop, isPlaying: playheadTick !== null, playheadTick };
};

// Sounds one note briefly, when it's added or tapped
export const auditionNote = async (bagpipeType: BagpipeTypes, pitch: number, transpose: number, seconds: number) => {
  await prepareAudioForPlayback(loadSampler(bagpipeType));
  playNoteFor(bagpipeType, pitchToNoteName(pitch, transpose), Tone.now() + 0.01, Math.min(Math.max(seconds, 0.15), 1));
};
