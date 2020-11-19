import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';
import Arrastar from './Components/Arrastar/Arrastar';
import Preview from './Components/Preview/Preview';
import Galeria from './Components/Preview/Galeria/Galeria'
import Configurar from './Components/Configurar/Configurar.jsx';
import MenuExportacao from './Components/MenuExportacao/MenuExportacao';
import NavBar from './Components/NavBar/NavBar';
import Tutorial from './Components/Tutorial/Tutorial';
import PopupAdicionar from './Components/Popup/PopupAdicionar';

class App extends Component {

  render() {
    return (
      <div id='App'>
        <Tutorial/>
        <PopupAdicionar/>
        <NavBar history={this.props.history}/> 
        <div id='organizador'>
          <Arrastar/>
          <Preview/>
        </div>
        <div id='botoes-flutuantes-app'>
          <Configurar/>
          <Galeria id='galeria'/>
          <MenuExportacao/>
        </div>
      </div>
    );
  }
}

const mapState = state => (
  {apresentacao: state.present.apresentacao, usuario: state.usuario}
)

export default connect(mapState)(App);
