import { useState, useEffect, useContext, useCallback } from "react";
import { store } from "../context";
import { localstorageUserApi as userApi } from "../api/user";
import { defaultUser, User, UserSettings } from "../interfaces/user";
import { useChangeLanguage } from "../locales";

export const useUpdateUserSettings = () => {
  const {
    state: {
      tempo,
      language,
      isPreclick,
      transpose,
      bagpipeType,
      isSilentMode,
    },
  } = useContext(store);

  const updateUserSettings = useCallback(
    async (settings: Partial<UserSettings>) => {
      const newSettings: UserSettings = {
        tempo,
        transpose,
        isPreclick,
        bagpipeType,
        language,
        isSilentMode,
        ...settings,
      };
      userApi.updateUserSettings({ settings: newSettings });
    },
    [tempo, language, isPreclick, transpose, bagpipeType]
  );

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
  };

  const fetchUserProfile = async () => {
    try {
      const response = userApi.getUserData();

      const data = response;
      setUserData(data);
      console.log("data", data);
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
