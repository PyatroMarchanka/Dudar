import { useState, useEffect, useContext } from "react";
import { store } from "../context";
import { defaultUser, User, UserSettings } from "../interfaces/user";
import { useChangeLanguage } from "../locales";
import { userApi } from "../api/user";

export const useUpdateUserSettings = () => {
  const updateUserSettings = async (settings: Partial<UserSettings>) => {
    await userApi.updateUserSettings(settings);
  };

  return { updateUserSettings };
};

export const useGoogleProfile = () => {
  const {
    setUserData,
    setBagpipeType,
    setIsPreclick,
    setLanguage,
    setTempo,
    setTranspose,
    setIsSilentMode,
    setUserLastSongUrl,
  } = useContext(store);

  const [loading, setLoading] = useState(true);
  const changeLanguage = useChangeLanguage();
  const { updateUserSettings } = useUpdateUserSettings();

  const setAllUserData = (userData: User) => {
    if (!userData) {
      return;
    }
    const {
      bagpipeType,
      isPreclick,
      tempo,
      transpose,
      language,
      isSilentMode,
      lastSongUrl,
    } = userData.settings!;
    if (bagpipeType) {
      setBagpipeType(bagpipeType);
    }
    if (isPreclick) {
      setIsPreclick(isPreclick);
    }
    if (tempo) {
      setTempo(tempo);
    }
    if (transpose) {
      setTranspose(transpose);
    }
    if (language) {
      setLanguage(language);
      changeLanguage(language);
    }
    if (isSilentMode) {
      setIsSilentMode(isSilentMode);
    }
    if (lastSongUrl) {
      setUserLastSongUrl(lastSongUrl);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await userApi.getUserData();
      const data = response;
      setUserData(data);
      if (data) {
        setAllUserData(data);
      } else {
        setAllUserData(defaultUser);
        updateUserSettings(defaultUser.settings!);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return { loading };
};
