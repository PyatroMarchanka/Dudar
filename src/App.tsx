import React, { useEffect } from "react";
import { Dudar } from "./components/Controls";
import { ContextProvider } from "./context";
const navigatorObj: any = navigator;

function App() {
  return (
    <ContextProvider>
      <Dudar />
    </ContextProvider>
  );
}

export default App;
