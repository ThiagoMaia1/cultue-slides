import React, { Component } from 'react';
import './style.css';
import { connect } from 'react-redux';
import { CgErase } from 'react-icons/cg';
import { RiMastercardLine } from 'react-icons/ri'
import { BsTextLeft, BsTextCenter, BsTextRight, BsJustify} from 'react-icons/bs';
import { CompactPicker } from 'react-color';
import { fonteBase } from '../Preview/Preview';
import Slider from './Slider';

const casesTexto = [{valor: 'Nenhum', icone: (<span style={{color: '#999'}}>Aa</span>)}, {valor: 'Primeira Maiúscula', icone: 'Aa'}, 
                    {valor: 'Maiúsculas', icone: 'AA'}, {valor: 'Minúsculas', icone: 'aa'}
];

const listaEstilosTexto = [{apelido:'Negrito', nomeAtributo: 'fontWeight', valorNormal: '500', valorAlterado: '650'}, 
                           {apelido:'Itálico', nomeAtributo: 'fontStyle', valorNormal: 'normal', valorAlterado: 'italic'},
                           {apelido:'Sublinhado', nomeAtributo: 'textDecorationLine', valorNormal: 'none', valorAlterado: 'underline'}
];
                           
const listaFontes = ['Montserrat', 'Roboto', 'Source Sans Pro', 'Noto Sans', 'Helvetica', 'Arial', 'Times New Roman', 'Courier', 'Courier New', 'Verdana', 
                     'Tahoma', 'Arial Black', 'Georgia', 'Impact']

const listaBotoesAbas = [{nomeCodigo: 'texto', nomeInterface: 'Texto'},
                         {nomeCodigo: 'titulo', nomeInterface: 'Título', maxFonte: '7'}, 
                         {nomeCodigo: 'paragrafo', nomeInterface: 'Parágrafo', maxFonte: '4'}, 
                         {nomeCodigo: 'imagem', nomeInterface: 'Imagem'},
                         {nomeCodigo: 'imagem', nomeInterface: 'Vídeo'},
                         {nomeCodigo: 'tampao', nomeInterface: 'Fundo'}
];

const listaBotoesAlinhamento = [{direcao: 'left', titulo: 'Alinhado à Esquerda', icone: BsTextLeft}, 
                                {direcao: 'center', titulo: 'Alinhado ao Centro', icone: BsTextCenter}, 
                                {direcao: 'right', titulo: 'Alinhado à Direita', icone: BsTextRight}, 
                                {direcao: 'justify', titulo: 'Justificado', icone: BsJustify}
];

const listaSliders = [{rotulo: 'Fonte', aba: 'paragrafo', atributo: 'fontSize', min: 1, max: 3.5, step: 0.01,  redividir: true},
                      {rotulo: 'Margem', aba: 'paragrafo', atributo: 'padding', min: 0, max: 0.4, step: 0.01,  redividir: true},
                      {rotulo: 'Espaçamento', aba: 'paragrafo', atributo: 'lineHeight', min: 0.5, max: 3, step: 0.1},
                      {rotulo: 'Fonte', aba: 'titulo', atributo: 'fontSize', min: 1, max: 7, step: 0.01,  redividir: true},
                      {rotulo: 'Margem', aba: 'titulo', atributo: 'padding', min: 0, max: 0.4, step: 0.01,  redividir: true},
                      {rotulo: 'Altura', aba: 'titulo', atributo: 'height', min: 0.1, max: 1, step: 0.01,  redividir: true},
                      {rotulo: 'Opacidade', aba: 'tampao', atributo: 'opacity', min: 0, max: 1, step: 0.05},
                      {rotulo: 'Margem', aba: 'imagem', atributo: 'padding', min: 0, max: 0.25, step: 0.01},
                      {rotulo: 'Altura', aba: 'imagem', atributo: 'height', min: 0, max: 1, step: 0.01},
                      {rotulo: 'Largura', aba: 'imagem', atributo: 'width', min: 0, max: 1, step: 0.01}
]

const blocoShadow = {boxShadow: '1px 3px 7px rgba(0, 0, 0, 0.5)'}

class ConfigurarSlides extends Component {
  constructor(props) {
    super(props);
    this.state = {...props, painelCor: null, caseTexto: 0, tamIcones: window.innerHeight*0.022 + 'px'};
    this.listaFontes = listaFontes.sort().map(f => 
        <option className='opcoes-fonte' value={f} style={{fontFamily: f}}>{f}</option>                  
    )
  }

