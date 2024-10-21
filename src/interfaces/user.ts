import { BagpipeTypes, Languages } from ".";

export interface User {
  name?: string;
  email?: string;
  picture?: string;
  settings: UserSettings;
}

export interface UserSettings {
  bagpipeType: BagpipeTypes;
  tempo: number;
  isPreclick: boolean;
  language: Languages;
  transpose: number;
  isSilentMode: boolean;
}

export const defaultUser: User = {
  settings: {
    bagpipeType: BagpipeTypes.BelarusianTraditionalDuda,
    tempo: 240,
    isPreclick: false,
    language: Languages.English,
    transpose: 0,
    isSilentMode: false,
  },
};
