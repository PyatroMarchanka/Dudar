import { useReducer } from "react";
import { BagpipeTypes } from "../../interfaces";
import { getUserDataFromLocal } from "../../hooks/useLocalStorage";

interface Action {
  type:
    | "SET_METRONOME"
    | "SET_TEMPO"
    | "SET_SHOW_PIANO_ROLL"
    | "SET_TRANSPOSE"
    | "SET_BAGPIPE_TYPE"
    | "SET_SIZE"
    | "SET_LOOP"
    | "SET_IS_PRECLICK";

  payload?: any;
}

export const noSongsLabel = "No song selected";

export interface SettingsState {
  metronome: boolean;
  tempo: number;
  showPianoRoll: boolean;
  bagpipeType: BagpipeTypes;
  transpose: number;
  isPreclick: boolean;
  screenSize: { width: number; height: number };
  loop: boolean;
}
const userData = getUserDataFromLocal();

export const settingsInitialState: SettingsState = {
  metronome: true,
  showPianoRoll: true,
  screenSize: { width: 400, height: 500 },
  loop: true,
  ...userData,
};

export const useSettingsReducer = () => {
  const [state, dispatch] = useReducer((state: SettingsState, action: Action) => {
    switch (action.type) {
      case "SET_METRONOME":
        return {
          ...state,
          metronome: action.payload,
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

      case "SET_BAGPIPE_TYPE":
        return {
          ...state,
          bagpipeType: action.payload,
        };

      case "SET_TRANSPOSE":
        return {
          ...state,
          transpose: action.payload,
        };

      case "SET_IS_PRECLICK":
        return {
          ...state,
          isPreclick: action.payload,
        };

      case "SET_LOOP":
        return {
          ...state,
          loop: action.payload,
        };

      case "SET_SIZE":
        return {
          ...state,
          screenSize: {
            width: action.payload.width,
            height: action.payload.height,
          },
        };
      default:
        return state;
    }
  }, settingsInitialState);

  const setMetronome = (bool: boolean) => {
    dispatch({ type: "SET_METRONOME", payload: bool });
  };

  const setTempo = (bpm: number) => {
    dispatch({ type: "SET_TEMPO", payload: bpm });
  };

  const togglePianoRoll = (bool: boolean) => {
    dispatch({ type: "SET_SHOW_PIANO_ROLL", payload: bool });
  };

  const setBagpipeType = (bagpipeType: BagpipeTypes) => {
    dispatch({ type: "SET_BAGPIPE_TYPE", payload: bagpipeType });
  };

  const setTranspose = (num: number) => {
    dispatch({ type: "SET_TRANSPOSE", payload: num });
  };

  const setIsPreclick = (bool: boolean) => {
    dispatch({ type: "SET_IS_PRECLICK", payload: bool });
  };

  const setLoop = (bool: boolean) => {
    dispatch({ type: "SET_LOOP", payload: bool });
  };

  const setScreenSize = (size: { width: number; height: number }) => {
    dispatch({ type: "SET_SIZE", payload: size });
  };

  return {
    state,
    setMetronome,
    setTempo,
    togglePianoRoll,
    setBagpipeType,
    setTranspose,
    setIsPreclick,
    setScreenSize,
    setLoop,
  };
};
