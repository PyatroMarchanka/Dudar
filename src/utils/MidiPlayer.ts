import * as Tone from 'tone';
import MidiPlayerLib from 'midi-player-js';
import { Midi } from '@tonejs/midi';

export type MidiNoteHandler = (note: number) => void;

var Player = new MidiPlayerLib.Player(function (event: any) {});

Player.on('fileLoaded', function () {});
Player.on('playing', function (currentTick: any) {});
Player.on('midiEvent', function (event: any) {});
Player.on('endOfFile', function () {});

const bagpipeChanter = 1166;
const drone = 725;
export const bagpipeInstr = [bagpipeChanter, drone];

export class MidiPlayer {
  playRef: any;
  bpm: number = 80;

  constructor(playRef: any, bpm: number) {
    this.playRef = playRef;
    this.bpm = bpm;

    if (this.playRef.current) {
      this.playRef.current?.setBand256(-5);
      this.playRef.current?.setBand512(-5);
      // this.playRef.current?.setInstrumentVolume(drone, 0.5);
    }
  }

  initPlayer = (handleNote: MidiNoteHandler) => {
    console.log('initPlayer');
    Player.on('midiEvent', (event: any) => {
      if (event.name === 'Note on') {
        this.playNote(event.noteNumber, 0.5);
        handleNote(event.noteNumber);
      }
    });
  };

  playDrone = (note: number, dur: number) => {
    console.log('playDrone', note, dur);
    this.playRef.current?.playChordNow(drone, [note], dur);
  };

  playNote = (note: number, dur: number) => {
    // console.log('note', note);
    // this.playRef.current?.cancelQueue();
    this.playRef.current?.playChordNow(bagpipeChanter, [note], dur - 0.005);
  };

  playMidi = (midi: ArrayBuffer | null, midiData: Midi | null) => {
    if (!midi) {
      return;
    }

    Player.loadArrayBuffer(midi);
    Player.play();
    this.playDrone(46, midiData ? midiData.duration : 0);
  };

  stop = () => {
    console.log('stop');
    this.playRef.current?.cancelQueue();
    Player.stop();
  };
}
