import { useState, useEffect, useContext, useCallback } from "react";
import { store } from "../context";
import { userApi } from "../api/user";
import { User, UserSettings } from "../interfaces/user";
import { useChangeLanguage } from "../locales";

export const useGoogleProfile = () => {
  const {
    setUserData,
    setBagpipeType,
    setIsPreclick,
    setLanguage,
    setTempo,
    setTranspose,
  } = useContext(store);

  const [loading, setLoading] = useState(true);
  const changeLanguage = useChangeLanguage();

  const setAllUserData = (userData: User) => {
    if (!userData) {
      return;
    }
    const { bagpipe, userPreclick, tempo, transpose, language } =
      userData.settings!;
    if (bagpipe) {
      setBagpipeType(bagpipe);
    }
    if (userPreclick) {
      setIsPreclick(userPreclick);
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
  };

  const fetchUserProfile = async () => {
    try {
      const response = await userApi.getUserData();

      const data = response;
      setUserData(data);

      if (data) {
        setAllUserData(data);
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

export const useUpdateUserSettings = () => {
  const {
    state: { tempo, language, isPreclick, transpose, bagpipeType, isSilentMode },
  } = useContext(store);

  const updateUserSettings = useCallback(
    async (settings: UserSettings) => {
      const newSettings = {
        tempo,
        transpose,
        userPreclick: isPreclick,
        bagpipe: bagpipeType,
        language,
        isSilentMode,
        ...settings,
      };
      await userApi.updateUserSettings(newSettings);
    },
    [tempo, language, isPreclick, transpose, bagpipeType]
  );

  return { updateUserSettings };
};
