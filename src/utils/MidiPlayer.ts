import MidiPlayerLib from "midi-player-js";
import { Midi } from "@tonejs/midi";

export type MidiNoteHandler = (note: number) => void;
export type PlaybackProgressHandler = (percent: number) => void;
export type SetTransposeType = (num: number) => void;

var Player = new MidiPlayerLib.Player(function (event: any) {});

Player.on("fileLoaded", function () {});
Player.on("playing", function (currentTick: any) {});
Player.on("midiEvent", function (event: any) {});
Player.on("endOfFile", function () {
  Player.stop();
});
(Player as any).setTempo(140);

const bagpipeChanter = 1166;
const drone = 731;
export const bagpipeInstr = [bagpipeChanter, drone];

export class MidiPlayer {
  playRef: any;
  bpm: number = 80;
  midiData: Midi | null = null;
  envelopes: any[];
  transpose: number = 0;
  droneNote: number = 46;

  constructor(playRef: any, bpm: number) {
    this.playRef = playRef;
    this.bpm = bpm;
    this.envelopes = [];

    if (this.playRef.current) {
      this.playRef.current?.setBand256(-5);
      this.playRef.current?.setBand512(-5);
      this.playRef.current?.setInstrumentVolume(drone, 1);
    }
  }

  initPlayer = (
    handleNote: MidiNoteHandler,
    handleProgress: PlaybackProgressHandler
  ) => {
    console.log("initPlayer");
    Player.on("playing", function (currentTick: any) {
      handleProgress(Player.getSongPercentRemaining());
    });

    Player.on("midiEvent", (event: any) => {
      if (event.name === "Note on") {
        this.keyDown(event.noteNumber, event.noteNumber);
        handleNote(event.noteNumber);
      }

      if (event.name === "Note off") {
        this.keyUp(event.noteNumber);
      }
    });
  };

  keyDown(note: number, tick: number, instrument = bagpipeChanter) {
    let volume = 1;

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
  };

  setTempo = (bpm: number) => {
    console.log("setTempo");
    Player.tempo = bpm;
    (Player as any).setTempo(bpm);
  };

  playDrone = (note: number) => {
    this.keyDown(note, note, drone);
  };

  playMidi = (midi: ArrayBuffer | null, midiData: Midi | null) => {
    if (!midi) {
      return;
    }

    Player.loadArrayBuffer(midi);
    Player.play();
    this.playDrone(this.droneNote);
  };

  stop = () => {
    this.playRef.current?.cancelQueue();
    Player.stop();
  };
}
