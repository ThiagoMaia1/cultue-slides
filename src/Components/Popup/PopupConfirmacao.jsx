import React from 'react';
import Popup from './Popup';
import { connect } from 'react-redux';
import './style.css';
import { store } from '../../index';

const botoes = {botaoSim: {texto: 'Sim', parametroCallback: true}, 
                botaoNao: {texto: '✕ Não', parametroCallback: false, classe: 'limpar-input'}, 
                botaoCancelar: {texto: 'Cancelar', parametroCallback: false, classe: 'neutro'},
                botaoOK: {texto: 'OK', parametroCallback: true}
}
                
const gruposDeBotoes = {simNao: ['botaoSim', 'botaoNao'],
                        simNaoCancelar: ['botaoSim', 'botaoNao', 'botaoCancelar'],
                        OKCancelar: ['botaoOK', 'botaoCancelar'],
                        OK: ['botaoOK']
}

export const ativarPopupConfirmacao = (botoes, titulo, texto, callback) => {
  store.dispatch({type: 'ativar-popup-confirmacao', 
    popupConfirmacao: {
        botoes: botoes, 
        titulo: titulo, 
        texto: texto,
        callback: callback
    }
  })
}

class PopupConfirmacao extends React.Component {

  chamarCallback = parametro => {
    if (this.props.callback) this.props.callback(parametro);
    this.props.fechar();
  }

  render() {
    if (!this.props.popup) return null;
    
    var grupoBotoes = gruposDeBotoes[this.props.botoes];
    var botoesJSX = grupoBotoes.map(g => {
      var b = botoes[g];
      return (
        <button className={'botao ' + (b.classe || '')} onClick={() => this.chamarCallback(b.parametroCallback)}>
          {b.texto}
        </button>
      )
    });
    
    return (
        <Popup tamanho='pequeno' ocultarPopup={this.props.fechar}>   
          <div className='popup-confirmacao'>
            <div className='conteudo-popup'>
                <h4 className='titulo-popup'>{this.props.titulo}</h4>
                <div className='texto-popup-pequeno'>{this.props.texto}</div>
            </div>
            {this.props.filhos}
            <div className='container-botoes-popup' 
                 style={botoesJSX.length === 1 ? {justifyContent: 'center'} : null }>
                   {botoesJSX}
            </div>
          </div>
        </Popup>
    );
  }
};

const mapState = (state) => {
  return {...state.popupConfirmacao, popup: !!state.popupConfirmacao};
}

const mapDispatch = dispatch => {
  return {
    fechar: () => dispatch({type: 'ativar-popup-confirmacao', popupConfirmacao: null})
  }
}
  
export default connect(mapState, mapDispatch)(PopupConfirmacao);