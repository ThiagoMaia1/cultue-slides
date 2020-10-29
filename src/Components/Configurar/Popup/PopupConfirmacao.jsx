import React from 'react';
import Popup from './Popup';
import './style.css';

const botoes = {botaoSim: {texto: 'Sim', parametroCallback: 1}, 
                botaoNao: {texto: '✕ Não', parametroCallback: 0, classe: 'limpar-input'}, 
                botaoCancelar: {texto: 'Cancelar', parametroCallback: -1, classe: 'itens'},
                botaoOK: {texto: 'OK', parametroCallback: 1}
}
                
const gruposDeBotoes = {simNao: ['botaoSim', 'botaoNao'],
                        simNaoCancelar: ['botaoSim', 'botaoNao', 'botaoCancelar'],
                        OKCancelar: ['botaoOK', 'botaoCancelar'],
                        OK: ['botaoOK']
}

class PopupConfirmacao extends React.Component {

  render() {
    var grupoBotoes = gruposDeBotoes[this.props.botoes];
    var botoesJSX = grupoBotoes.map(g => {
      var b = botoes[g];
      return (
        <button className={'botao ' + (b.classe || '')} onClick={() => this.props.callback(b.parametroCallback)}>
          {b.texto}
        </button>
      )
    });
    
    return (
        <Popup tamanho='pequeno' ocultarPopup={() => this.props.callback(false)}>   
          <div className='popup-confirmacao'>
            <div className='conteudo-popup'>
                <h4 className='titulo-popup'>Atenção</h4>
                <div className='pergunta-popup-pequeno'>{this.props.pergunta}</div>
            </div>
            <div className='container-botoes-popup'>{botoesJSX}</div>
          </div>
        </Popup>
    );
  }
};
  
export default PopupConfirmacao;
  