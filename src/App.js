import React, { Component } from 'react';
import './App.css';
import Arrastar from './Components/Arrastar/Arrastar';
import Preview from './Components/Preview/Preview';
import Galeria from './Components/Preview/Galeria/Galeria'
import Configurar from './Components/Configurar/Configurar.jsx';
import MenuExportacao from './Components/MenuExportacao/MenuExportacao';

class App extends Component {

  constructor (props) {
    super(props);
    this.state = {loginAtivo: true}
  }

  toggleLogin = () => {
    this.setState({loginAtivo: !this.state.loginAtivo})
  }

  render() {
    return (
      <div className="App">
        <div id='organizador'>
          <Arrastar />
          <Preview />
          <Configurar />
        </div>
        <Galeria id='galeria'/>
        <MenuExportacao />
      </div>
    );
  }
}

export default App;
