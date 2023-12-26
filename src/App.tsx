import React, { useEffect, useState } from "react";
import "./i18n.ts";
import { Dudar } from "./components/screens/Dudar.js";
import { ContextProvider } from "./context";
import { detectOS } from "./utils/detectOS";
import { useWakeLock } from "./hooks/useWakeLock";
import { AppRouter } from "./router";

function App() {
  const [OS, setOS] = useState<string>("");
  useWakeLock();

  useEffect(() => {
    const OS = detectOS();
    setOS(OS);
  }, []);

  return (
    <ContextProvider>
      <AppRouter />
    </ContextProvider>
  );
}

export default App;
