import { on, trigger } from './events';
import { autoCorrelate, getNote } from './helpers';

const bufferSize = 2048;
// No model inference to wait on, so we can sample this often (~30/sec)
// and still be cheap on the CPU.
const detectionIntervalMs = 33;

const createTuner = () => {
  const audioContext = new ((window as any).AudioContext || (window as any).webkitAudioContext)();
  let isOn = false;
  let mic: MediaStream;
  let source: MediaStreamAudioSourceNode | undefined;
  let analyser: AnalyserNode | undefined;
  let buffer: Float32Array;
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  async function setup() {
    mic = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
      },
    });

    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    const newAnalyser = audioContext.createAnalyser();
    newAnalyser.fftSize = bufferSize;
    buffer = new Float32Array(newAnalyser.fftSize);

    const newSource = audioContext.createMediaStreamSource(mic);
    newSource.connect(newAnalyser);

    analyser = newAnalyser;
    source = newSource;
  }

  function detectPitch() {
    if (!isOn || !analyser) return;

    analyser.getFloatTimeDomainData(buffer);
    const frequency = autoCorrelate(buffer, audioContext.sampleRate);

    if (frequency > 0) {
      const { pitch, note, diff } = getNote(frequency);
      trigger({ frequency, pitch, note, diff });
    }

    timeoutId = setTimeout(detectPitch, detectionIntervalMs);
  }

  async function start() {
    await setup();
    isOn = true;
    detectPitch();
  }

  function stop() {
    isOn = false;
    if (timeoutId) clearTimeout(timeoutId);
    source?.disconnect();
    source = undefined;
    analyser = undefined;
    mic?.getTracks().forEach((t) => t.stop());
  }

  return { start, stop, getData: on, isOn };
};

export default createTuner;
