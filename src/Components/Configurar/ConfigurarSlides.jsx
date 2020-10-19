//Para me inspirar: https://freefrontend.com/css-range-sliders/

import React, { Component } from 'react';
import './style.css';
import './stylerange.css';
import { connect } from 'react-redux';
import { CgErase } from 'react-icons/cg';
import { BsTextLeft, BsTextCenter, BsTextRight, BsJustify} from 'react-icons/bs';
import { CompactPicker } from 'react-color';
import { fonteBase } from '../Preview/Preview';

const casesTexto = [{valor: 'Nenhum', icone: (<span style={{color: '#999'}}>Aa</span>)}, {valor: 'Primeira Maiúscula', icone: 'Aa'}, 
                    {valor: 'Maiúsculas', icone: 'AA'}, {valor: 'Minúsculas', icone: 'aa'}
];

const listaEstilosTexto = [{apelido:'Negrito', nomeAtributo: 'fontWeight', valorNormal: '500', valorAlterado: '650'}, 
                           {apelido:'Itálico', nomeAtributo: 'fontStyle', valorNormal: 'normal', valorAlterado: 'italic'},
                           {apelido:'Sublinhado', nomeAtributo: 'textDecorationLine', valorNormal: 'none', valorAlterado: 'underline'}
];
                           
const listaFontes = ['Helvetica', 'Arial', 'Times New Roman', 'Courier', 'Courier New', 'Verdana', 'Tahoma', 'Arial Black', 'Georgia', 'Impact']

const listaBotoesAbas = [{nomeCodigo: 'texto', nomeInterface: 'Texto', cor: '#fff'},
                         {nomeCodigo: 'titulo', nomeInterface: 'Título', cor: '#e6e6ff'}, 
                         {nomeCodigo:'paragrafo', nomeInterface: 'Parágrafo', cor: '#c6ecc6'}, 
                         {nomeCodigo: 'tampao', nomeInterface: 'Fundo', cor: '#ffd6cc'}
];

class ConfigurarSlides extends Component {
  constructor(props) {
    super(props);
    this.state = {...props, aba: listaBotoesAbas[0],
      painelCor: null, caseTexto: 0};
    this.listaFontes = listaFontes.sort().map(f => 
        <option className='opcoes-fonte' value={f} style={{fontFamily: f}}>{f}</option>                  
    )
  }

  gerarBotoesAbas = () => {
    return listaBotoesAbas.slice(1).map((a, i) => 
      <button className={'botao-aba'} data-id={i+1} onClick={this.selecionarAba.bind(this)} 
        style={this.state.aba === a ? {backgroundColor: a.cor} : null}>{a.nomeInterface}</button>
    );
  }

  gerarBotoesEstiloTexto = () => {
       
    return listaEstilosTexto.map(e => {
      var objEstilo = {};
      objEstilo[e.nomeAtributo] = e.valorAlterado;
      return (
        <button title={e.apelido} 
        className={'botao-configuracao-bool ' + (this.props.slideSelecionado.estilo[this.state.aba.nomeCodigo][e.nomeAtributo] === e.valorAtributo ? ' clicado' : '')} 
        onClick={() => this.toggleEstiloTexto(e)} 
        style={objEstilo}>{e.apelido[0]}</button>
      )
    });
  }

  selecionarAba = e => {
    var aba = listaBotoesAbas[e.target.dataset.id];
    if (aba === this.state.aba) aba = listaBotoesAbas[0];
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
    this.atualizarEstilo(this.state.aba.nomeCodigo, 'color', cor.hex);
  }

  mudarFonte = (e) => {
    this.atualizarEstilo(this.state.aba.nomeCodigo, 'fontFamily', e.target.value, true)
  }

  mudarCaseTexto = () => {
    var i = this.state.caseTexto + 1;
    if (i >= casesTexto.length) i = 0; 
    this.setState({caseTexto: i})
    this.atualizarEstilo(this.state.aba.nomeCodigo, 'caseTexto', casesTexto[i].valor, true)
  }

