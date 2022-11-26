import { Midi } from "@tonejs/midi";
import React, { createContext, useReducer } from "react";

interface Action {
  type:
    | "SET_MIDI"
    | "SET_MIDI_DATA"
    | "SET_ACTIVE_SONG"
    | "SET_PROGRESS"
    | "SET_TEMPO"
    | "SET_SHOW_PIANO_ROLL"
    | "SET_IS_PLAYING"
    | "SET_GENRE_LIST"
    | "SET_ALL_LISTS"
    | "SET_SIZE"
    | "SET_IS_CLOSED_MANER";

  payload?: any;
}

export const noSongsLabel = "No song selected";

interface State {
  midiData: Midi | null;
  midi: ArrayBuffer | null;
  activeSong: string | undefined;
  progress?: number;
  tempo: number;
  showPianoRoll: boolean;
  isPlaying: boolean;
  genreList?: string;
  allLists: any;
  isClosedManer: boolean;
  screenSize: { width: number; height: number };
}

const initialState: State = {
  midiData: null,
  midi: null,
  progress: 0,
  activeSong: "Palaestinalied.mid",
  genreList: "medieval",
  tempo: 240,
  showPianoRoll: true,
  isPlaying: false,
  allLists: {},
  isClosedManer: false,
  screenSize: { width: 400, height: 500 },
};

interface Context {
  state: State;
  dispatch: (action: Action) => void;
  setMidi: (midi: ArrayBuffer) => void;
  setMidiData: (midi: Midi) => void;
  setActiveSong: (fileName: string) => void;
  setProgress: (percent: number) => void;
  setTempo: (bpm: number) => void;
  togglePianoRoll: (value: boolean) => void;
  setIsPlaying: (bool: boolean) => void;
  setGenreList: (list: string) => void;
  setAllLists: (lists: any) => void;
  setIsClosedManer: (bool: boolean) => void;
  setScreenSize: (size: { width: number; height: number }) => void;
}

const store = createContext<Context>({
  state: initialState,
  dispatch: () => {},
  setMidi: (midi: ArrayBuffer) => {},
  setMidiData: (midi: Midi) => {},
  setActiveSong: (fileName: string) => {},
  setProgress: (percent: number) => {},
  setTempo: (bpm: number) => {},
  togglePianoRoll: (value: boolean) => {},
  setIsPlaying: (bool: boolean) => {},
  setGenreList: (list: string) => {},
  setAllLists: (lists: any) => {},
  setIsClosedManer: (bool: boolean) => {},
  setScreenSize: (size: { width: number; height: number }) => {},
});
const { Provider } = store;

const ContextProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer((state: State, action: Action) => {
    switch (action.type) {
      case "SET_MIDI":
        return {
          ...state,
          midi: action.payload,
        };

      case "SET_MIDI_DATA":
        return {
          ...state,
          midiData: action.payload,
        };

      case "SET_ACTIVE_SONG":
        return {
          ...state,
          activeSong: action.payload,
        };

      case "SET_PROGRESS":
        const progressValue = 100 - action.payload;
        if (state.progress !== progressValue) {
          return {
            ...state,
            progress: progressValue,
          };
        } else {
          return state;
        }

      case "SET_TEMPO":
        return {
          ...state,
          tempo: action.payload,
        };

      case "SET_SHOW_PIANO_ROLL":
        return {
          ...state,
          showPianoRoll: action.payload,
        };

      case "SET_IS_PLAYING":
        return {
          ...state,
          isPlaying: action.payload,
        };

      case "SET_GENRE_LIST":
        return {
          ...state,
          genreList: action.payload,
        };

      case "SET_ALL_LISTS":
        return {
          ...state,
          allLists: action.payload,
        };

      case "SET_SIZE":
        return {
          ...state,
          screenSize: {
            width: action.payload.width,
            height: action.payload.height,
          },
        };

      case "SET_IS_CLOSED_MANER":
        return {
          ...state,
          isClosedManer: action.payload,
        };

      default:
        return state;
    }
  }, initialState);

  const setMidi = (midi: ArrayBuffer) => {
    dispatch({ type: "SET_MIDI", payload: midi });
  };

  const setMidiData = (midi: Midi) => {
    dispatch({ type: "SET_MIDI_DATA", payload: midi });
  };
  const setActiveSong = (fileName: string) => {
    dispatch({
      type: "SET_ACTIVE_SONG",
      payload: fileName.split("_").join(" "),
    });
  };

  const setProgress = (percent: number) => {
    dispatch({ type: "SET_PROGRESS", payload: percent });
  };

  const setTempo = (bpm: number) => {
    dispatch({ type: "SET_TEMPO", payload: bpm });
  };

  const togglePianoRoll = (bool: boolean) => {
    dispatch({ type: "SET_SHOW_PIANO_ROLL", payload: bool });
  };

  const setIsPlaying = (bool: boolean) => {
    dispatch({ type: "SET_IS_PLAYING", payload: bool });
  };

  const setGenreList = (list: string) => {
    dispatch({ type: "SET_GENRE_LIST", payload: list });
  };

  const setAllLists = (list: any) => {
    dispatch({ type: "SET_ALL_LISTS", payload: list });
  };

  const setIsClosedManer = (bool: boolean) => {
    dispatch({ type: "SET_IS_CLOSED_MANER", payload: bool });
  };

  const setScreenSize = (size: { width: number; height: number }) => {
    dispatch({ type: "SET_SIZE", payload: size });
  };

  return (
    <Provider
      value={{
        state,
        dispatch,
        setMidi,
        setMidiData,
        setActiveSong,
        setProgress,
        setTempo,
        togglePianoRoll,
        setIsPlaying,
        setGenreList,
        setAllLists,
        setIsClosedManer,
        setScreenSize,
      }}
    >
      {children}
    </Provider>
  );
};

export { ContextProvider, store };
