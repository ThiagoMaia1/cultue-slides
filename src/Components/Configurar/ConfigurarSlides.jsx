import React, { Component } from 'react';
import './style.css';
import { connect } from 'react-redux';
import { CgErase } from 'react-icons/cg';
import { RiMastercardLine } from 'react-icons/ri'
import { BsTextLeft, BsTextCenter, BsTextRight, BsJustify, BsMusicNoteBeamed} from 'react-icons/bs';
import { VscCollapseAll } from 'react-icons/vsc';
import { CompactPicker } from 'react-color';
import Slider from './Slider';

const casesTexto = [{valor: 'Nenhum', icone: (<span style={{color: '#999'}}>Aa</span>)}, {valor: 'Primeira Maiúscula', icone: 'Aa'}, 
                    {valor: 'Maiúsculas', icone: 'AA'}, {valor: 'Minúsculas', icone: 'aa'}
];

const listaFontes = ['Montserrat', 'Roboto', 'Source Sans Pro', 'Noto Sans', 'Helvetica', 'Arial', 'Times New Roman', 'Courier', 'Courier New', 'Verdana', 
                     'Tahoma', 'Arial Black', 'Georgia', 'Impact'
]

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
                      {rotulo: 'Margem', aba: 'paragrafo', atributo: 'paddingRight', min: 0, max: 0.4, step: 0.01,  redividir: true},
                      {rotulo: 'Espaça-\nmento', aba: 'paragrafo', atributo: 'lineHeight', min: 0.5, max: 3, step: 0.1,  redividir: true},
                      {rotulo: 'Fonte', aba: 'titulo', atributo: 'fontSize', min: 1, max: 7, step: 0.01,  redividir: true},
                      {rotulo: 'Margem', aba: 'titulo', atributo: 'paddingRight', min: 0, max: 0.4, step: 0.01,  redividir: true},
                      {rotulo: 'Altura', aba: 'titulo', atributo: 'height', min: 0.1, max: 1, step: 0.01,  redividir: true},
                      {rotulo: 'Opacidade', aba: 'tampao', atributo: 'opacity', min: 0, max: 1, step: 0.05},
                      {rotulo: 'Margem', aba: 'imagem', atributo: 'padding', min: 0, max: 0.25, step: 0.01},
                      {rotulo: 'Altura', aba: 'imagem', atributo: 'height', min: 0, max: 2, step: 0.01},
                      {rotulo: 'Largura', aba: 'imagem', atributo: 'width', min: 0, max: 2, step: 0.01}
]