  toggleEstiloTexto = (atributo) => {
    var v = atributo.valorNormal;
    var atributoAplicado = this.props.slideSelecionado.estilo[this.state.aba.nomeCodigo][atributo.nomeAtributo] || 
                           this.props.slidePreview.estilo[this.state.aba.nomeCodigo][atributo.nomeAtributo];
    if (atributoAplicado !== atributo.valorAlterado) v = atributo.valorAlterado;
    this.atualizarEstilo(this.state.aba.nomeCodigo, atributo.nomeAtributo, v, true)
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
    var obj = this.state.aba.nomeCodigo;
    if (obj === 'texto') {
      obj = null;
    } else {
      if (this.eObjetoVazio(estiloAnterior[this.state.aba.nomeCodigo])) return;
    }
    this.props.dispatch({type: 'limpar-estilo', selecionado: this.props.selecionado, objeto: obj})
    if (!this.eObjetoVazio(estiloAnterior.texto) || !this.eObjetoVazio(estiloAnterior.paragrafo) || !this.eObjetoVazio(estiloAnterior.titulo))
      this.props.dispatch({type: 'redividir-slides', selecionado: this.props.selecionado})
  }

  eObjetoVazio(objeto) {
    return JSON.stringify(objeto) === "{}";
  }

	render() {
		return (
      <div>
          <div id='abas'>
            {this.gerarBotoesAbas()}
          </div>
          <div className='configuracoes' style={{backgroundColor: this.state.aba.cor}}>
            <div className='configuracoes-texto' style={{display: (this.state.aba.nomeCodigo === 'tampao' ? 'none' : '')}}>
                <button id={'cor-texto'} className={'botao-configuracao-bool'} onMouseOver={this.ativarPainelCor}>A
                <div style={{backgroundColor: (this.props.slideSelecionado.estilo.texto.color || '#000'), width: '18px', height: '4px'}}></div>
              </button>
              {this.state.painelCor}
              <select className={'botoes-configuracao combo-fonte'} onChange={this.mudarFonte} 
                      defaultValue={this.props.slideSelecionado.estilo[this.state.aba.nomeCodigo].fontFamily || fonteBase.fontFamily}>
                        {this.listaFontes}
              </select>
              {this.gerarBotoesEstiloTexto()}
              <div className={'botoes-configuracao'}>
                <button title='Alinhado à Esquerda' className={'botao-alinhamento'} onClick={() => this.atualizarAlinhamentoTexto('left')}><BsTextLeft size={20}/></button>
                <button title='Alinhado ao Centro' className={'botao-alinhamento'} onClick={() => this.atualizarAlinhamentoTexto('center')}><BsTextCenter size={20}/></button>
                <button title='Alinhado à Direita' className={'botao-alinhamento'} onClick={() => this.atualizarAlinhamentoTexto('right')}><BsTextRight size={20}/></button>
                <button title='Justificado' className={'botao-alinhamento'} onClick={() => this.atualizarAlinhamentoTexto('justify')}><BsJustify size={20}/></button>
              </div>
              <button title={casesTexto[this.state.caseTexto].valor} className={'botao-configuracao-bool'} onClick={this.mudarCaseTexto}>{casesTexto[this.state.caseTexto].icone}</button>
            </div>
            <input type="range" min="0.5" max="5" defaultValue={this.props.slideSelecionado.estilo[this.state.aba.nomeCodigo].height} className="slider" ></input>
            <input id="range-fonte" type="range" min="0.5" max="5" defaultValue={this.props.slideSelecionado.estilo[this.state.aba.nomeCodigo].fontSize} className="slider" ></input>
            <button title='Limpar Estilos do Slide' className={'botao-configuracao-bool'} onClick={this.limparEstilo}
              style={{display: this.props.selecionado.elemento === 0 ? 'none' : ''}}><CgErase size={20} /></button>
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