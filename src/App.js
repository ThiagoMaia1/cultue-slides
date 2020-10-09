import React from 'react';
import './App.css';
import Arrastar from './Components/Arrastar/Arrastar';
import Preview from './Components/Preview/Preview';
import Galeria from './Components/Preview/Galeria/Galeria'
import { store } from './index';
import { Provider } from 'react-redux';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <div id='organizador'>
          <Arrastar />
          <Preview />
        </div>
        <Galeria id='galeria'/>
      </div>
    </Provider>
  );
}

export default App;
