import { useContext, useEffect } from "react";
import { store } from "../context";

export const useDimensions = () => {
  const { setScreenSize } = useContext(store);

  const setDimensions = () => {
    const height = window.innerHeight;
    const width = window.innerWidth;

    setScreenSize({ width, height });
  };

  useEffect(() => {
    setDimensions();
    // iOS Safari does not always fire "resize" when the keyboard closes, so measure again shortly after
    // mount and on viewport changes.
    const timeout = window.setTimeout(setDimensions, 500);
    window.addEventListener("resize", setDimensions);
    window.addEventListener("orientationchange", setDimensions);
    window.visualViewport?.addEventListener("resize", setDimensions);

    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("resize", setDimensions);
      window.removeEventListener("orientationchange", setDimensions);
      window.visualViewport?.removeEventListener("resize", setDimensions);
    };
  }, []);
};
