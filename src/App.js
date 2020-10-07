import React from 'react';
import './App.css';
//import ComboLetra from './Components/LetrasMusica/ComboLetra';
import Arrastar from './Components/Arrastar/Arrastar';
import Preview from './Components/Preview/Preview';

function App() {
  return (
    <div className="App">
      <Arrastar />
      <Preview />
    </div>
  );
}

export default App;
