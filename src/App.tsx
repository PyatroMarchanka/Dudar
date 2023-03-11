import React, { useEffect, useState } from "react";
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
      {OS !== "iOS" ? <Dudar /> : <NoMidi os={OS} />}
    </ContextProvider>
  );
}

export default App;
