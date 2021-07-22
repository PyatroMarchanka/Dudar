import { Midi } from "@tonejs/midi";
import React, { createContext, useReducer } from "react";

interface Action {
  type: "SET_MIDI" | "SET_MIDI_DATA" | "SET_ACTIVE_SONG" | "SET_PROGRESS";

  payload?: any;
}

interface State {
  midiData: Midi | null;
  midi: ArrayBuffer | null;
  activeSong?: string | undefined;
  progress?: number;
}

const initialState: State = {
  midiData: null,
  midi: null,
  progress: 0,
};

interface Context {
  state: State;
  dispatch: (action: Action) => void;
  setMidi: (midi: ArrayBuffer) => void;
  setMidiData: (midi: Midi) => void;
  setActiveSong: (fileName: string) => void;
  setProgress: (percent: number) => void;
}

const store = createContext<Context>({
  state: initialState,
  dispatch: () => {},
  setMidi: (midi: ArrayBuffer) => {},
  setMidiData: (midi: Midi) => {},
  setActiveSong: (fileName: string) => {},
  setProgress: (percent: number) => {},
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
    dispatch({ type: "SET_ACTIVE_SONG", payload: fileName });
  };

  const setProgress = (percent: number) => {
    dispatch({ type: "SET_PROGRESS", payload: percent });
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
      }}
    >
      {children}
    </Provider>
  );
};

export { ContextProvider, store };
