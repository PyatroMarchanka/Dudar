import { BagpipeTypes, Languages } from ".";

export interface User {
    name?: string;
    email?: string;
    picture?: string;
    settings?: UserSettings;
}

export interface UserSettings {
    bagpipe?: BagpipeTypes;
    tempo?: number;
    userPreclick?: boolean;
    language?: Languages;
}