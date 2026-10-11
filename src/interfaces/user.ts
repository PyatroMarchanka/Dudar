import { BagpipeTypes, Languages } from ".";
import { getUserLanguage } from "../constants/localStorage";

export interface User {
  name?: string;
  email?: string;
  picture?: string;
  settings: UserSettings;
  _id?: string;
  isAdmin?: boolean;
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
  isSilentMode?: boolean;
  lastSongUrl?: string;
  view: Views;
}
// Settings that belong to the flute site only, stored apart from the bagpipe ones
export const fluteSettingsKeys = ["transpose", "tempo", "lastSongUrl"] as const;
export type FluteSettings = Pick<UserSettings, typeof fluteSettingsKeys[number]>;

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