  gerarBotoesAbas = () => {
    return listaBotoesAbas.slice(1).map((a, i) => {
      var t = this.props.slidePreview.tipo;
      if (t === 'Imagem' || t === 'Vídeo') {
        if (a.nomeCodigo === 'paragrafo') return null;
        if (a.nomeCodigo === 'imagem' && t !== a.nomeInterface) return null;
      } else {
        if (a.nomeCodigo === 'imagem') return null;
      }
      var tampar;
      if (this.props.abaRealce === a.nomeCodigo) tampar = (<div className='tampar-shadow'></div>);
      return (<>
          <button className='botao-aba' data-id={i+1} 
            onClick={this.selecionarAba.bind(this)}
            style={this.props.abaRealce === a ? blocoShadow : null}>
              {a.nomeInterface}
            {tampar}
          </button>
      </>)});
  }

  gerarBotoesEstiloTexto = aba => {
       
    return listaEstilosTexto.map(e => {
      var objEstilo = {};
      objEstilo[e.nomeAtributo] = e.valorAlterado;
      return (
        <button title={e.apelido} 
        className={'botao-configuracao bool ' + (this.props.slideSelecionado.estilo[aba][e.nomeAtributo] === e.valorAlterado ? ' clicado' : '')} 
        onClick={() => this.toggleEstiloTexto(e)} 
        style={objEstilo}>{e.apelido[0]}</button>
      )
    });
  }

  gerarBotoesAlinhamento = aba => {
    return listaBotoesAlinhamento.map((b, i) => {
      var Icone = b.icone;
      var bordas;
      if (i === 0) {bordas = {borderRadius: '0.7vh 0 0 0.7vh'}; 
      } else if (i === 3) {bordas = {borderRadius: '0 0.7vh 0.7vh 0'};}
      return (
        <button title={b.titulo} 
                style={bordas}
                className={'botao-alinhamento ' + (this.props.slideSelecionado.estilo[aba].textAlign === b.direcao ? ' clicado' : '')} 
                onClick={() => {
                  var direcao = b.direcao;
                  if (this.props.slideSelecionado.estilo[aba].textAlign === direcao) direcao = '';
                  this.atualizarEstilo(this.props.abaRealce, 'textAlign', direcao)
                }}>
                <Icone size={this.state.tamIcones}/>
        </button>
    )});
  }

  gerarSliders = () => {
    return (
      listaSliders.map(s => (
        <Slider rotulo={s.rotulo} min={s.min} max={s.max} step={s.step} unidade='%'
                defaultValue={this.props.slideSelecionado.estilo[this.props.abaRealce][s.atributo]}
                callbackFunction={valor => this.atualizarEstilo(this.props.abaRealce, s.atributo, valor +'', s.redividir)} 
                style={{display: (this.props.abaRealce === s.aba ? '' : 'none')}}/>
    )));
  }

  selecionarAba = e => {
    var aba = listaBotoesAbas[e.target.dataset.id].nomeCodigo;
    if (aba === this.props.abaRealce) aba = listaBotoesAbas[0].nomeCodigo;
    this.props.dispatch({type: 'ativar-realce', abaRealce: aba});
  }
  
  ativarPainelCor = callback => {
    this.setState({painelCor: (
      <div className='container-painel-cor' onMouseLeave={() => this.setState({painelCor: null})}>
        <div className='painel-cor'>
          <CompactPicker onChange={callback}/>
        </div>
      </div>
    )
    })
  }

  mudarCorFonte = (cor) => {
    this.atualizarEstilo(this.props.abaRealce, 'color', cor.hex);
  }

  mudarCorFundo = (cor) => {
    this.atualizarEstilo('tampao', 'backgroundColor', cor.hex);
  }

  mudarFonte = (e) => {
    this.atualizarEstilo(this.props.abaRealce, 'fontFamily', e.target.value, true)
  }

  mudarCaseTexto = () => {
    var i = this.state.caseTexto + 1;
    if (i >= casesTexto.length) i = 0; 
    this.setState({caseTexto: i})
    this.atualizarEstilo(this.props.abaRealce, 'caseTexto', casesTexto[i].valor, true)
  }

  toggleEstiloTexto = (atributo) => {
    var v = atributo.valorNormal;
    var atributoAplicado = this.props.slideSelecionado.estilo[this.props.abaRealce][atributo.nomeAtributo] || 
                           this.props.slidePreview.estilo[this.props.abaRealce][atributo.nomeAtributo];
    if (atributoAplicado !== atributo.valorAlterado) v = atributo.valorAlterado;
    this.atualizarEstilo(this.props.abaRealce, atributo.nomeAtributo, v, true)
  }

  atualizarEstilo = (nomeObjeto, nomeAtributo, valor, redividir = false) => {
    var sel = this.props.selecionado;
    var estiloObjeto = {};
    estiloObjeto[nomeAtributo] = valor
    this.props.dispatch({type: 'editar-slide', objeto: nomeObjeto, valor: estiloObjeto, redividir: redividir, selecionado: sel})
  }

