import React, { useEffect, useState } from "react";
import "./i18n.ts";
import { Dudar } from "./components/Controls/Dudar";
import { ContextProvider } from "./context";
import { detectOS } from "./utils/detectOS";
import { useWakeLock } from "./hooks/useWakeLock";

function App() {
  const [OS, setOS] = useState<string>("");
  useWakeLock();

  useEffect(() => {
    const OS = detectOS();
    setOS(OS);
  }, []);

  return (
    <ContextProvider>
      <Dudar />
    </ContextProvider>
  );
}

export default App;
