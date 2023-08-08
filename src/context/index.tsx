import { Midi } from "@tonejs/midi";
import { createContext } from "react";
import { Song, SongListByBagpipe } from "../dataset/songs/interfaces";
import { BagpipeTypes, SharpNotesEnum } from "../interfaces";
import { SettingsState, settingsInitialState, useSettingsReducer } from "./reducers/settings";
import { PlayerState, playerInitialState, usePlayerReducer } from "./reducers/player";

export const noSongsLabel = "No song selected";

type State = PlayerState & SettingsState;

const initialState: State = {
  ...settingsInitialState,
  ...playerInitialState,
};

interface Context {
  state: State;
  setMidi: (midi: ArrayBuffer) => void;
  setMetronome: (bool: boolean) => void;
  setMidiData: (midi: Midi) => void;
  setActiveSong: (song: Song) => void;
  setSongLength: (seconds: number) => void;
  setProgress: (percent: number, time?: number, timeRemaining?: number) => void;
  setTempo: (bpm: number) => void;
  togglePianoRoll: (value: boolean) => void;
  setIsPlaying: (bool: boolean) => void;
  setListsByBagpipe: (lists: SongListByBagpipe) => void;
  setBagpipeType: (bagpipeType: BagpipeTypes) => void;
  setScreenSize: (size: { width: number; height: number }) => void;
  setTranspose: (num: number) => void;
  setSongNotes: (notes: SharpNotesEnum[]) => void;
  setIsPreclick: (bool: boolean) => void;
  setLoop: (bool: boolean) => void;
}

const store = createContext<Context>({
  state: initialState,
  setMidi: (midi: ArrayBuffer) => {},
  setMetronome: (bool: boolean) => {},
  setMidiData: (midi: Midi) => {},
  setActiveSong: (song: Song) => {},
  setProgress: (percent: number, time?: number, timeRemaining?: number) => {},
  setTempo: (bpm: number) => {},
  togglePianoRoll: (value: boolean) => {},
  setIsPlaying: (bool: boolean) => {},
  setListsByBagpipe: (lists: SongListByBagpipe) => {},
  setBagpipeType: (bagpipeType: BagpipeTypes) => {},
  setScreenSize: (size: { width: number; height: number }) => {},
  setTranspose: (num: number) => {},
  setSongNotes: (notes: SharpNotesEnum[]) => {},
  setSongLength: (seconds: number) => {},
  setIsPreclick: (bool: boolean) => {},
  setLoop: (bool: boolean) => {}
});
const { Provider } = store;

const ContextProvider = ({ children }: any) => {
  const { state: settingsState, ...settingsDispatchers } = useSettingsReducer();
  const { state: playerState, ...playerDispatchers } = usePlayerReducer();
  const state = { ...settingsState, ...playerState };
  const dispatchers = { ...settingsDispatchers, ...playerDispatchers };

  return (
    <Provider
      value={{
        state,
        ...dispatchers,
      }}
    >
      {children}
    </Provider>
  );
};

export { ContextProvider, store };
