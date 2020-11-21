import React, { Component } from 'react';
import { connect } from 'react-redux';
import { tiposElemento } from '../../Element';
import Popup from '../Popup/Popup';

class PopupAdicionar extends Component {

  ocultarPopupAdicionar = () => {
    this.props.dispatch({
      type: 'ativar-popup-adicionar', 
      popupAdicionar: {}
    });
  }

  render() {
    var popup = this.props.popupAdicionar;
    if (!popup.tipo || this.props.autorizacao !== 'editar') return null;
    
    var ComponenteConteudoPopup = tiposElemento[popup.tipo];
    return (
      <Popup ocultarPopup={this.ocultarPopupAdicionar}>
          <ComponenteConteudoPopup input1={popup.input1} input2={popup.input2} elementoASubstituir={popup.elementoASubstituir}/>
      </Popup>
    )
  }
};

const mapState = state => {
  var sP = state.present;
  return {popupAdicionar: sP.popupAdicionar, autorizacao: sP.apresentacao.autorizacao};
}

export default connect(mapState)(PopupAdicionar);