import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ativarPopupConfirmacao } from '../Popup/PopupConfirmacao';
class BotaoExportacao extends Component {
    
  constructor (props) {
    super(props);
    this.ref = React.createRef();
    this.state = {slidePreviewFake: true, previews: []};
  } 

  conferirClick = () => {
    if (this.props.exportavel) {
        this.props.onClick();
    } else {
        ativarPopupConfirmacao(
          'OK', 
          'Apresentação Vazia', 
          'Insira pelo menos um slide antes de exportar.'
        );
    }
  }

  render() {
      return (
        <div className='div-botao-exportar' onClick={this.conferirClick}> 
          {this.props.arrow ? <div className='arrow-down'></div> : null}
          <button id={'exportar-' + this.props.formato} className='botao-exportar sombrear-selecao'>{this.props.logo}</button>
          <div className='rotulo-botao-exportar'>{this.props.rotulo}</div>
        </div>
      )
  }

}

const mapState = function (state) {
  return {exportavel: state.present.elementos.length > 1};
}

export default connect(mapState)(BotaoExportacao);

