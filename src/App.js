import React from 'react';
import './App.css';
//import ComboLetra from './Components/LetrasMusica/ComboLetra';
import Arrastar from './Components/Arrastar/Arrastar';
import Preview from './Components/Preview/Preview';
import Galeria from './Components/Galeria/Galeria'

function App() {
  return (
    <div className="App">
      <div id='organizador'>
        <Arrastar />
        <Preview />
      </div>
      <Galeria id='galeria'/>
    </div>
  );
}

export default App;
