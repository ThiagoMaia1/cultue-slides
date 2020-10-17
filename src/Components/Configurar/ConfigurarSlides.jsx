//Para me inspirar: https://freefrontend.com/css-range-sliders/

import React, { Component } from 'react';
import './style.css';
import { connect } from 'react-redux';
// import { textoMestre } from '../Preview/Preview';
// import Adicionar from './Adicionar';
// import { CompactPicker } from 'react-color';

const abaTexto = 'texto';
// const abaTitulo = 'titulo';
// const abaParagrafo = 'paragrafo';

class Atributo {
  constructor(nomeAtributo, valorNormal, valorAlterado) {
    this.nomeAtributo = nomeAtributo;
    this.valorNormal = valorNormal;
    this.valorAlterado = valorAlterado;
  }
}

const negrito = new Atributo('fontWeight', '500', '650');
const italico = new Atributo('fontStyle', 'normal', 'italic');
const sublinhado = new Atributo('textDecorationLine', 'none', 'underline');

class ConfigurarSlides extends Component {
  constructor(props) {
    super(props);
    this.state = {...props, aba: abaTexto};
  }

  toggleEstiloTexto = (atributo) => {
    var v = atributo.valor1;
    if (this.props.slideSelecionado.estilo.texto[atributo.nomeAtributo] === atributo.valor1) v = atributo.valor2;
    this.atualizarEstilo(this.state.aba, atributo.nomeAtributo, v)
  }

  atualizarEstilo = (nomeObjeto, nomeAtributo, valor) => {
    var sel = this.props.selecionado;
    var estiloObjeto = {};
    estiloObjeto[nomeAtributo] = valor
    this.props.dispatch({type: 'atualizar-estilo', objeto: nomeObjeto, valor: estiloObjeto})
    if (nomeObjeto === 'texto' || nomeObjeto === 'paragrafo' || (nomeObjeto === 'titulo' && nomeAtributo === 'height'))
      this.props.dispatch({type: 'redividir-slides', selecionado: sel})
  }


  // + (this.props.slideSelecionado.estilo[this.state.aba].fontWeight === '650' ? ' clicado' : ''
	render() {
		return (
      <div className="configuracoes" >
          <div className='configuracoes-texto'>
            <button className={'botao-configuracao-bool'} onClick={() => this.toggleEstiloTexto(negrito)}><b>N</b></button>
            <button className={'botao-configuracao-bool'} onClick={() => this.toggleEstiloTexto(italico)}><i>I</i></button>
            <button className={'botao-configuracao-bool'} onClick={() => this.toggleEstiloTexto(sublinhado)}><ins>S</ins></button>
            <input id="range-fonte" type="range" min="0.5" max="5" defaultValue={this.props.slideSelecionado.estilo.paragrafo.fontSize} className="slider" ></input>
          </div>
      </div>
    )   
	}
}

const mapStateToProps = function (state) {
  var sel = state.selecionado;
  return {slideSelecionado: state.elementos[sel.elemento].slides[sel.slide], selecionado: state.selecionado}
}

export default connect(mapStateToProps)(ConfigurarSlides);