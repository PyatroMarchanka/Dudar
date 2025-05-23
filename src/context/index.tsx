import { Midi } from "@tonejs/midi";
import { createContext, useEffect } from "react";
import { Song, SongListByBagpipe, SongTags } from "../dataset/songs/interfaces";
import {
  BagpipeTypes,
  HolesModes,
  Languages,
  SharpNotesEnum,
} from "../interfaces";
import {
  SettingsState,
  settingsInitialState,
  useSettingsReducer,
} from "./reducers/settings";
import {
  PlayerState,
  playerInitialState,
  usePlayerReducer,
} from "./reducers/player";
import { useChangeLanguage } from "../locales";

export const noSongsLabel = "No song selected";

type State = PlayerState & SettingsState;

const initialState: State = {
  ...settingsInitialState,
  ...playerInitialState,
};

interface Context {
  state: State;
  setMidi: (midi: ArrayBuffer) => void;
  setLanguage: (lang: Languages) => void;
  setMetronome: (bool: boolean) => void;
  setMidiData: (midi: Midi) => void;
  setActiveSong: (song: Song | null) => void;
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
  setLoopBars: (num: number) => void;
  setLoop: (bool: boolean) => void;
  setIsSongLoading: (bool: boolean) => void;
  setHolesMode: (mode: HolesModes) => void;
  setSongTags: (tags: SongTags[]) => void;
  setActiveSongTags: (tags: SongTags[]) => void;
  setUserData: (data: any) => void;
  setIsSilentMode: (bool: boolean) => void;
  setUserLastSongUrl: (url: string) => void;
  setIsSongUnavailable: (bool: boolean) => void;
  setIsUserLoggedIn: (bool: boolean) => void;
  setIsMusicSheet: (bool: boolean) => void;
}

const store = createContext<Context>({
  state: initialState,
  setMidi: (midi: ArrayBuffer) => {},
  setLanguage: (lang: Languages) => {},
  setMetronome: (bool: boolean) => {},
  setMidiData: (midi: Midi) => {},
  setActiveSong: (song: Song | null) => {},
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
  setLoop: (bool: boolean) => {},
  setLoopBars: (num: number) => {},
  setIsSongLoading: (bool: boolean) => {},
  setHolesMode: (mode: HolesModes) => {},
  setSongTags: (tags: SongTags[]) => {},
  setActiveSongTags: (tags: SongTags[]) => {},
  setUserData: (data: any) => {},
  setIsSilentMode: (bool: boolean) => {},
  setUserLastSongUrl: (url: string) => {},
  setIsSongUnavailable: (bool: boolean) => {},
  setIsUserLoggedIn: (bool: boolean) => {},
  setIsMusicSheet: (bool: boolean) => {},
});
const { Provider } = store;

const ContextProvider = ({ children }: any) => {
  const { state: settingsState, ...settingsDispatchers } = useSettingsReducer();
  const { state: playerState, ...playerDispatchers } = usePlayerReducer();
  const state = { ...settingsState, ...playerState };
  const dispatchers = { ...settingsDispatchers, ...playerDispatchers };
  const changeLanguage = useChangeLanguage();

  useEffect(() => {
    changeLanguage(settingsState.language);
  }, []);

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
