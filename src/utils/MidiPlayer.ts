import MidiPlayerLib from "midi-player-js";
import { Midi } from "@tonejs/midi";
import { droneFileLengthMs, playNote, stopNote } from "./midiUtils/sampler";
import { midiNumbersToNotes } from "./midiUtils/notesToMidiNumbers";
import { SharpNotesEnum } from "../interfaces";

export type MidiNoteHandler = (note: number) => void;
export type PlaybackProgressHandler = (
  percent: number,
  time: number,
  timeRemaining: number
) => void;
export type NotesMovingHandler = (tick: number) => void;
export type SetTransposeType = (num: number, isPlaying: boolean) => void;

export interface MidiEvent {
  byteIndex?: number;
  delta?: number;
  name?: "End of Track" | "Note on" | "Note off" | "Sequence/Track Name";
  tick?: number;
  track?: number;
  channel?: number;
  noteName?: SharpNotesEnum;
  noteNumber?: number;
  velocity?: number;
}

var Player = new MidiPlayerLib.Player(function (event: any) {});
Player.on("fileLoaded", function () {});
Player.on("playing", function (currentTick: any) {});
Player.on("midiEvent", function (event: any) {});
Player.on("endOfFile", function () {
  Player.stop();
});

const bagpipeChanter = 1166;
const metronomeTick = 1219;
const drone = 731;

export const instruments = [bagpipeChanter, metronomeTick, drone];

export class MidiPlayer {
  playRef: any;
  bpm: number = 80;
  midiData: Midi | null = null;
  envelopes: { [key: string]: any };
  transpose: number = 0;
  droneNote: number = 57;
  metronom: boolean = true;
  loopData = { startLoopTicks: 0, endLoopTicks: 1920, loopBars: 1 };
  loop: boolean = false;
  isPlaying = false;
  handleNotesMoving?: NotesMovingHandler;

  constructor(playRef: any, bpm: number, metronom: boolean) {
    this.playRef = playRef;
    this.bpm = bpm;
    this.envelopes = {};
    this.metronom = metronom;

    if (this.playRef.current) {
      this.playRef.current?.setBand256(-5);
      this.playRef.current?.setBand512(-5);
      this.playRef.current?.setInstrumentVolume(drone, 1);
    }
  }

  initPlayer = (
    handleNote: MidiNoteHandler,
    handleProgress: PlaybackProgressHandler,
    switchIsPlaying: () => void
  ) => {
    console.log("initPlayer");
    Player.on("playing", ({ tick }: any) => {
      handleProgress(
        Player.getSongPercentRemaining(),
        Player.getSongTime(),
        Player.getSongTimeRemaining()
      );
      if (this.handleNotesMoving) {
        this.handleNotesMoving(tick);
      }
      if (tick >= this.midiData?.durationTicks!) {
        this.setProgress(0, true);
      }
      this.loopBar(tick);
    });

    Player.on("midiEvent", (event: MidiEvent) => {
      if (event.noteNumber === 33 && this.metronom) {
        this.handleMetronomeEvent(event);
      } else {
        this.handleSamplerEvent(event, handleNote);
      }
    });

    Player.on("endOfFile", () => {
      console.log("end of file");
    });
  };

  setLoop(loop: boolean) {
    this.loop = loop;
  }

  setLoopBarsCount(num: number) {
    this.loopData.loopBars = num;
  }

  setCurrentBarStart() {
    const tick = Player.getCurrentTick();
    // TODO: set count of beats according to the song time signature
    const ticksPerBar = (this.midiData?.header.ppq || 480) * 4;
    const currentBar = Math.trunc(tick / ticksPerBar);

    if (this.loopData.startLoopTicks !== currentBar * ticksPerBar) {
      this.loopData.startLoopTicks = currentBar * ticksPerBar;
      this.loopData.endLoopTicks = (currentBar + 1) * ticksPerBar;
    }
  }

  loopBar(tick: number) {
    if (
      this.loop &&
      tick >= this.loopData.endLoopTicks * this.loopData.loopBars
    ) {
      this.setTick(this.loopData.startLoopTicks, true);
    }
  }

  handleMetronomeEvent = (event: MidiEvent) => {
    const delayMs = 75;
    if (event.noteNumber === 33 && this.metronom) {
      if (event.name === "Note on") {
        setTimeout(() => {
          this.playMidiNote(65, 0, metronomeTick, 8);
        }, delayMs);
      } else if (event.name === "Note off") {
        this.stopMidiNote(65);
      }
    }
  };

