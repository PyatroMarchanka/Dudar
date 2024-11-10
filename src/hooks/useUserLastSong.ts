import { useCallback, useContext, useEffect } from "react";
import { userApi } from "../api/user";
import { store } from "../context";

export const useUserLastSong = () => {
  const {
    state: { activeSong },

    setUserLastSongUrl,
  } = useContext(store);

  const updateUserLastSong = useCallback(
    async (userLastSongUrl: string) => {
      setUserLastSongUrl(userLastSongUrl);

      await userApi.updateUserSettings({
        lastSongUrl: userLastSongUrl,
      });
    },
    [setUserLastSongUrl]
  );

  return { updateUserLastSong };
};
