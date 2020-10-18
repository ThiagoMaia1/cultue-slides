//Para me inspirar: https://freefrontend.com/css-range-sliders/

import React, { Component } from 'react';
import './style.css';
import './stylerange.css';
import { connect } from 'react-redux';
import { CgErase } from 'react-icons/cg';
import { BsTextLeft, BsTextCenter, BsTextRight, BsJustify} from 'react-icons/bs';
import { CompactPicker } from 'react-color';

const negrito = {nomeAtributo: 'fontWeight', valorNormal: '500', valorAlterado: '650'};
const italico = {nomeAtributo: 'fontStyle', valorNormal: 'normal', valorAlterado: 'italic'};
const sublinhado = {nomeAtributo: 'textDecorationLine', valorNormal: 'none', valorAlterado: 'underline'};

class ConfigurarSlides extends Component {
  constructor(props) {
    super(props);
    this.state = {...props, aba: 'texto',
      painelCor: null};
    this.listaFontes = [
      'Helvetica', 'Arial', 'Times New Roman', 'Courier', 'Courier New', 'Verdana', 'Tahoma', 'Arial Black', 'Georgia', 'Impact'].sort().map(f => 
        <option className='opcoes-fonte' value={f} style={{fontFamily: f}}>{f}</option>                  
    )
  }

  gerarBotoesAbas = () => {
    return [{nomeCodigo: 'titulo', nomeInterface: 'Título'},
            {nomeCodigo:'paragrafo', nomeInterface: 'Parágrafo'} , {nomeCodigo: 'tampao', nomeInterface: 'Fundo'}].map(a => 
      <button className={'botao-aba'} data-id={a.nomeCodigo} onClick={this.selecionarAba.bind(this)} 
        style={this.state.aba === a.nomeCodigo ? {backgroundColor: '#ddd'} : null}>{a.nomeInterface}</button>
    );
  }

  selecionarAba = e => {
    var aba = e.target.dataset.id;
    if (aba === this.state.aba) aba = 'texto';
    this.setState({aba: aba});
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

  mudarFonte = (e) => {
    this.atualizarEstilo(this.state.aba, 'fontFamily', e.target.value, true)
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
            {this.gerarBotoesAbas()}
          </div>
          <div className='configuracoes-texto'>
            <div>
                <button id={'cor-texto'} className={'botao-configuracao-bool'} onMouseOver={this.ativarPainelCor}>A
                <div style={{backgroundColor: (this.props.slideSelecionado.estilo.texto.color || '#000'), width: '18px', height: '4px'}}></div>
              </button>
              {this.state.painelCor}
              <select className={'botoes-configuracao combo-fonte'} onChange={this.mudarFonte} 
                      defaultValue={this.props.slideSelecionado.estilo[this.state.aba].fontFamily || 'Helvetica'}>
                        {this.listaFontes}
              </select>
              <button className={'botao-configuracao-bool'} onClick={() => this.toggleEstiloTexto(negrito)}><b>N</b></button>
              <button className={'botao-configuracao-bool'} onClick={() => this.toggleEstiloTexto(italico)}><i>I</i></button>
              <button className={'botao-configuracao-bool'} onClick={() => this.toggleEstiloTexto(sublinhado)}><ins>S</ins></button>
              <div className={'botoes-configuracao'}>
                <button className={'botao-alinhamento'} onClick={() => this.atualizarAlinhamentoTexto('left')}><BsTextLeft size={20}/></button>
                <button className={'botao-alinhamento'} onClick={() => this.atualizarAlinhamentoTexto('center')}><BsTextCenter size={20}/></button>
                <button className={'botao-alinhamento'} onClick={() => this.atualizarAlinhamentoTexto('right')}><BsTextRight size={20}/></button>
                <button className={'botao-alinhamento'} onClick={() => this.atualizarAlinhamentoTexto('justify')}><BsJustify size={20}/></button>
              </div>
            </div>
            <input type="range" min="0.5" max="5" defaultValue={this.props.slideSelecionado.estilo.paragrafo.fontSize} className="slider" ></input>
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