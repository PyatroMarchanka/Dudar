import { Midi } from "@tonejs/midi";
import { createContext, useReducer } from "react";
import { Song, SongListByBagpipe } from "../dataset/songs/interfaces";
import { getUserDataFromLocal } from "../hooks/useLocalStorage";
import { BagpipeTypes, SharpNotesEnum } from "../interfaces";

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
    | "SET_LISTS_BY_BAGPIPE"
    | "SET_SIZE"
    | "SET_TRANSPOSE"
    | "SET_BAGPIPE_TYPE"
    | "SET_SONG_NOTES"
    | "SET_IS_PRECLICK"
    | "SET_SONG_LENGTH";

  payload?: any;
}

export const noSongsLabel = "No song selected";

interface State {
  midiData: Midi | null;
  songNotes: SharpNotesEnum[] | null;
  midi: ArrayBuffer | null;
  metronome: boolean;
  activeSong: Song | undefined;
  songLength?: number;
  progress?: { percent: number; time?: number; timeRemaining?: number };
  tempo: number;
  showPianoRoll: boolean;
  isPlaying: boolean;
  listsByBagpipe: SongListByBagpipe | null;
  bagpipeType: BagpipeTypes;
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
  listsByBagpipe: null,
  screenSize: { width: 400, height: 500 },
  songLength: 0,
  activeSong: undefined,
  ...userData,
};

interface Context {
  state: State;
  dispatch: (action: Action) => void;
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
}

const store = createContext<Context>({
  state: initialState,
  dispatch: () => {},
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

      case "SET_LISTS_BY_BAGPIPE":
        return {
          ...state,
          listsByBagpipe: action.payload,
        };

      case "SET_SIZE":
        return {
          ...state,
          screenSize: {
            width: action.payload.width,
            height: action.payload.height,
          },
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
  const setActiveSong = (song: Song) => {
    dispatch({
      type: "SET_ACTIVE_SONG",
      payload: song,
    });
  };

  const setProgress = (percent: number, time?: number, timeRemaining?: number) => {
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

  const setListsByBagpipe = (list: SongListByBagpipe) => {
    dispatch({ type: "SET_LISTS_BY_BAGPIPE", payload: list });
  };

  const setBagpipeType = (bagpipeType: BagpipeTypes) => {
    dispatch({ type: "SET_BAGPIPE_TYPE", payload: bagpipeType });
  };

  const setScreenSize = (size: { width: number; height: number }) => {
    dispatch({ type: "SET_SIZE", payload: size });
  };

  const setTranspose = (num: number) => {
    dispatch({ type: "SET_TRANSPOSE", payload: num });
  };

  const setSongNotes = (songNotes: SharpNotesEnum[]) => {
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
        setListsByBagpipe,
        setBagpipeType,
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
