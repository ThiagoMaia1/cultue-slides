import React from 'react';
import Popup from './Popup';
import { connect } from 'react-redux';
import './style.css';
import store from '../../index';

const botoesProntos = {
  botaoSim: {texto: 'Sim', parametroCallback: true}, 
  botaoNao: {texto: '✕ Não', parametroCallback: false, classe: 'limpar-input'}, 
  botaoCancelar: {texto: 'Cancelar', parametroCallback: 0, classe: 'neutro'},
  botaoOK: {texto: 'OK', parametroCallback: true},
  botaoEnviar: {texto: 'Enviar', parametroCallback: true}
}
                
const gruposDeBotoes = {
  simNao: ['botaoSim', 'botaoNao'],
  simNaoCancelar: ['botaoSim', 'botaoNao', 'botaoCancelar'],
  OKCancelar: ['botaoOK', 'botaoCancelar'],
  OK: ['botaoOK'],
  enviarCancelar: ['botaoEnviar', 'botaoCancelar'],
  nenhum: []
}

export const ativarPopupLoginNecessario = strFinalidade => {
  ativarPopupConfirmacao(
    'OK',
    'Login Necessário',
    `Para ${strFinalidade} você deve primeiro cadastrar-se ou fazer login.`
  )
}

export const getPopupConfirmacao = (botoes, titulo, texto, callback, filhos) => ({
  popupConfirmacao: {
    botoes, 
    titulo, 
    texto,
    callback,
    filhos
  }
})

export const ativarPopupConfirmacao = (botoes, titulo, texto, callback, filhos) => {
  store.dispatch({type: 'ativar-popup-confirmacao', 
    ...getPopupConfirmacao(botoes, titulo, texto, callback, filhos)
  })
}


class PopupConfirmacao extends React.Component {

  chamarCallback = parametro => {
    if (this.props.callback) this.props.callback(parametro);
    this.props.fechar();
  }

  render() {
    let { botoes, titulo, texto, fechar, filhos, popup } = this.props;
    if (!popup) return null;
    
    let arrayBotoes;
    if (typeof botoes === 'string') arrayBotoes = gruposDeBotoes[botoes];
    else arrayBotoes = botoes;
    
    let botoesJSX = arrayBotoes.map((b, i) => {
      if (typeof b === 'string') b = botoesProntos[b];
      return (
        <button className={'botao ' + (b.classe || '')} onClick={() => this.chamarCallback(b.parametroCallback)} key={i}>
          {b.texto}
        </button>
      )
    });
    
    return (
        <Popup tamanho='pequeno' ocultarPopup={fechar}>   
          <div className='popup-confirmacao'>
            <div className='conteudo-popup'>
                {titulo ? <h4 className='titulo-popup'>{titulo}</h4> : null}
                {texto ? <div className='texto-popup-pequeno'>{texto}</div> : null}
            </div>
            {filhos}
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