import * as Tone from 'tone';
import MidiPlayerLib from 'midi-player-js';

export type MidiNoteHandler = (note: number) => void;

var Player = new MidiPlayerLib.Player(function (event: any) {});

Player.on('fileLoaded', function () {});
Player.on('playing', function (currentTick: any) {});
Player.on('midiEvent', function (event: any) {});
Player.on('endOfFile', function () {});

export const bagpipeInstr = [1166];

export class MidiPlayer {
  playRef: any;
  bpm: number = 80;

  constructor(playRef: any, bpm: number) {
    this.playRef = playRef;
    this.bpm = bpm;

    if (this.playRef.current) {
      this.playRef.current?.setBand256(-5);
      this.playRef.current?.setBand512(-5);
    }
  }

  initPlayer = (handleNote: MidiNoteHandler) => {
    console.log('initPlayer');
    Player.on('midiEvent', (event: any) => {
      if (event.name === 'Note on') {
        this.playNote(event.noteNumber, 1);
        handleNote(event.noteNumber);
      }
    });
  };

  playNote = (note: number, dur: number) => {
    // console.log('note', note);
    this.playRef.current?.cancelQueue();
    this.playRef.current?.playChordNow(1166, [note], dur - 0.005);
  };

  playMidi = (midi: ArrayBuffer | null) => {
    if (!midi) {
      return;
    }

    Player.loadArrayBuffer(midi);
    Player.play();
  };

  stop = () => {
    console.log('stop');
    this.playRef.current?.cancelQueue();
    Player.stop();
  };
}
