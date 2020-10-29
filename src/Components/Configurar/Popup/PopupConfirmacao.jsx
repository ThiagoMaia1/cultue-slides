import React from 'react';
import Popup from './Popup';
import './style.css';

class PopupConfirmacao extends React.Component {
  
  render() {
    return (
        <Popup tamanho='pequeno' ocultarPopup={() => this.props.callback(false)}>   
          <div className='popup-confirmacao'>
            <div className='conteudo-popup'>
                <h4 className='titulo-popup'>Atenção</h4>
                <div className='pergunta-popup-pequeno'>{this.props.pergunta}</div>
            </div>
            <div className='container-botoes-popup'>
                <button className='botao' onClick={() => this.props.callback(true)}>Sim</button>
                <button className='botao limpar-input' onClick={() => this.props.callback(false)}>✕ Não</button>
            </div>
          </div>
        </Popup>
    );
  }
};
  
export default PopupConfirmacao;
  