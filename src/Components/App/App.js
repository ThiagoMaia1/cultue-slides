import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';
import Arrastar from '../ListaSlides/ListaSlides';
import Preview from '../Preview/Preview';
import MenuGaleria from '../Preview/MenuGaleria'
import Configurar from '../Configurar/Configurar.jsx';
import MenuExportacao from '../MenuExportacao/MenuExportacao';
import NavBar from '../NavBar/NavBar';
import Tutorial from '../Tutorial/Tutorial';
import PopupAdicionar from '../Popup/PopupAdicionar';
import BarraPesquisa from '../NavBar/BarraPesquisa/BarraPesquisa';
import MensagemBaixar from '../TelaMensagem/MensagemBaixar';
import hotkeys from 'hotkeys-js';

class App extends Component {

  componentDidMount = () => hotkeys.setScope('main');

  render() {
    let { autorizacao, formatoExportacao } = this.props.apresentacao;
    let editavel = autorizacao === 'editar';
    return (
      <div id='App'>
        <BarraPesquisa/>
        {editavel ? <Tutorial/> : null}
        <PopupAdicionar/>
        <NavBar history={this.props.history}/>
        {autorizacao === 'baixar' 
          ? <MensagemBaixar formatoExportacao={formatoExportacao}/>
          : <>
              <div id='organizador'>
                <Arrastar/>
                <Preview/>
              </div>
              <div id='botoes-flutuantes-app'>
                {editavel ? <MenuGaleria/> : null}
                <Configurar/>
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
