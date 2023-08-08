import { Midi } from "@tonejs/midi";
import { useReducer } from "react";
import { Song, SongListByBagpipe } from "../../dataset/songs/interfaces";
import { getUserDataFromLocal } from "../../hooks/useLocalStorage";
import { SharpNotesEnum } from "../../interfaces";

interface Action {
  type:
    | "SET_MIDI"
    | "SET_MIDI_DATA"
    | "SET_ACTIVE_SONG"
    | "SET_PROGRESS"
    | "SET_IS_PLAYING"
    | "SET_LISTS_BY_BAGPIPE"
    | "SET_SONG_NOTES"
    | "SET_SONG_LENGTH";

  payload?: any;
}

export const noSongsLabel = "No song selected";

export interface PlayerState {
  midiData: Midi | null;
  songNotes: SharpNotesEnum[] | null;
  midi: ArrayBuffer | null;
  activeSong: Song | undefined;
  songLength?: number;
  progress?: { percent: number; time?: number; timeRemaining?: number };
  isPlaying: boolean;
  listsByBagpipe: SongListByBagpipe | null;
}

export const playerInitialState: PlayerState = {
  midiData: null,
  songNotes: null,
  midi: null,
  progress: { percent: 0, time: 0, timeRemaining: 0 },
  isPlaying: false,
  listsByBagpipe: null,
  songLength: 0,
  activeSong: undefined,
};

export const usePlayerReducer = () => {
  const [state, dispatch] = useReducer((state: PlayerState, action: Action) => {
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

      case "SET_SONG_NOTES":
        return {
          ...state,
          songNotes: action.payload,
        };

      default:
        return state;
    }
  }, playerInitialState);

  const setMidi = (midi: ArrayBuffer) => {
    dispatch({ type: "SET_MIDI", payload: midi });
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

  const setIsPlaying = (bool: boolean) => {
    dispatch({ type: "SET_IS_PLAYING", payload: bool });
  };

  const setListsByBagpipe = (list: SongListByBagpipe) => {
    dispatch({ type: "SET_LISTS_BY_BAGPIPE", payload: list });
  };

  const setSongNotes = (songNotes: SharpNotesEnum[]) => {
    dispatch({ type: "SET_SONG_NOTES", payload: songNotes });
  };

  const setSongLength = (songLength: number) => {
    dispatch({ type: "SET_SONG_LENGTH", payload: songLength });
  };

  return {
    state,
    setMidi,
    setMidiData,
    setActiveSong,
    setProgress,
    setIsPlaying,
    setListsByBagpipe,
    setSongNotes,
    setSongLength,
  };
};
