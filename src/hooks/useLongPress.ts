import React from "react";
import { useState, useEffect } from "react";

export function useLongPress(
  callback: (e: React.MouseEvent<HTMLButtonElement>) => void = () => {},
  ms = 300
) {
  const [startLongPress, setStartLongPress] = useState(false);
  const [event, setEvent] = useState<any | null>(null);

  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (startLongPress) {
      timerId = setTimeout(() => callback(event), ms);
    } else {
      clearTimeout(timerId!);
    }

    return () => {
      clearTimeout(timerId);
    };
  }, [callback, ms, startLongPress, event]);

  return {
    onMouseDown: (e: React.MouseEvent<HTMLButtonElement>) => {
      e.persist();
      e.preventDefault();
      setEvent(e);
      setStartLongPress(true);
    },
    onMouseUp: (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setStartLongPress(false);
    },
    onMouseLeave: () => {
      setEvent(null);
      setStartLongPress(false);
    },
    onTouchStart: (e: React.TouchEvent<HTMLButtonElement>) => {
      e.persist();
      e.preventDefault();
      setEvent(e);
      setStartLongPress(true);
    },
    onTouchEnd: (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setEvent(null);
      setStartLongPress(false);
    },
  };
}
