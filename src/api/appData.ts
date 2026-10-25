import { Song } from '../dataset/songs/interfaces';
import { User } from '../interfaces/user';
import { songApi } from './songClient';
import { userApi } from './user';

// The song catalog and the user profile are needed by almost every screen.
// Each one is requested once, as soon as the bundle runs, and every hook that
// needs it shares the same request instead of sending its own.

let songListRequest: Promise<Song[]> | undefined;
let userProfileRequest: Promise<User | undefined> | undefined;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// A cold or briefly unreachable server shouldn't leave the app without songs
const getSongListWithRetry = async (attempts = 3): Promise<Song[]> => {
  try {
    return await songApi.getSongList();
  } catch (error) {
    if (attempts <= 1) throw error;
    await wait(1000);
    return getSongListWithRetry(attempts - 1);
  }
};

export const loadSongList = () => {
  if (!songListRequest) {
    songListRequest = getSongListWithRetry().catch((error) => {
      // Let the next caller try again
      songListRequest = undefined;
      throw error;
    });
  }
  return songListRequest;
};

export const loadUserProfile = () => {
  if (!userProfileRequest) {
    userProfileRequest = userApi.getUserData();
  }
  return userProfileRequest;
};

// After a login the profile has to be fetched again
export const resetUserProfile = () => {
  userProfileRequest = undefined;
};

export const preloadAppData = () => {
  loadSongList().catch(() => {});
  loadUserProfile();
};