  handleSamplerEvent = (event: any, handleNote: (event: any) => void) => {
    if (
      event.name === "Note off" ||
      (event.name === "Note on" && event.velocity === 0)
    ) {
      this.keyUp(event.noteNumber);
    } else if (event.name === "Note on" && event.noteNumber !== 33) {
      this.keyDown(event.noteNumber);
      handleNote(event);
      this.checkTempo(this.bpm);
    }
  };

  playMidiNote = (
    note: number,
    tick: number,
    instrument = bagpipeChanter,
    volume = 1
  ) => {
    this.envelopes[tick] = this.playRef.current?.player.queueWaveTable(
      this.playRef.current?.audioContext,
      this.playRef.current?.equalizer.input,
      window[
        this.playRef.current?.player.loader.instrumentInfo(instrument).variable
      ],
      0,
      note + this.transpose - 1,
      9999,
      volume
    );
  };

  stopMidiNote = (tick: number) => {
    if (this.envelopes) {
      if (this.envelopes[tick]) {
        this.envelopes[tick].cancel();
        this.envelopes[tick] = null;
      }
    }
  };

  keyDown(note: number, volume = 0.7) {
    // @ts-ignore
    playNote(midiNumbersToNotes[note + this.transpose + 12], volume);
    this.envelopes[note] = note;
  }

  keyUp(noteNumber: number) {
    if (this.envelopes) {
      if (this.envelopes[noteNumber]?.cancel) {
        this.envelopes[noteNumber].cancel();
        this.envelopes[noteNumber] = null;
      } else {
        // @ts-ignore
        stopNote(midiNumbersToNotes[noteNumber + this.transpose + 12]);
      }
    }
  }

  setProgress = (percent: number, isPlaying: boolean) => {
    Player.skipToPercent(percent);
    this.setCurrentBarStart();
    if (isPlaying) {
      Player.play();
      this.stopAllNotes();

      this.playDrone(this.droneNote);
    }
  };

  setTick = (tick: number, isPlaying: boolean) => {
    Player.skipToTick(tick);
    if (isPlaying) {
      Player.play();
      this.stopAllNotes();
      this.playDrone(this.droneNote);
    }
  };

  setTranspose: SetTransposeType = (num: number) => {
    this.transpose = num;
  };

  setMidiData = (midi: Midi) => {
    this.midiData = midi;
  };

  checkTempo = (bpm: number) => {
    if (Player.tempo !== bpm) {
      Player.tempo = Math.floor(bpm / 2);
      (Player as any).setTempo(Math.floor(bpm / 2));
      this.bpm = bpm;
    }
  };

  setMetronome = (metronome: boolean) => {
    this.metronom = metronome;
  };

  playDrone = (note: number) => {
    this.keyUp(note);
    this.keyDown(note, 0.5);

    setTimeout(() => {
      if (this.isPlaying) {
        this.playDrone(note);
      }
    }, droneFileLengthMs);
  };

  playMidi = (midi: ArrayBuffer | null, progress: number) => {
    if (!midi) {
      return;
    }
    this.isPlaying = true;
    Player.loadArrayBuffer(midi);
    Player.play();
    if (progress) {
      this.setProgress(progress, true);
    }

    this.playDrone(this.droneNote);
  };

  playWithPreclick = (midi: ArrayBuffer | null, progress: number) => {
    const when = this.playRef?.current?.contextTime();
    const N = (4 * 60) / this.bpm;
    const duration4th = N / 2;
    const dur = duration4th;
    const preClickBeatsCount = 4;

    const preClickTime = (60 / this.bpm) * 1000 * (preClickBeatsCount * 2);
    for (let index = 0; index < preClickBeatsCount; index++) {
      this.playRef?.current?.playChordAt(
        when + dur * index,
        1219,
        [60],
        dur * 1
      );
    }

    setTimeout(() => {
      this.playMidi(midi, progress);
    }, preClickTime);
  };

  stop = () => {
    this.isPlaying = false;
    this.playRef.current?.cancelQueue();
    Player.stop();
    this.stopAllNotes();
  };

  stopAllNotes = () => {
    if (this.envelopes) {
      Object.values(this.envelopes).forEach((num) => {
        if (typeof num === "number") {
          stopNote(
            midiNumbersToNotes[
              (num + this.transpose + 12) as keyof typeof midiNumbersToNotes
            ]
          );
        } else if (num) {
          this.stopMidiNote(num);
        }
      });
    }
  };

  pause = () => {
    this.isPlaying = false;
    this.playRef.current?.cancelQueue();
    Player.pause();
    this.stopAllNotes();
  };
}
