import { TimeSignatures } from '../../dataset/songs/interfaces';
import { getClickSeconds } from './quantize';

// Records the microphone while a metronome clicks, and knows where the first
// click falls in the recording, so the notes can be put on the beat.

export interface MetronomeRecording {
  samples: Float32Array;
  sampleRate: number;
  // Seconds into the recording where the player heard the first click
  firstBeatSeconds: number;
}

export interface RecorderCallbacks {
  // Called on each click: the click's number in the bar (0 = the first) and the bar's number
  onBeat?: (beat: number, bar: number) => void;
  // Input level 0..1, a few times a second
  onLevel?: (level: number) => void;
}

const BUFFER_SIZE = 4096;
const LOOKAHEAD_SECONDS = 0.2;
const START_DELAY_SECONDS = 0.3;

export const createMetronomeRecorder = () => {
  let context: AudioContext | undefined;
  let stream: MediaStream | undefined;
  let processor: ScriptProcessorNode | undefined;
  let source: MediaStreamAudioSourceNode | undefined;
  let schedulerId: ReturnType<typeof setInterval> | undefined;
  const beatTimers: ReturnType<typeof setTimeout>[] = [];
  let chunks: Float32Array[] = [];
  let recordingStart: number | null = null;
  let firstClick = 0;

  const click = (time: number, accent: boolean) => {
    if (!context) return;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.frequency.value = accent ? 1800 : 1200;
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(0.6, time + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.04);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(time);
    oscillator.stop(time + 0.05);
  };

  const start = async (bpm: number, timeSignature: TimeSignatures, { onBeat, onLevel }: RecorderCallbacks = {}) => {
    stream = await navigator.mediaDevices.getUserMedia({
      // A loud instrument: no processing meant for voices
      audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
    });
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    context = new AudioContextClass();
    if (context.state === 'suspended') await context.resume();
    const ctx = context;

    chunks = [];
    recordingStart = null;
    source = ctx.createMediaStreamSource(stream);
    processor = ctx.createScriptProcessor(BUFFER_SIZE, 1, 1);
    let levelAt = 0;
    processor.onaudioprocess = (event) => {
      const input = event.inputBuffer.getChannelData(0);
      if (recordingStart === null) recordingStart = ctx.currentTime - input.length / ctx.sampleRate;
      chunks.push(new Float32Array(input));
      if (onLevel && ctx.currentTime - levelAt > 0.1) {
        levelAt = ctx.currentTime;
        let peak = 0;
        for (let i = 0; i < input.length; i++) peak = Math.max(peak, Math.abs(input[i]));
        onLevel(peak);
      }
    };
    // A script processor only runs while connected to the output; it outputs silence
    const mute = ctx.createGain();
    mute.gain.value = 0;
    source.connect(processor);
    processor.connect(mute).connect(ctx.destination);

    const interval = getClickSeconds(bpm, timeSignature);
    const beatsPerBar = Number(timeSignature.split('/')[0]);
    firstClick = ctx.currentTime + START_DELAY_SECONDS;
    let next = 0;
    const schedule = () => {
      while (firstClick + next * interval < ctx.currentTime + LOOKAHEAD_SECONDS) {
        const time = firstClick + next * interval;
        const beat = next % beatsPerBar;
        const bar = Math.floor(next / beatsPerBar);
        click(time, beat === 0);
        if (onBeat) {
          beatTimers.push(setTimeout(() => onBeat(beat, bar), Math.max(0, (time - ctx.currentTime) * 1000)));
          if (beatTimers.length > 64) beatTimers.splice(0, 32);
        }
        next++;
      }
    };
    schedule();
    schedulerId = setInterval(schedule, 25);
  };

  const cleanup = () => {
    if (schedulerId) clearInterval(schedulerId);
    schedulerId = undefined;
    beatTimers.forEach(clearTimeout);
    beatTimers.length = 0;
    if (processor) processor.onaudioprocess = null;
    processor?.disconnect();
    source?.disconnect();
    stream?.getTracks().forEach((track) => track.stop());
    const ctx = context;
    context = undefined;
    processor = undefined;
    source = undefined;
    stream = undefined;
    return ctx;
  };

  const stop = async (): Promise<MetronomeRecording> => {
    const ctx = context;
    const sampleRate = ctx?.sampleRate ?? 44100;
    // The player hears a click this long after it's played; we take their note
    // to be heard by the microphone about as late again
    const latency = ctx ? (ctx.outputLatency || 0) + (ctx.baseLatency || 0) : 0;
    cleanup();
    await ctx?.close().catch(() => {});

    const length = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
    const samples = new Float32Array(length);
    let offset = 0;
    chunks.forEach((chunk) => {
      samples.set(chunk, offset);
      offset += chunk.length;
    });
    chunks = [];
    const firstBeatSeconds = firstClick - (recordingStart ?? firstClick) + latency;
    return { samples, sampleRate, firstBeatSeconds };
  };

  // Stops without keeping anything (leaving the page)
  const cancel = () => {
    const ctx = cleanup();
    ctx?.close().catch(() => {});
    chunks = [];
  };

  return { start, stop, cancel };
};
