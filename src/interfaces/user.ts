import { BagpipeTypes, Languages } from ".";
import { getUserLanguage } from "../constants/localStorage";

export interface User {
  name?: string;
  email?: string;
  picture?: string;
  settings: UserSettings;
  _id?: string;
  isAdmin?: boolean;
  // `id`s of the songs the user marked as favorite
  favoriteSongs?: string[];
}

export enum Views {
  Bagpipe = "bagpipe",
  MusicSheets = "musicSheets",
}

export interface UserSettings {
  bagpipeType: BagpipeTypes;
  tempo: number;
  isPreclick: boolean;
  language: Languages;
  transpose: number;
  // Whistle key on the flute site, kept apart from the bagpipe `transpose`
  fluteTranspose?: number;
  isSilentMode?: boolean;
  lastSongUrl?: string;
  view: Views;
}
export const defaultUser: User = {
  settings: {
    bagpipeType: BagpipeTypes.BelarusianTraditionalDuda,
    tempo: 240,
    isPreclick: false,
    language: getUserLanguage() || Languages.English,
    transpose: 0,
    isSilentMode: false,
    view: Views.Bagpipe,
  },
};