  limparEstilo = () => {
    var estiloAnterior = this.props.slideSelecionado.estilo;
    var obj = this.props.abaRealce;
    if (obj === 'texto') {
      obj = null;
    } else {
      if (this.eObjetoVazio(estiloAnterior[this.props.abaRealce])) return;
    }
    var redividir = (!this.eObjetoVazio(estiloAnterior.texto) || !this.eObjetoVazio(estiloAnterior.paragrafo) || !this.eObjetoVazio(estiloAnterior.titulo));
    this.props.dispatch({type: 'limpar-estilo', selecionado: this.props.selecionado, objeto: obj, redividir: redividir})
  }

  aplicarEstiloAoMestre = () => {
    var sel = this.props.selecionado;
    var aba = this.props.abaRealce;
    var valor;
    if (aba === 'texto') {
      aba = 'estilo';
      valor = this.props.slidePreview.estilo;
    } else {
      valor = this.props.slidePreview.estilo[aba];
    }
    this.props.dispatch(
      {type: 'editar-slide', 
       objeto: aba, 
       valor: valor,
       selecionado: {elemento: sel.slide !== 0 ? sel.elemento : 0,
                    slide: 0}
      }
    );
  }

  eObjetoVazio(objeto) {
    return JSON.stringify(objeto) === "{}";
  }
  
	render() {
    return (
      <div id='painel-configuracao'>
          <div id='abas'>
            {this.gerarBotoesAbas()}
          </div>
      {this.state.painelCor}
          <div className='configuracoes' style={this.props.abaRealce !== 'texto' ? blocoShadow : null}>
            <div className='container-botoes-direita'>
              <div className='botoes-direita'>
                <button title='Aplicar Estilo ao Slide-Mestre' className={'botao-configuracao bool'} 
                        style={{visibility: this.props.selecionado.elemento === 0 ? 'hidden' : 'visible'}}
                        onClick={this.aplicarEstiloAoMestre}>
                  <RiMastercardLine size={this.state.tamIcones} />
                </button>
                <button title='Limpar Estilos do Slide' className={'botao-configuracao bool'} 
                        onClick={this.limparEstilo}>
                  <CgErase size={this.state.tamIcones} />
                </button>
              </div>
            </div>
            <div className='configuracoes-texto' 
                 style={{display: (this.props.abaRealce === 'tampao' || this.props.abaRealce === 'imagem' ? 'none' : '')}}>
              <div className='linha-configuracoes-texto'>
                <button id={'cor-texto'} className={'botao-configuracao bool'} onMouseOver={() => this.ativarPainelCor(this.mudarCorFonte)}>
                  <span className='a-cor-texto' style={{color: this.props.slideSelecionado.estilo.texto.color}}>A</span>
                  <div className='cor-texto' style={{backgroundColor: this.props.slideSelecionado.estilo.texto.color}}></div>
                </button>
                <button title={casesTexto[this.state.caseTexto].valor} id='botao-case' className={'botao-configuracao bool'} 
                        onClick={this.mudarCaseTexto}>{casesTexto[this.state.caseTexto].icone}</button>
                <select className={'botao-configuracao combo-fonte'} onChange={this.mudarFonte} 
                        defaultValue={this.props.slideSelecionado.estilo[this.props.abaRealce].fontFamily || fonteBase.fontFamily}
                        style={{fontFamily: this.props.slideSelecionado.estilo[this.props.abaRealce].fontFamily || fonteBase.fontFamily}}>
                          {this.listaFontes}
                </select>
              </div>
              <div className='linha-configuracoes-texto'>
                {this.gerarBotoesEstiloTexto(this.props.abaRealce)}
                <div className='botao-configuracao'>{this.gerarBotoesAlinhamento(this.props.abaRealce)}</div>
              </div>
            </div>
            <button className={'botao-configuracao bool'} onMouseOver={() => this.ativarPainelCor(this.mudarCorFundo)}
                    style={{display: (this.props.abaRealce === 'tampao' ? '' : 'none')}}>
                <div className='container-cor-fundo'>
                  <div className='cor-fundo'>
                    <img id='img-quadriculado' alt='' src={require('./Quadriculado PNG.png')} className='quadriculado-imitando-transparente'/>
                  </div>
                  <div className='cor-fundo' style={{backgroundColor: this.props.slideSelecionado.estilo.tampao.backgroundColor, 
                                                    opacity: this.props.slideSelecionado.estilo.tampao.opacity}}>
                  </div>
                </div>
            </button>
            <div className='div-sliders'>
              {this.gerarSliders()}
            </div>
          </div>
      </div>
    )   
	}
}

const mapStateToProps = function (state) {
  state = state.present;
  var sel = state.selecionado;
  return {slideSelecionado: state.elementos[sel.elemento].slides[sel.slide], selecionado: state.selecionado, slidePreview: state.slidePreview, abaRealce: state.abaRealce}
}

export default connect(mapStateToProps)(ConfigurarSlides);