import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';
import Arrastar from '../ListaSlides/ListaSlides';
import Preview from '../Preview/Preview';
import Galeria from '../Preview/Galeria'
import Configurar from '../Configurar/Configurar.jsx';
import MenuExportacao from '../MenuExportacao/MenuExportacao';
import NavBar from '../NavBar/NavBar';
import Tutorial from '../Tutorial/Tutorial';
import PopupAdicionar from '../Popup/PopupAdicionar';
import BarraPesquisa from '../NavBar/BarraPesquisa/BarraPesquisa';
import MensagemBaixar from '../TelaMensagem/MensagemBaixar';
import hotkeys from 'hotkeys-js';

class App extends Component {

  componentDidMount = () => hotkeys.setScope('app');

  render() {
    return (
      <div id='App'>
        <BarraPesquisa/>
        {this.props.apresentacao.autorizacao !== 'editar' ? null : <Tutorial/>}
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
