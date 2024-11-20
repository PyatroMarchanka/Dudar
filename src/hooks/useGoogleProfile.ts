import { useState, useEffect, useContext } from "react";
import { store } from "../context";
import { defaultUser, User, UserSettings } from "../interfaces/user";
import { useChangeLanguage } from "../locales";
import { userApi } from "../api/user";
import { BagpipeTypes, Languages } from "../interfaces";
import { fallbackLanguage } from "../i18n";
import { getUserLanguage } from "../constants/localStorage";

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
    setIsUserLoggedIn
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
    } else {
      const localLanguage: Languages | null = getUserLanguage() as Languages;
      setLanguage(localLanguage ? localLanguage : fallbackLanguage);
      changeLanguage(localLanguage ? localLanguage : fallbackLanguage);
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
        setIsUserLoggedIn(true);
      } else {
        const settings = {
          ...defaultUser.settings!,
          bagpipeType: BagpipeTypes.BelarusianTraditionalDuda,
        } as UserSettings;

        setAllUserData({ ...defaultUser, settings });
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
