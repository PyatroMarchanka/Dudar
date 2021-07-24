import { useState } from "react";

export const useNotesMoving = () => {
  const [tick, setTick] = useState(0);
  return { tick, setTick };
};
