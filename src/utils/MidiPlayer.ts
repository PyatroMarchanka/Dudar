import MidiPlayerLib from "midi-player-js";
import { Midi } from "@tonejs/midi";

export type MidiNoteHandler = (note: number) => void;
export type PlaybackProgressHandler = (
  percent: number,
  time: number,
  timeRemaining: number
) => void;
export type NotesMovingHandler = (tick: number) => void;
export type SetTransposeType = (num: number) => void;

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
export const bagpipeInstr = [bagpipeChanter, metronomeTick, drone];

export class MidiPlayer {
  playRef: any;
  bpm: number = 80;
  midiData: Midi | null = null;
  envelopes: any[];
  transpose: number = 0;
  droneNote: number = 46;
  metronom: boolean = true;
  handleNotesMoving?: NotesMovingHandler;

  constructor(playRef: any, bpm: number, metronom: boolean) {
    this.playRef = playRef;
    this.bpm = bpm;
    this.envelopes = [];
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
    Player.on("playing", (currentTick: any) => {
      handleProgress(
        Player.getSongPercentRemaining(),
        Player.getSongTime(),
        Player.getSongTimeRemaining()
      );
      if (this.handleNotesMoving) {
        this.handleNotesMoving(currentTick.tick);
      }
    });

    Player.on("midiEvent", (event: any) => {
      if (event.name === "Note on" && event.noteNumber !== 33) {
        this.keyDown(event.noteNumber, event.noteNumber);
        handleNote(event);
        this.checkTempo(this.bpm);
      }

      if (event.noteNumber === 33 && this.metronom) {
        this.keyDown(65, 65, metronomeTick, 2);
      }

      if (event.name === "Note off") {
        this.keyUp(event.noteNumber);
      }
    });

    Player.on("endOfFile", () => {
      this.stop();
      switchIsPlaying();
      handleProgress(0, Player.getSongTime(), Player.getSongTimeRemaining());
    });
  };

  keyDown(note: number, tick: number, instrument = bagpipeChanter, volume = 1) {
    this.envelopes[tick] = this.playRef.current?.player.queueWaveTable(
      this.playRef.current?.audioContext,
      this.playRef.current?.equalizer.input,
      window[
        this.playRef.current?.player.loader.instrumentInfo(instrument).variable
      ],
      0,
      note + this.transpose,
      9999,
      volume
    );
  }

  keyUp(tick: any) {
    if (this.envelopes) {
      if (this.envelopes[tick]) {
        this.envelopes[tick].cancel();
        this.envelopes[tick] = null;
      }
    }
  }

  setProgress = (percent: number) => {
    Player.skipToPercent(percent).play();
    this.envelopes.forEach((env) => env && env.cancel());
    this.playDrone(this.droneNote);
  };

  setTranspose: SetTransposeType = (num: number) => {
    this.transpose = num;
  };

  setMidiData = (midi: Midi) => {
    this.midiData = midi;
    console.log(" this.midiData", this.midiData);
  };

  checkTempo = (bpm: number) => {
    if (Player.tempo !== bpm) {
      Player.tempo = Math.floor(bpm / 3);
      (Player as any).setTempo(Math.floor(bpm / 3));
      this.bpm = bpm;
    }
  };

  setMetronome = (metronome: boolean) => {
    this.metronom = metronome;
  };

  playDrone = (note: number) => {
    this.keyDown(note, note, drone);
  };

  playMidi = (midi: ArrayBuffer | null, progress: number) => {
    if (!midi) {
      return;
    }

    Player.loadArrayBuffer(midi);
    Player.play();

    if (progress) {
      this.setProgress(progress);
    }
    this.playDrone(this.droneNote);
  };

  stop = () => {
    this.playRef.current?.cancelQueue();
    Player.stop();
  };

  pause = () => {
    this.playRef.current?.cancelQueue();
    Player.pause();
  };
}
