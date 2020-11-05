import React from 'react';
import './App.css';
import Arrastar from './Components/Arrastar/Arrastar';
import Preview from './Components/Preview/Preview';
import Galeria from './Components/Preview/Galeria/Galeria'
import { store } from './index';
import { Provider } from 'react-redux';
import Configurar from './Components/Configurar/Configurar.jsx';
import MenuExportacao from './Components/MenuExportacao/MenuExportacao';
import Login from './Components/Login/Login';

function App() {


  return (
    <Provider store={store}>
      {/* <Login fundo={true}/> */}
      <div className="App">
        <div id='organizador'>
          <Arrastar />
          <Preview />
          <Configurar />
        </div>
        <Galeria id='galeria'/>
        <MenuExportacao />
      </div>
    </Provider>
  );
}

export default App;
