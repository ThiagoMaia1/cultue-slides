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
import BarraPesquisa from './Components/BarraPesquisa/BarraPesquisa';
import MensagemBaixar from './Components/TelaMensagem/MensagemBaixar';

class App extends Component {

  render() {
    console.log(this.props.apresentacao);
    return (
      <div id='App'>
        <BarraPesquisa/>
        <Tutorial/>
        <PopupAdicionar/>
        <NavBar history={this.props.history}/>
        {this.props.apresentacao.autorizacao === 'baixar' 
          ? <MensagemBaixar formatoExportacao={this.props.apresentacao.formatoExportacao}/>
          : <>
              <div id='organizador'>
                <Arrastar/>
                <Preview/>
              </div>
              <div id='botoes-flutuantes-app'>
                <Configurar/>
                <Galeria id='galeria'/>
                <MenuExportacao/>
              </div>
            </>
        }
      </div>
    );
  }
}

const mapState = state => (
  {apresentacao: state.present.apresentacao, usuario: state.usuario, searchAtivo: state.searchAtivo}
)

export default connect(mapState)(App);
