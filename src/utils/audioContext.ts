import * as Tone from "tone";

// Keeps the shared Tone.js AudioContext alive across backgrounding.
//
// Mobile browsers (Safari above all) suspend or "interrupt" the AudioContext
// when the app goes to the background or the screen locks. They only let a
// context resume from a user gesture, and after a long interruption WebKit can
// leave a context that says "running" but whose clock is frozen and plays
// nothing. The note timing runs on its own timers, so the animation keeps
// going while the sound is gone. This module resumes the context on every user
// gesture and when the page comes back, and replaces it with a fresh one when
// it is closed or its clock has stopped.

type ResetListener = () => void;

const resetListeners = new Set<ResetListener>();
const clockCheckMs = 300;
// Less than this much audio time over clockCheckMs means the clock is stuck.
const minClockAdvanceSec = 0.05;
// Longest wait for the sounds before playing anyway, for a very slow or
// broken connection.
const samplesWaitMs = 20000;
const resumeWaitMs = 500;

let isChecking = false;

// Other AudioContexts in the app (the metronome's MIDISounds player) that
// need the same resume on a gesture or when the page comes back.
// Keyed by the player's React ref, so re-registering the same ref is a no-op.
const extraContexts = new Set<{ current?: { audioContext?: AudioContext } | null }>();

export const registerAudioContextRef = (ref: { current?: { audioContext?: AudioContext } | null }) => {
  extraContexts.add(ref);
};

const resumeExtraContexts = () => {
  extraContexts.forEach((ref) => {
    const context = ref.current?.audioContext;
    if (context && context.state !== "running" && context.state !== "closed") {
      context.resume().catch(() => {});
    }
  });
};

const getRawContext = () => Tone.getContext().rawContext as AudioContext;

// Samplers belong to one context, so their owners rebuild them on a reset.
export const onAudioContextReset = (listener: ResetListener) => {
  resetListeners.add(listener);
  return () => {
    resetListeners.delete(listener);
  };
};

const resetAudioContext = () => {
  console.warn("Audio context is not producing sound, creating a new one");
  Tone.setContext(new Tone.Context({ latencyHint: "interactive" }), true);
  resetListeners.forEach((listener) => listener());
};

// Must run synchronously inside a user gesture handler on iOS, so it doesn't
// await anything before calling resume().
export const resumeAudio = (): Promise<void> => {
  resumeExtraContexts();
  const raw = getRawContext();
  if (raw.state === "closed") {
    resetAudioContext();
    return getRawContext()
      .resume()
      .catch(() => {});
  }
  if (raw.state === "running") {
    return Promise.resolve();
  }
  return raw.resume().catch(() => {});
};

const waitMs = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Resumes the context and makes sure its clock really moves; replaces the
// context when it doesn't. A replaced context may still need a gesture to
// start, which the next tap provides through the global unlock listener.
export const checkAudioHealth = async () => {
  if (isChecking) {
    return;
  }
  isChecking = true;
  try {
    await Promise.race([resumeAudio(), waitMs(resumeWaitMs)]);
    const raw = getRawContext();
    const startTime = raw.currentTime;
    await waitMs(clockCheckMs);
    if (getRawContext() !== raw) {
      return;
    }
    const advanced = raw.currentTime - startTime;
    if (raw.state === "running" && advanced < minClockAdvanceSec) {
      resetAudioContext();
      resumeAudio();
    }
  } finally {
    isChecking = false;
  }
};

// Resumes audio before playback starts and waits for the sounds it needs, so
// the first notes aren't lost. Call it straight from the play button handler.
// The resume never waits long: on iOS resume() can stay pending while the
// context is interrupted, and playback must start anyway.
export const prepareAudioForPlayback = async (soundsLoaded: Promise<unknown> = Tone.loaded()) => {
  await Promise.race([resumeAudio(), waitMs(resumeWaitMs)]);
  await Promise.race([soundsLoaded.catch(() => {}), waitMs(samplesWaitMs)]);
};

const unlockEvents = ["pointerdown", "touchend", "keydown"];

const onUserGesture = () => {
  resumeAudio();
};

const onPageVisible = () => {
  if (document.visibilityState === "visible") {
    checkAudioHealth();
  }
};

let isWatching = false;

export const watchAudioContext = () => {
  if (isWatching || typeof document === "undefined") {
    return;
  }
  isWatching = true;
  unlockEvents.forEach((event) => document.addEventListener(event, onUserGesture, true));
  document.addEventListener("visibilitychange", onPageVisible);
  window.addEventListener("pageshow", onPageVisible);
  window.addEventListener("focus", onPageVisible);
};
