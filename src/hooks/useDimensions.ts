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
    window.addEventListener("resize", setDimensions);

    return () => window.removeEventListener("resize", setDimensions);
  }, []);
};
