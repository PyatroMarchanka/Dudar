import React, { useEffect, useRef } from 'react';
import { Bagpipe } from './components/Bagpipe';
import { Controls } from './components/Controls';
import { MidiFileInput } from './components/Controls/MidiFileInput';

function App() {
  return (
    <div>
      <Controls />
    </div>
  );
}

export default App;
