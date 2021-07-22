import React, { useEffect } from "react";
import { Controls } from "./components/Controls";
import { ContextProvider } from "./context";
const navigatorObj: any = navigator;

function App() {
  return (
    <ContextProvider>
      <Controls />
    </ContextProvider>
  );
}

export default App;
