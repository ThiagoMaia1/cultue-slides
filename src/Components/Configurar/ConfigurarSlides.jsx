//Para me inspirar: https://freefrontend.com/css-range-sliders/

import React, { Component } from 'react';
import './style.css';
import { connect } from 'react-redux';
// import Adicionar from './Adicionar';
// import { CompactPicker } from 'react-color';

class ConfigurarSlides extends Component {
  constructor(props) {
    super(props);
    this.state = {...props};
  }

  toggleNegrito = () => {
    var weight = 650
    if (this.props.estiloSlide.texto.fontWeight === weight) weight = 500;
    this.props.dispatch({type: 'atualizar-estilo', objeto: 'texto', valor: {fontWeight: weight}})
  }

  toggleItalico = () => {
    var estilo = 'italic'
    if (this.props.estiloSlide.texto.fontStyle === estilo) estilo = 'normal';
    this.props.dispatch({type: 'atualizar-estilo', objeto: 'texto', valor: {fontStyle: estilo}})
  }

  toggleSublinhado = () => {
    var decoration = 'underline'
    if (this.props.estiloSlide.texto.textDecorationLine === decoration) decoration = 'none';
    this.props.dispatch({type: 'atualizar-estilo', objeto: 'texto', valor: {textDecorationLine: decoration}})
  }

	render() {
		return (
      <div className="configuracoes" >
          <div className='configuracoes-texto'>
            <button className={'botao-configuracao-bool' + (this.props.estiloSlide.texto.fontWeight === '650' ? ' clicado' : '')}
              onClick={this.toggleNegrito}><b>N</b></button>
            <button className={'botao-configuracao-bool' + (this.props.estiloSlide.texto.fontStyle === 'italic' ? ' clicado' : '')} 
              onClick={this.toggleItalico}><i>I</i></button>
            <button className={'botao-configuracao-bool' + (this.props.estiloSlide.texto.textDecorationLine === 'underline' ? ' clicado' : '')} 
              onClick={this.toggleSublinhado}><ins>S</ins></button>
            <input id="range-fonte" type="range" min="0.5" max="5" defaultValue={this.props.estiloSlide.paragrafo.fontSize} className="slider" ></input>
          </div>
      </div>
    )   
	}
}

const mapStateToProps = function (state) {
  return {estiloSlide: state.slidePreview.estilo}
}

export default connect(mapStateToProps)(ConfigurarSlides);