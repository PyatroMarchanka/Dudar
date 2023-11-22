import { useEffect } from "react";

export const useWakeLock = () => {
  const getScreenLock = async () => {
    if ("wakeLock" in window.navigator) {
      let screenLock;
      try {
        screenLock = await (navigator as any).wakeLock.request("screen");
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
