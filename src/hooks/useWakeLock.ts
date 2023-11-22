import { useEffect } from "react";

export const useWakeLock = () => {
  const getScreenLock = async () => {
    if ("wakeLock" in window.navigator) {
      let screenLock;
      try {
        screenLock = await navigator.wakeLock.request("screen");
      } catch (err) {
        console.log(err);
      }

      return screenLock;
    }
  };

  useEffect(() => {
    getScreenLock();
  }, []);
};
