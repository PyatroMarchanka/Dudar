import React, { useEffect, useState } from "react";
import "./i18n.ts";
import { ContextProvider } from "./context";
import { detectOS } from "./utils/detectOS";
import { useWakeLock } from "./hooks/useWakeLock";
import { AppRouter } from "./router";
import { loadGapiInsideDOM } from "gapi-script";
import { MetaTags } from "./components/SEO/MetaTags";
import { StructuredData } from "./components/SEO/StructuredData";

function App() {
  const [OS, setOS] = useState<string>("");
  useWakeLock();

  useEffect(() => {
    const OS = detectOS();
    setOS(OS);
    loadGapiInsideDOM();
  }, []);

  return (
    <ContextProvider>
      <MetaTags />
      <StructuredData />
      <AppRouter />
    </ContextProvider>
  );
}

export default App;