class ConfigurarSlides extends Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.state = {painelCor: null, caseTexto: 0, tamIcones: window.innerHeight*0.022 + 'px', 
                  ref: this.ref, selecionado: this.props.selecionado};
    this.listaFontes = listaFontes.sort().map(f => 
        <option className='opcoes-fonte' value={f} style={{fontFamily: f}}>{f}</option>                  
    )
    this.listaEstilosTexto = [{apelido:'Negrito', nomeAtributo: 'fontWeight', valorNormal: '500', valorAlterado: '650'}, 
                              {apelido:'Itálico', nomeAtributo: 'fontStyle', valorNormal: 'normal', valorAlterado: 'italic'},
                              {apelido:'Sublinhado', nomeAtributo: 'textDecorationLine', valorNormal: 'none', valorAlterado: 'underline'},
                              {apelido: 'Duas Colunas', nomeAtributo: 'duasColunas', valorNormal: false, valorAlterado: true, 
                                simbolo: <div className='icone-duas-colunas'><BsJustify size={this.state.tamIcones}/><BsJustify size={this.state.tamIcones}/></div>, objeto: 'paragrafo'}, 
                              {apelido: 'Multiplicadores', nomeAtributo: 'multiplicadores', valorNormal: false, valorAlterado: true, simbolo: 'x2', tipo: 'Música', objeto: 'paragrafo'},
                              {apelido: 'Juntar Estrofes Repetidas', nomeAtributo: 'omitirRepeticoes', valorNormal: false, valorAlterado: true, simbolo: <VscCollapseAll size={1.2*this.state.tamIcones}/>, tipo: 'Música', objeto: 'paragrafo'}
    ];
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
      if (this.props.abaAtiva === a.nomeCodigo) tampar = (<div className='tampar-shadow'></div>);
      return (<>
          <button className='botao-aba' data-id={i+1} key={i+1}
            onClick={this.selecionarAba.bind(this)}>
              {a.nomeInterface}
              {tampar}
          </button>
      </>)});
  }

  gerarBotoesEstiloTexto = (aba, iIni = 0, iFin = 99) => {
    var lista = this.listaEstilosTexto.filter((e, i) => i >= iIni && i <= iFin);
    return lista.map(e => {
      if (e.tipo && e.tipo !== this.props.slidePreview.tipo) return null;
      var objEstilo = {};
      objEstilo[e.nomeAtributo] = e.valorAlterado;
      return (
        <button title={e.apelido} 
        className={'botao-configuracao bool ' + (this.props.slideSelecionado.estilo[aba][e.nomeAtributo] === e.valorAlterado ? ' clicado' : '')} 
        onClick={() => this.toggleEstiloTexto(e)} 
        style={objEstilo}>{e.simbolo ? e.simbolo : e.apelido[0]}</button>
      )
    })
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
                  this.atualizarEstilo(this.props.abaAtiva, 'textAlign', direcao)
                }}>
                <Icone size={this.state.tamIcones}/>
        </button>
    )});
  }

  reducerListaSliders = (resultado, s) => {
    if (s.aba !== this.props.abaAtiva) return resultado; 
    var valorAplicado = this.props.slidePreview.estilo[s.aba][s.atributo];
    if (/%/.test(valorAplicado))
      valorAplicado = Number(valorAplicado.replace('%',''))/100;
    resultado.push(
      <Slider key={s.atributo + '-' + s.aba} atributo={s.atributo} objeto={s.aba} rotulo={s.rotulo} min={s.min} max={s.max} step={s.step} unidade='%'
              valorAplicado={Number(valorAplicado)}
              callback={(valor, temp = false) => this.atualizarEstilo(s.aba, s.atributo, valor + '', s.redividir, temp)}
              style={{display: (this.props.abaAtiva === s.aba ? '' : 'none')}}/>
    );
    return resultado;
  }

  selecionarAba = e => {
    var aba = listaBotoesAbas[e.target.dataset.id].nomeCodigo;
    if (aba === this.props.abaAtiva) aba = listaBotoesAbas[0].nomeCodigo;
    this.props.dispatch({type: 'ativar-realce', abaAtiva: aba});
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
    this.atualizarEstilo(this.props.abaAtiva, 'color', cor.hex);
  }

  mudarCorFundo = (cor) => {
    this.atualizarEstilo('tampao', 'backgroundColor', cor.hex);
  }

  mudarFonte = (e) => {
    this.atualizarEstilo(this.props.abaAtiva, 'fontFamily', e.target.value, true)
  }

  mudarCaseTexto = () => {
    var i = this.state.caseTexto + 1;
    if (i >= casesTexto.length) i = 0; 
    this.setState({caseTexto: i})
    this.atualizarEstilo(this.props.abaAtiva, 'caseTexto', casesTexto[i].valor, true)
  }

  toggleEstiloTexto = (opcao) => {
    var obj = opcao.objeto || this.props.abaAtiva 
    var v = opcao.valorNormal;
    var atributoAplicado = this.props.slidePreview.estilo[obj][opcao.nomeAtributo];
    if (atributoAplicado !== opcao.valorAlterado) v = opcao.valorAlterado;
    this.atualizarEstilo(obj, opcao.nomeAtributo, v, true)
  }

  atualizarEstilo = (nomeObjeto, nomeAtributo, valor, redividir = false, temp = false) => {
    var sel = this.props.selecionado;
    var estiloObjeto = {};
    estiloObjeto[nomeAtributo] = valor
    var actionType = 'editar-slide' + (temp ? '-temporariamente' : '');
    this.props.dispatch({type: actionType, objeto: nomeObjeto, valor: estiloObjeto, redividir: redividir, selecionado: sel})
  }

  limparEstilo = () => {
    this.props.dispatch({type: 'limpar-estilo', selecionado: this.props.selecionado});
  }

  aplicarEstiloAoMestre = () => {
    var sel = this.props.selecionado;
    var aba = this.props.abaAtiva;
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

  static getDerivedStateFromProps(props, state) {
    if (props.selecionado.elemento !== state.selecionado.elemento || props.selecionado.slide !== state.selecionado.slide) {
        state.ref.current.value = props.slidePreview.estilo[props.abaAtiva].fontFamily;
        return {selecionado: props.selecionado};
    }
    return null;
  }
  
	render() {
    var aba = this.props.abaAtiva;
    return (
      <div id='painel-configuracao'>
          <div id='abas'>
            {this.gerarBotoesAbas()}
          </div>
      {this.state.painelCor}
          <div className='configuracoes'>
            <div className='botoes-direita'>
              <button title='Aplicar Estilo ao Slide-Mestre' className='botao-configuracao bool' 
                      style={{visibility: this.props.selecionado.elemento === 0 ? 'hidden' : 'visible'}}
                      onClick={this.aplicarEstiloAoMestre}>
                <RiMastercardLine size={this.state.tamIcones} />
              </button>
              <button title='Limpar Estilos do Slide' className='botao-configuracao bool' 
                      onClick={this.limparEstilo}>
                <CgErase size={this.state.tamIcones} />
              </button>
            </div>
            <div className='configuracoes-texto' 
                 style={{display: (aba === 'tampao' || aba === 'imagem' ? 'none' : '')}}>
              <div className='linha-configuracoes-texto'>
                <button id={'cor-texto'} className='botao-configuracao bool' onMouseOver={() => this.ativarPainelCor(this.mudarCorFonte)}>
                  <span className='a-cor-texto' style={{color: this.props.slideSelecionado.estilo[aba].color}}>A</span>
                  <div className='cor-texto' style={{backgroundColor: this.props.slideSelecionado.estilo[aba].color}}></div>
                </button>
                <select className={'botao-configuracao combo-fonte'} onChange={this.mudarFonte} ref={this.ref}
                        defaultValue={this.props.slidePreview.estilo[aba].fontFamily}
                        style={{fontFamily: this.props.slidePreview.estilo[aba].fontFamily}}>
                          {this.listaFontes}
                </select>
              </div>
              <div className='linha-configuracoes-texto'>
                <button title={casesTexto[this.state.caseTexto].valor} id='botao-case' className='botao-configuracao bool' 
                          onClick={this.mudarCaseTexto}>{casesTexto[this.state.caseTexto].icone}</button>
                <div className='botao-configuracao'>{this.gerarBotoesAlinhamento(aba)}</div>
                {this.gerarBotoesEstiloTexto(aba, 3, 3)}
              </div>
              <div className='linha-configuracoes-texto'>
                {this.gerarBotoesEstiloTexto(aba, 0, 2)}
                <div id='rotulo-configuracoes-musica' style={this.props.slidePreview.tipo === 'Música' ? null : {display: 'none'}}>
                  <BsMusicNoteBeamed size={this.state.tamIcones}/>
                </div>
                {this.gerarBotoesEstiloTexto(aba, 4)}
              </div>
            </div>
            <button className='botao-configuracao bool' onMouseOver={() => this.ativarPainelCor(this.mudarCorFundo)}
                    style={{display: (aba === 'tampao' ? '' : 'none')}}>
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
              {listaSliders.reduce(this.reducerListaSliders, [])}
            </div>
          </div>
      </div>
    )   
	}
}

const mapState = function (state) {
  var sel = state.present.selecionado;
  return {slideSelecionado: state.present.elementos[sel.elemento].slides[sel.slide], 
          selecionado: state.present.selecionado, 
          slidePreview: state.slidePreview, 
          abaAtiva: state.present.abaAtiva
  }
}

export default connect(mapState)(ConfigurarSlides);