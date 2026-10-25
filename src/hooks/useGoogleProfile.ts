import { useState, useEffect, useContext } from "react";
import { store } from "../context";
import { defaultUser, User, UserSettings } from "../interfaces/user";
import { useChangeLanguage } from "../locales";
import { userApi } from "../api/user";
import { loadUserProfile } from "../api/appData";
import { isFluteBrand } from "../brand";
import { BagpipeTypes, Languages } from "../interfaces";
import { fallbackLanguage } from "../i18n";
import { getUserLanguage } from "../constants/localStorage";

export const useUpdateUserSettings = () => {
  const updateUserSettings = async (settings: Partial<UserSettings>) => {
    await userApi.updateUserSettings(settings);
  };

  return { updateUserSettings };
};

// The profile request whose settings were already put into the state. Screens
// and the navbar all call useGoogleProfile, but the settings are applied once
// per profile request, so moving between pages doesn't send new requests or
// undo settings changed in this session.
let appliedProfileRequest: Promise<User | undefined> | undefined;

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
    setIsUserLoggedIn,
    setIsMusicSheet
  } = useContext(store);

  const [loading, setLoading] = useState(true);
  const changeLanguage = useChangeLanguage();

  const setAllUserData = (userData: User) => {
    if (!userData) {
      return;
    }
    const {
      bagpipeType,
      isPreclick,
      tempo,
      transpose: bagpipeTranspose,
      fluteTranspose,
      language,
      isSilentMode,
      lastSongUrl,
      view,
    } = userData.settings;
    const transpose = isFluteBrand ? fluteTranspose : bagpipeTranspose;
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
    if(view) {
      setIsMusicSheet(view === "musicSheets");
    }
    if (language) {
      setLanguage(language);
      changeLanguage(language);
    } else {
      const localLanguage: Languages | null = getUserLanguage() as Languages;
      setLanguage(localLanguage || fallbackLanguage);
      changeLanguage(localLanguage || fallbackLanguage);
    }
    if (isSilentMode) {
      setIsSilentMode(isSilentMode);
    }
    if (lastSongUrl) {
      setUserLastSongUrl(lastSongUrl);
    }
  };

  const fetchUserProfile = async () => {
    const request = loadUserProfile();
    if (request === appliedProfileRequest) {
      setLoading(false);
      return;
    }
    appliedProfileRequest = request;

    try {
      const data = await request;
      setUserData(data);
      if (data) {
        setAllUserData(data);
        setIsUserLoggedIn(true);
      } else {
        const settings = {
          ...defaultUser.settings,
          bagpipeType: BagpipeTypes.BelarusianTraditionalDuda,
        } as UserSettings;

        setAllUserData({ ...defaultUser, settings });
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
