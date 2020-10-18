//Para me inspirar: https://freefrontend.com/css-range-sliders/

import React, { Component } from 'react';
import './style.css';
import { connect } from 'react-redux';
// import { textoMestre } from '../Preview/Preview';
// import Adicionar from './Adicionar';
import { CgErase } from 'react-icons/cg';
import { BsTextLeft, BsTextCenter, BsTextRight, BsJustify} from 'react-icons/bs';
import { CompactPicker } from 'react-color';

const negrito = {nomeAtributo: 'fontWeight', valorNormal: '500', valorAlterado: '650'};
const italico = {nomeAtributo: 'fontStyle', valorNormal: 'normal', valorAlterado: 'italic'};
const sublinhado = {nomeAtributo: 'textDecorationLine', valorNormal: 'none', valorAlterado: 'underline'};

class ConfigurarSlides extends Component {
  constructor(props) {
    super(props);
    this.botoesAbas = [{nomeCodigo: 'texto', nomeInterface: 'Texto'}, {nomeCodigo: 'titulo', nomeInterface: 'Título'},
                       {nomeCodigo:'paragrafo', nomeInterface: 'Parágrafo'} , {nomeCodigo: 'tampao', nomeInterface: 'Fundo'}].map(a => 
      <button className={'botao-aba'} data-id={a.nomeCodigo} onClick={this.selecionarAba.bind(this)}>{a.nomeInterface}</button>
    );
    this.state = {...props, aba: 'texto',
      painelCor: null};
  }

  selecionarAba = e => {
    console.log(e.target.dataset.id)
    this.setState({aba: e.target.dataset.id});
  }

  ativarPainelCor = () => {
    this.setState({painelCor: (
      <div className='div-painel-cor' onMouseLeave={() => this.setState({painelCor: null})}>
        <div className='painel-cor' onMouseLeave={() => this.setState({painelCor: null})}>
          <CompactPicker onChange={this.mudarCor}/>
        </div>
      </div>
    )
    })
  }

  mudarCor = (cor) => {
    this.atualizarEstilo(this.state.aba, 'color', cor.hex);
  }

  toggleEstiloTexto = (atributo) => {
    var v = atributo.valorNormal;
    var atributoAplicado = this.props.slideSelecionado.estilo[this.state.aba][atributo.nomeAtributo] || 
                           this.props.slidePreview.estilo[this.state.aba][atributo.nomeAtributo];
    if (atributoAplicado !== atributo.valorAlterado) v = atributo.valorAlterado;
    this.atualizarEstilo(this.state.aba, atributo.nomeAtributo, v, true)
  }

  atualizarEstilo = (nomeObjeto, nomeAtributo, valor, recalcular = false) => {
    var sel = this.props.selecionado;
    var estiloObjeto = {};
    estiloObjeto[nomeAtributo] = valor
    this.props.dispatch({type: 'atualizar-estilo', objeto: nomeObjeto, valor: estiloObjeto})
    if (recalcular) this.props.dispatch({type: 'redividir-slides', selecionado: sel})
  }

  atualizarAlinhamentoTexto = alinhamento => {
    this.atualizarEstilo('paragrafo', 'textAlign', alinhamento);
  }

  limparEstilo = () => {
    var estiloAnterior = this.props.slideSelecionado.estilo;
    if (!this.eObjetoVazio(estiloAnterior.texto) || !this.eObjetoVazio(estiloAnterior.paragrafo) || !this.eObjetoVazio(estiloAnterior.titulo))
      this.props.dispatch({type: 'redividir-slides', selecionado: this.props.selecionado})
  }

  eObjetoVazio(objeto) {
    return JSON.stringify(objeto) === "{}";
  }

  // + (this.props.slideSelecionado.estilo[this.state.aba].fontWeight === '650' ? ' clicado' : ''
	render() {
		return (
      <div className="configuracoes" >
          <div id={'abas'}>
            {this.botoesAbas}
          </div>
          <div className='configuracoes-texto'>
            <button id={'cor-texto'} className={'botao-configuracao-bool'} onMouseOver={this.ativarPainelCor}>A
              <div style={{backgroundColor: (this.props.slideSelecionado.estilo.texto.color || '#000'), width: '18px', height: '4px'}}></div>
            </button>
            {this.state.painelCor}
            <button className={'botao-configuracao-bool'} onClick={() => this.toggleEstiloTexto(negrito)}><b>N</b></button>
            <button className={'botao-configuracao-bool'} onClick={() => this.toggleEstiloTexto(italico)}><i>I</i></button>
            <button className={'botao-configuracao-bool'} onClick={() => this.toggleEstiloTexto(sublinhado)}><ins>S</ins></button>
            <div id={'botoes-alinhamento'}>
              <button className={'botao-alinhamento'} onClick={() => this.atualizarAlinhamentoTexto('left')}><BsTextLeft size={20}/></button>
              <button className={'botao-alinhamento'} onClick={() => this.atualizarAlinhamentoTexto('center')}><BsTextCenter size={20}/></button>
              <button className={'botao-alinhamento'} onClick={() => this.atualizarAlinhamentoTexto('right')}><BsTextRight size={20}/></button>
              <button className={'botao-alinhamento'} onClick={() => this.atualizarAlinhamentoTexto('justify')}><BsJustify size={20}/></button>
            </div>
            <button className={'botao-configuracao-bool'} onClick={this.limparEstilo}><CgErase size={20} /></button>
            <input id="range-fonte" type="range" min="0.5" max="5" defaultValue={this.props.slideSelecionado.estilo.paragrafo.fontSize} className="slider" ></input>
          </div>
      </div>
    )   
	}
}

const mapStateToProps = function (state) {
  var sel = state.selecionado;
  return {slideSelecionado: state.elementos[sel.elemento].slides[sel.slide], selecionado: state.selecionado, slidePreview: state.slidePreview}
}

export default connect(mapStateToProps)(ConfigurarSlides);