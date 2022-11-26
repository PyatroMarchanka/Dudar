import { useEffect, useState } from "react";
// @ts-ignore
import { PitchShifter } from "soundtouchjs";

const audioCtx = new (window.AudioContext ||
  (window as any).webkitAudioContext)();
const gainNode = audioCtx.createGain();

const oneToTempo = (tempo = 120) => {
  return tempo / 120;
};

const oneToPitch = (pitch = 0) => {
  //   1 + 0 / 24
  return 1 + pitch / 24;
};

export const usePitchedSound = () => {
  const [song, setSong] = useState<ArrayBuffer | null>(null);
  const [shifter, setShifter] = useState<PitchShifter>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const loadSong = async (url: string) => {
    // here you retrieved your file with 'fetch' or a new instance of the 'FileReader', and from the data...
    if (shifter) {
      shifter.off(); // remove any current listeners
    }

    try {
      const file = await fetch(url);
      const buffer = await file.arrayBuffer();
      console.log("loadSong", buffer);
      setSong(buffer);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadSong(`sound/Sleepy Maggie.mp3`);
  }, []);

  const decodeAudio = (
    song: ArrayBuffer,
    audioCtx: AudioContext,
    tempo = 1,
    pitch = 1
  ) => {
    if (song) {
      audioCtx.decodeAudioData(song, (audioBuffer) => {
        const newShifter = new PitchShifter(audioCtx, audioBuffer, 2048);
        newShifter.on("play", (detail: any) => {
          console.log("play");
          // do something with detail.timePlayed;
          // do something with detail.formattedTimePlayed;
          // do something with detail.percentagePlayed
        });
        newShifter.tempo = tempo;
        newShifter.pitch = pitch;

        setShifter(newShifter);
      });
    }
  };

  useEffect(() => {
    if (song) {
      //   decodeAudio(song, audioCtx, 1, 1);
      const pitch = oneToPitch(1);
      const tempo = oneToTempo(120);
      console.log("pitch", pitch, "tempo", tempo);
      decodeAudio(song, audioCtx, tempo, pitch);
    }
  }, [song]);

  const play = () => {
    if (song && shifter) {
      shifter.connect(gainNode); // connect it to a GainNode to control the volume
      gainNode.connect(audioCtx.destination); // attach the GainNode to the 'destination'
      setIsPlaying(true);
    }
  };

  const stop = () => {
    // gainNode.disconnect(audioCtx.destination);
    audioCtx.suspend();
    console.log("audioCtx.state", audioCtx.state);
    setIsPlaying(false);
  };

  return { song, play, shifter, stop, isPlaying };
};
