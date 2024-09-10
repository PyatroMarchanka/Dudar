import { useReducer } from "react";
import { BagpipeTypes, HolesModes, Languages } from "../../interfaces";
import { SongTags } from "../../dataset/songs/interfaces";

interface Action {
  type:
    | "SET_METRONOME"
    | "SET_TEMPO"
    | "SET_SHOW_PIANO_ROLL"
    | "SET_TRANSPOSE"
    | "SET_BAGPIPE_TYPE"
    | "SET_SIZE"
    | "SET_LOOP"
    | "SET_LOOP_BARS"
    | "SET_IS_PRECLICK"
    | "SET_LANGUAGE"
    | "SET_SONG_TAGS"
    | "SET_ACTIVE_SONG_TAGS"
    | "SET_HOLES_MODE"
    | "SET_USER_DATA";

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
  loopBars: number;
  language: Languages;
  holesMode: HolesModes;
  songTags: SongTags[];
  activeSongTags: SongTags[];
  userData: any;
}
const userData = {
  tempo: 200,
  transpose: 0,
  isPreclick: false,
  bagpipeType: BagpipeTypes.BelarusianTraditionalDuda,
  language: Languages.English,
  holesMode: HolesModes.Fingers,
  loopBars: 1,
};

export const settingsInitialState: SettingsState = {
  metronome: true,
  showPianoRoll: true,
  screenSize: { width: 400, height: 500 },
  loop: false,
  songTags: [],
  activeSongTags: [],
  userData: false,
  ...userData,
};

export const useSettingsReducer = () => {
  const [state, dispatch] = useReducer(
    (state: SettingsState, action: Action) => {
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

        case "SET_LOOP_BARS":
          return {
            ...state,
            loopBars: action.payload,
          };

        case "SET_SIZE":
          return {
            ...state,
            screenSize: {
              width: action.payload.width,
              height: action.payload.height,
            },
          };

        case "SET_LANGUAGE":
          return {
            ...state,
            language: action.payload,
          };

        case "SET_SONG_TAGS":
          return {
            ...state,
            songTags: action.payload,
          };

        case "SET_ACTIVE_SONG_TAGS":
          return {
            ...state,
            activeSongTags: action.payload,
          };

        case "SET_HOLES_MODE":
          return {
            ...state,
            holesMode: action.payload,
          };

        case "SET_USER_DATA":
          return {
            ...state,
            userData: action.payload,
          };
        default:
          return state;
      }
    },
    settingsInitialState
  );

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

  const setLoopBars = (num: number) => {
    dispatch({ type: "SET_LOOP_BARS", payload: num });
  };

  const setScreenSize = (size: { width: number; height: number }) => {
    dispatch({ type: "SET_SIZE", payload: size });
  };

  const setLanguage = (lang: Languages) => {
    dispatch({ type: "SET_LANGUAGE", payload: lang });
  };

  const setHolesMode = (mode: HolesModes) => {
    dispatch({ type: "SET_HOLES_MODE", payload: mode });
  };

  const setSongTags = (tags: SongTags[]) => {
    dispatch({ type: "SET_SONG_TAGS", payload: tags });
  };

  const setActiveSongTags = (tags: SongTags[]) => {
    dispatch({ type: "SET_ACTIVE_SONG_TAGS", payload: tags });
  };

  const setUserData = (data: any) => {
    dispatch({ type: "SET_USER_DATA", payload: data });
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
    setLoopBars,
    setLanguage,
    setHolesMode,
    setSongTags,
    setActiveSongTags,
    setUserData,
  };
};
