// useFetchGoogleUserProfile.ts
import { useState, useEffect, useContext } from "react";
import { store } from "../context";
import { userApi } from "../api/user";

export const useFetchGoogleUserProfile = () => {
  const {
    setUserData,
    setBagpipeType,
    setIsPreclick,
    setLanguage,
    setTempo,
  } = useContext(store);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const setAllUserData = (userData: any) => {
    if (!userData) {
      return;
    }
    setBagpipeType(userData.settings.bagpipe);
    setIsPreclick(userData.settings.userPreclick);
    setTempo(userData.settings.tempo);
    setLanguage(userData.settings.language);
  };

  const fetchUserProfile = async () => {
    try {
      const response = await userApi.getUserData();

      if (!response) {
        throw new Error("Failed to fetch user profile");
      }

      const data = response;
      setUserData(data);
      setAllUserData(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return { loading, error };
};
