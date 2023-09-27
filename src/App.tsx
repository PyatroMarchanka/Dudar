import React, { useEffect, useState } from "react";
import "./i18n.ts";
import { Dudar } from "./components/Controls/Dudar";
import NoMidi from "./components/NoMidi";
import { ContextProvider } from "./context";
import { detectOS } from "./utils/detectOS";

function App() {
  const [OS, setOS] = useState<string>("");

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
