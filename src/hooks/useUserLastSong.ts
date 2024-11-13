import { useContext } from "react";
import { userApi } from "../api/user";
import { store } from "../context";

export const useUserLastSong = () => {
  const { setUserLastSongUrl } = useContext(store);

  const updateUserLastSong = async (userLastSongUrl: string) => {
    setUserLastSongUrl(userLastSongUrl);

    await userApi.updateUserSettings({
      lastSongUrl: userLastSongUrl,
    });
  };

  return { updateUserLastSong };
};
