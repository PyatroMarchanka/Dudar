import { Midi } from "@tonejs/midi";
import React, { createContext, useReducer } from "react";
import { getUserDataFromLocal } from "../hooks/useLocalStorage";
import { SharpNotes } from "../interfaces";

interface Action {
  type:
    | "SET_MIDI"
    | "SET_METRONOME"
    | "SET_MIDI_DATA"
    | "SET_ACTIVE_SONG"
    | "SET_PROGRESS"
    | "SET_TEMPO"
    | "SET_SHOW_PIANO_ROLL"
    | "SET_IS_PLAYING"
    | "SET_ALL_LISTS"
    | "SET_SIZE"
    | "SET_TRANSPOSE"
    | "SET_IS_CLOSED_MANER"
    | "SET_SONG_NOTES"
    | "SET_IS_PRECLICK"
    | "SET_SONG_LENGTH";

  payload?: any;
}

export const noSongsLabel = "No song selected";

interface State {
  midiData: Midi | null;
  songNotes: SharpNotes[] | null;
  midi: ArrayBuffer | null;
  metronome: boolean;
  activeSong: string | undefined;
  songLength?: number;
  progress?: { percent: number; time?: number; timeRemaining?: number };
  tempo: number;
  showPianoRoll: boolean;
  isPlaying: boolean;
  allLists: any;
  isClosedManer: boolean;
  screenSize: { width: number; height: number };
  transpose: number;
  isPreclick: boolean;
}
const userData = getUserDataFromLocal();

const initialState: State = {
  metronome: true,
  midiData: null,
  songNotes: null,
  midi: null,
  progress: { percent: 0, time: 0, timeRemaining: 0 },
  showPianoRoll: true,
  isPlaying: false,
  allLists: {},
  isClosedManer: false,
  screenSize: { width: 400, height: 500 },
  songLength: 0,
  isPreclick: true,
  ...userData,
};

interface Context {
  state: State;
  dispatch: (action: Action) => void;
  setMidi: (midi: ArrayBuffer) => void;
  setMetronome: (bool: boolean) => void;
  setMidiData: (midi: Midi) => void;
  setActiveSong: (fileName: string) => void;
  setSongLength: (seconds: number) => void;
  setProgress: (percent: number, time?: number, timeRemaining?: number) => void;
  setTempo: (bpm: number) => void;
  togglePianoRoll: (value: boolean) => void;
  setIsPlaying: (bool: boolean) => void;
  setAllLists: (lists: any) => void;
  setIsClosedManer: (bool: boolean) => void;
  setScreenSize: (size: { width: number; height: number }) => void;
  setTranspose: (num: number) => void;
  setSongNotes: (notes: SharpNotes[]) => void;
  setIsPreclick: (bool: boolean) => void;
}

const store = createContext<Context>({
  state: initialState,
  dispatch: () => {},
  setMidi: (midi: ArrayBuffer) => {},
  setMetronome: (bool: boolean) => {},
  setMidiData: (midi: Midi) => {},
  setActiveSong: (fileName: string) => {},
  setProgress: (percent: number, time?: number, timeRemaining?: number) => {},
  setTempo: (bpm: number) => {},
  togglePianoRoll: (value: boolean) => {},
  setIsPlaying: (bool: boolean) => {},
  setAllLists: (lists: any) => {},
  setIsClosedManer: (bool: boolean) => {},
  setScreenSize: (size: { width: number; height: number }) => {},
  setTranspose: (num: number) => {},
  setSongNotes: (notes: SharpNotes[]) => {},
  setSongLength: (seconds: number) => {},
  setIsPreclick: (bool: boolean) => {},
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

      case "SET_METRONOME":
        return {
          ...state,
          metronome: action.payload,
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
        const progressValue = action.payload.percent;
        if (state.progress?.percent !== progressValue) {
          return {
            ...state,
            progress: {
              percent: progressValue,
              time: action.payload.time,
              timeRemaining: action.payload.timeRemaining,
            },
          };
        } else {
          return state;
        }

      case "SET_SONG_LENGTH":
        return {
          ...state,
          songLength: action.payload,
        };

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

      case "SET_TRANSPOSE":
        return {
          ...state,
          transpose: action.payload,
        };

      case "SET_SONG_NOTES":
        return {
          ...state,
          songNotes: action.payload,
        };

      default:
        return state;
    }
  }, initialState);

  const setMidi = (midi: ArrayBuffer) => {
    dispatch({ type: "SET_MIDI", payload: midi });
  };

  const setMetronome = (bool: boolean) => {
    dispatch({ type: "SET_METRONOME", payload: bool });
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

  const setProgress = (
    percent: number,
    time?: number,
    timeRemaining?: number
  ) => {
    dispatch({
      type: "SET_PROGRESS",
      payload: { percent: 100 - percent, time, timeRemaining },
    });
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

  const setAllLists = (list: any) => {
    dispatch({ type: "SET_ALL_LISTS", payload: list });
  };

  const setIsClosedManer = (bool: boolean) => {
    dispatch({ type: "SET_IS_CLOSED_MANER", payload: bool });
  };

  const setScreenSize = (size: { width: number; height: number }) => {
    dispatch({ type: "SET_SIZE", payload: size });
  };

  const setTranspose = (num: number) => {
    dispatch({ type: "SET_TRANSPOSE", payload: num });
  };

  const setSongNotes = (songNotes: SharpNotes[]) => {
    dispatch({ type: "SET_SONG_NOTES", payload: songNotes });
  };

  const setSongLength = (songLength: number) => {
    dispatch({ type: "SET_SONG_LENGTH", payload: songLength });
  };

  const setIsPreclick = (bool: boolean) => {
    dispatch({ type: "SET_IS_PRECLICK", payload: bool });
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
        setAllLists,
        setIsClosedManer,
        setScreenSize,
        setTranspose,
        setSongNotes,
        setMetronome,
        setSongLength,
        setIsPreclick,
      }}
    >
      {children}
    </Provider>
  );
};

export { ContextProvider, store };
