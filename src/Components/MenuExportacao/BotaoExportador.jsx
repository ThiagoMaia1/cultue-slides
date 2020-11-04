import React, { Component } from 'react';
import { connect } from 'react-redux';
import PopupConfirmacao from '../Configurar/Popup/PopupConfirmacao';
class BotaoExportacao extends Component {
    
  constructor (props) {
    super(props);
    this.ref = React.createRef();
    this.state = {slidePreviewFake: true, previews: [], popupConfirmacao: null};
  } 

  conferirClick = () => {
    if (this.props.exportavel) {
        this.props.onClick();
    } else {
        this.setState({popupConfirmacao: (
            <PopupConfirmacao titulo='Apresentação Vazia' botoes='OK'
                            pergunta={'Insira pelo menos um slide antes de exportar.'} 
                            callback={() => this.setState({popupConfirmacao: null})}/>
        )});
    }
  }

  render() {
      return (
        <>
          {this.state.popupConfirmacao}
          <div className='div-botao-exportar' onClick={this.conferirClick}> 
            {this.props.arrow ? <div className='arrow-down'></div> : null}
            <button id={'exportar-' + this.props.formato} className='botao-exportar sombrear-selecao'>{this.props.logo}</button>
            <div className='rotulo-botao-exportar'>{this.props.rotulo}</div>
          </div>
        </>
      )
  }

}

const mapStateToProps = function (state) {
  return {exportavel: state.present.elementos.length > 1};
}

export default connect(mapStateToProps)(BotaoExportacao);

