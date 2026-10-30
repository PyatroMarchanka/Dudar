import { useCallback, useEffect, useRef, useState } from 'react';
import * as Tone from 'tone';
import { BagpipeTypes } from '../../interfaces';
import { prepareAudioForPlayback } from '../../utils/audioContext';
import { getRollEnd, MelodyRoll, RollNote } from '../../utils/midiUtils/melodyRoll';
import { loadSampler, playNoteFor, stopAllNotes } from '../../utils/midiUtils/sampler';

// Notes are handed to the audio clock a little ahead, so Stop never leaves
// more than this much already scheduled
const SCHEDULE_AHEAD_SEC = 0.15;
const SCHEDULE_EVERY_MS = 40;
// Time to start the first note after Play is pressed
const START_DELAY_SEC = 0.1;

// [from, to) in ticks
export type LoopRange = [number, number];

export const pitchToNoteName = (pitch: number, transpose: number) => Tone.Frequency(pitch + transpose, 'midi').toNote();

// Plays the melody in the editor with the bagpipe's samples and reports where
// the playhead is (in ticks, null when stopped), without the full player.
export const usePreview = (roll: MelodyRoll, transpose: number) => {
  const [playheadTick, setPlayheadTick] = useState<number | null>(null);
  const stopRef = useRef<() => void>(() => {});

  const stop = useCallback(() => stopRef.current(), []);

  // Plays from `fromTick`; with `loop` ([from, to) in ticks) it repeats that
  // part until stopped, starting at its beginning if `fromTick` is outside it
  const play = useCallback(
    async (startTick: number, loop?: LoopRange) => {
      stopRef.current();
      const { bagpipeType, notes, bpm, ppq } = roll;
      const loopRange = loop && loop[1] > loop[0] ? loop : undefined;
      const fromTick = loopRange && (startTick < loopRange[0] || startTick >= loopRange[1]) ? loopRange[0] : startTick;
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
      // When looping, the notes of the looped part, cut at its end
      const queue = loopRange
        ? notes
            .filter((note) => note[1] >= loopRange[0] && note[1] < loopRange[1])
            .map((note): RollNote => [note[0], note[1], Math.min(note[2], loopRange[1] - note[1])])
        : notes;
      const loopTicks = loopRange ? loopRange[1] - loopRange[0] : 0;
      // The first time through starts at fromTick, later ones at the start of the loop
      let pass = 0;
      let next = queue.findIndex((note) => note[1] >= fromTick);
      if (next === -1) next = queue.length;

      const schedule = () => {
        const horizon = Tone.now() + SCHEDULE_AHEAD_SEC;
        for (;;) {
          if (next >= queue.length) {
            if (!loopRange) return;
            const nextPassTime = startTime + (loopRange[0] - fromTick + (pass + 1) * loopTicks) * secondsPerTick;
            if (nextPassTime > horizon) return;
            pass++;
            next = 0;
            continue;
          }
          const [pitch, tick, duration] = queue[next];
          const time = startTime + (tick - fromTick + pass * loopTicks) * secondsPerTick;
          if (time > horizon) return;
          playNoteFor(bagpipeType, pitchToNoteName(pitch, transpose), time, duration * secondsPerTick);
          next++;
        }
      };
      schedule();
      const timer = window.setInterval(schedule, SCHEDULE_EVERY_MS);

      let frame = 0;
      const draw = () => {
        let tick = fromTick + Math.max(Tone.now() - startTime, 0) / secondsPerTick;
        if (loopRange) {
          if (tick >= loopRange[1]) tick = loopRange[0] + ((tick - loopRange[1]) % loopTicks);
        } else if (tick >= endTick) {
          stopRef.current();
          return;
        }
        setPlayheadTick(tick);
        // Showing the playhead can start another playback (the loop changed), which stops this one
        if (cancelled) return;
        frame = window.requestAnimationFrame(draw);
      };
      frame = window.requestAnimationFrame(draw);

      stopRef.current = () => {
        cancelled = true;
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
