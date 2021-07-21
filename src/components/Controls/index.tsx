import React, { useEffect, useState } from "react";
import { MidiFileInput } from "./MidiFileInput";
import styled from "styled-components";
import { Bagpipe } from "../Bagpipe";
import { convertMidiPitchToNote, Modes } from "../../interfaces";
import { getBagpipeData } from "../../utils/bagpipesUtils";
import { PlayStopMidi } from "./MidiPlayer";
import { useMidiPlayer } from "../../utils/useMidiPlayer";
import { Midi } from "@tonejs/midi";
import Transpose from "./Transpose";
import SongList from "../SongList";

interface Props {}

export const Controls = ({}: Props) => {
  const [midi, setMidi] = useState<ArrayBuffer | null>(null);
  const [midiData, setMidiData] = useState<Midi | null>(null);
  const [songList, setSongList] = useState<string[]>([]);
  const [activeSong, setActiveSong] = useState<string | null>(null);
  const [activeNote, setActiveNote] = useState<{
    note: string;
    octave: number;
  } | null>(null);
  const handleNote = (midiPitch: number) => {
    setActiveNote(convertMidiPitchToNote(midiPitch));
  };

  const { Player: midiPlayer, MPlayer } = useMidiPlayer(handleNote);

  const getSongList = async () => {
    const file = await fetch("/midi/list.json");
    const list = await file.json();
    setSongList(list);
  };

  const loadMidiSong = async (fileName: string) => {
    const file = await fetch(`/midi/${fileName}`);
    const buffer = await file.arrayBuffer();
    const midi = new Midi(buffer);
    setMidiData(midi);
    setMidi(buffer);
  };

  useEffect(() => {
    getSongList();
  }, []);

  useEffect(() => {
    if (activeSong) {
      loadMidiSong(activeSong);
    }
  }, [activeSong]);

  return (
    <div>
      <h3>{activeSong?.split(".midi").join("")}</h3>
      <Container>
        <Inputs>
          {/* <MidiFileInput setMidiData={setMidiData} setMidi={setMidi} /> */}
          <Bagpipe
            bagpipe={getBagpipeData(Modes.Mixolidian, "A")}
            activeNote={activeNote}
          />
          <PlayStopMidi
            disabled={!midi}
            playMidi={() => midiPlayer?.playMidi(midi, midiData)}
            stop={midiPlayer?.stop}
          />
          <Transpose setTranspose={midiPlayer?.setTranspose} />
          {MPlayer}
        </Inputs>
        <SongList list={songList} setActiveSong={setActiveSong} />
      </Container>
    </div>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: space-between;
`;
const Inputs = styled.div`
  /* display: flex; */
`;
