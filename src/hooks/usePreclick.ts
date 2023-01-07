import { useContext, useEffect, useState } from "react";
import { store } from "../context";

interface Props {
  isOpen: boolean;
  setIsOpen: (bool: boolean) => void;
}
export const usePreclick = ({ isOpen, setIsOpen }: Props) => {
  const {
    state: { isPreclick, tempo },
  } = useContext(store);
  const tickTime = (60 / tempo) * 1000 * 2;

  const [interval, setUpInterval] = useState<NodeJS.Timeout | null>(null);
  let [tickIdx, setTickIdx] = useState(0);

  const startPreclick = () => {
    if (!isPreclick) {
      return;
    }
    setIsOpen(true);
    const interval = setInterval(() => {
      setTickIdx(++tickIdx);
    }, tickTime);

    setUpInterval(interval);
  };

  useEffect(() => {
    if (tickIdx > 3) {
      interval && clearInterval(interval);
      setTickIdx(0);
      setIsOpen(false);
    }
  }, [tickIdx]);

  return { startPreclick, isOpen, tickIdx };
};
