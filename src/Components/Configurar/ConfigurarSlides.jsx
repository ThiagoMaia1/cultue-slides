import React, { Component, Fragment } from 'react';
import './style.css';
import { connect } from 'react-redux';
import { CgErase } from 'react-icons/cg';
import { RiMastercardLine } from 'react-icons/ri'
import { BsTextLeft, BsTextCenter, BsTextRight, BsJustify, BsMusicNoteBeamed} from 'react-icons/bs';
import { VscCollapseAll } from 'react-icons/vsc';
import { CompactPicker } from 'react-color';
import Slider from '../Basicos/Slider/Slider';
import Select from '../Basicos/Select/Select';
import { listaPartesEstilo } from '../../principais/Element';
import { lerImagem } from '../Preview/Img';

const estiloBloco = {borderRadius: 'var(--round-border-pequeno)', maxWidth: '15vw', backgroundColor: '#efefef', marginTop: '0.8vh', zIndex: 29};

const casesTexto = [{valor: 'Nenhum', icone: (<span style={{color: '#999'}}>Aa</span>)}, {valor: 'Primeira Maiúscula', icone: 'Aa'}, 
                    {valor: 'Maiúsculas', icone: 'AA'}, {valor: 'Minúsculas', icone: 'aa'}
];

const fontesBasicas = ['Roboto', 'Helvetica', 'Arial', 'Times New Roman', 'Courier', 'Courier New', 'Verdana', 
                       'Tahoma', 'Arial Black', 'Georgia', 'Impact'
];

const fontesGoogle = ['Montserrat', 'Source Sans Pro', 'Noto Sans', 'Amatic SC', 'Big Shoulders Stencil Display', 'Bree Serif', 'Cinzel', 
                      'Comfortaa', 'Dosis', 'Indie Flower', 'Kanit', 'Lato', 'Libre Baskerville', 'Lobster', 'Major Mono Display',
                      'Nunito', 'Oswald', 'Pacifico', 'Poppins', 'PT Sans', 'Texturina'
];

const listaFontes = [...fontesBasicas, ...fontesGoogle];

const opcoesListaFontes = listaFontes.map(f => (
  {valor: f, style: {fontFamily: f}}
));

const listaBotoesAbas = [{nomeCodigo: listaPartesEstilo[0], nomeInterface: 'Texto'},
                         {nomeCodigo: listaPartesEstilo[1], nomeInterface: 'Título', maxFonte: '7'}, 
                         {nomeCodigo: listaPartesEstilo[2], nomeInterface: 'Parágrafo', maxFonte: '4'}, 
                         {nomeCodigo: listaPartesEstilo[5], nomeInterface: 'Imagem'},
                         {nomeCodigo: listaPartesEstilo[5], nomeInterface: 'Vídeo'},
                         {nomeCodigo: listaPartesEstilo[4], nomeInterface: 'Fundo'}
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
                      {rotulo: 'Opacidade', aba: 'tampao', atributo: 'opacityFundo', min: 0, max: 1, step: 0.05},
                      {rotulo: 'Curvatura\nda Borda', aba: 'imagem', atributo: 'borderRadius', min: 0, max: 100, step: 1, unidade: 'px'}
]

const listaBlendMode = [
  {rotulo: 'Normal', valor: 'normal'},
  {rotulo: 'Multiplicar', valor: 'multiply'},
  {rotulo: 'Tela', valor: 'screen'},
  {rotulo: 'Sobrepor', valor: 'overlay'},
  {rotulo: 'Escurecer', valor: 'darken'},
  {rotulo: 'Iluminar', valor: 'lighten'},
  {rotulo: 'Desvio de Cor', valor: 'color-dodge'},
  {rotulo: 'Queima de Cor', valor: 'color-burn'},
  {rotulo: 'Luz Forte', valor: 'hard-light'},
  {rotulo: 'Luz Suave', valor: 'soft-light'},
  {rotulo: 'Diferença', valor: 'difference'},
  {rotulo: 'Exclusão', valor: 'exclusion'},
  {rotulo: 'Matiz', valor: 'hue'},
  {rotulo: 'Saturação', valor: 'saturation'},
  {rotulo: 'Cor', valor: 'color'},
  {rotulo: 'Luminosidade', valor: 'luminosity'}
]

const BotaoClonarEstilo = (props) => (
  <button id='botao-clonar-estilo' className='botao-configuracao bool'
          title='Aplicar Estilo ao Slide-Mestre'  
          style={{visibility: props.visivel ? 'visible' : 'hidden'}}
          onClick={props.aplicarEstiloAoMestre}>
    <RiMastercardLine size={props.tamIcones} />
  </button>
)

const BotaoLimparEstilo = (props) => (
  <button id='botao-limpar-estilo'  className='botao-configuracao bool' 
          title='Limpar Estilos do Slide'
          onClick={props.limparEstilo}>
    <CgErase size={props.tamIcones} />
  </button>
)

class ConfigurarSlides extends Component {
  constructor(props) {
    super(props);
    this.state = {painelCor: null, caseTexto: 0, tamIcones: window.innerHeight*0.022 + 'px'};
  
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
      return (
        <Fragment key={i}>
          <button className='botao-aba' key={i+1}
            onClick={() => this.selecionarAba(a.nomeCodigo)}>
              {a.nomeInterface}
              {tampar}
          </button>
        </Fragment>
      )
    });
  }

  gerarBotoesEstiloTexto = (aba, iIni = 0, iFin = 99) => {
    var lista = this.listaEstilosTexto.filter((e, i) => i >= iIni && i <= iFin);
    return lista.map((e, i) => {
      if (e.tipo && e.tipo !== this.props.slidePreview.tipo) return null;
      var objEstilo = {};
      objEstilo[e.nomeAtributo] = e.valorAlterado;
      return (
        <button key={i} title={e.apelido}
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
        <button key={b.titulo}
                title={b.titulo} 
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
    let valorAplicado = this.props.slidePreview.estilo[s.aba][s.atributo] || 0;
    let temPorcentagem = /%/.test(valorAplicado);
    if(typeof valorAplicado === 'string') valorAplicado = Number(valorAplicado.replace(s.unidade || '%',''));
    resultado.push(
      <Slider key={s.atributo + '-' + s.aba} atributo={s.atributo} objeto={s.aba} rotulo={s.rotulo} min={s.min} max={s.max} step={s.step} unidade={s.unidade || '%'}
              valorAplicado={Number(valorAplicado)/(temPorcentagem ? 100 : 1)}
              callback={(valor, temp = false) => this.atualizarEstilo(s.aba, s.atributo, valor + (s.unidade || ''), s.redividir, temp)}
              style={{display: (this.props.abaAtiva === s.aba ? '' : 'none')}}/>
    );
    return resultado;
  }

  selecionarAba = aba => {
    if (aba === this.props.abaAtiva) aba = listaBotoesAbas[0].nomeCodigo;
    this.props.dispatch({type: 'ativar-realce', abaAtiva: aba});
  }
  
  ativarPainelCor = callback => {
    this.setState({painelCor: (
      <div className='container-painel-cor' onMouseLeave={this.desativarPainelCor}>
        <div className='painel-cor'>
          <CompactPicker onChange={cor => {
            callback(cor); 
            this.desativarPainelCor();
          }}/>
        </div>
      </div>
    )
    })
  }

  desativarPainelCor = () => this.setState({painelCor: null})

  mudarCorFonte = cor => {
    this.atualizarEstilo(this.props.abaAtiva, 'color', cor.rgb);
  }

  mudarCorFundo = cor => {
    this.atualizarEstilo('tampao', 'backgroundColor', cor.rgb);
  }

  mudarFonte = (valor) => {
    this.atualizarEstilo(this.props.abaAtiva, 'fontFamily', valor, true, false)
  }

  mudarBlendMode = (valor) => {
    this.atualizarEstilo(this.props.abaAtiva, 'mixBlendMode', valor, false, false)
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
    var type = 'editar-slide' + (temp ? '-temporariamente' : '');
    this.props.dispatch({type, objeto: nomeObjeto, valor: estiloObjeto, redividir, selecionado: sel})
  }

  atualizarEstiloPreview = (objeto, valor, reverter = false) => {
    this.props.dispatch({type: 'editar-slide-preview', objeto, valor, reverter})
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
  
  getBackgroundImage = () => 'url("' + lerImagem(this.props.slidePreview.estilo.fundo, 600) + '")';

	render() {
    var aba = this.props.abaAtiva;
    var slidePreview = this.props.slidePreview;
    var sel = this.props.selecionado;
    const botoesDireita = (
      <>
        <BotaoClonarEstilo visivel={sel.elemento || this.props.tutorialAtivo} 
                      tamIcones={this.state.tamIcones} 
                      aplicarEstiloAoMestre={this.aplicarEstiloAoMestre}/>
        <BotaoLimparEstilo limparEstilo={this.limparEstilo} tamIcones={this.state.tamIcones}/>
      </>
    )
    const opcoesListaBlendMode = listaBlendMode.map(b => (
      {rotulo: '', textoSpan: b.rotulo, valor: b.valor, 
       style: {mixBlendMode: b.valor, backgroundColor: slidePreview.estilo.tampao.backgroundColor}}
    ));
    return (
      <div id='painel-configuracao' key={sel.elemento + '.' + sel.slide}>
        <div id='abas'>
          {this.gerarBotoesAbas()}
        </div>
        {this.state.painelCor}
        <div className='configuracoes'>
          {aba === 'tampao' 
            ? <div className='botoes-direita float'>
                {botoesDireita}
              </div> 
            : null}
          <div className='configuracoes-texto' 
                style={{display: (aba === 'tampao' || aba === 'imagem' ? 'none' : '')}}>  
            <div className='bloco-configuracoes-texto-botoes-direita'>
              <div className='linha-configuracoes-texto'>
                <button id={'cor-texto'} className='botao-configuracao bool' onMouseOver={() => this.ativarPainelCor(this.mudarCorFonte)}>
                  <span className='a-cor-texto' style={{color: this.props.slideSelecionado.estilo[aba].color}}>A</span>
                  <div className='cor-texto' style={{backgroundColor: this.props.slideSelecionado.estilo[aba].color}}></div>
                </button>
                <Select key={sel.elemento + '.' + sel.slide + '.' + aba}
                        className='botao-configuracao combo-fonte' opcoes={opcoesListaFontes} defaultValue={slidePreview.estilo[aba].fontFamily}
                        style={{fontFamily: slidePreview.estilo[aba].fontFamily}} onChange={({valor}) => this.mudarFonte(valor)} 
                        onMouseEnterOpcao={o => this.atualizarEstiloPreview(aba, o.style)}
                        onMouseLeaveOpcao={() => this.atualizarEstiloPreview(undefined, undefined, true)}
                        estiloBloco={estiloBloco}/>
                <button title={casesTexto[this.state.caseTexto].valor} id='botao-case' className='botao-configuracao bool' 
                          onClick={this.mudarCaseTexto}>{casesTexto[this.state.caseTexto].icone}</button>
                <div id='container-botoes-alinhamento' className='botao-configuracao'>{this.gerarBotoesAlinhamento(aba)}</div>
                {/* {aba === 'paragrafo' //Todo: melhorar botão de dividir em colunas.
                  ? this.gerarBotoesEstiloTexto(aba, 3, 3)
                  : null
                } */}
                </div>
                {aba !== 'tampao' 
                    ? <div className='botoes-direita flex'>
                        {botoesDireita}
                      </div> 
                : null}
            </div>
            <div className='linha-configuracoes-texto abaixo'>
              <div id='negrito-italico-sublinhado'>
                {this.gerarBotoesEstiloTexto(aba, 0, 2)}
              </div>
              {aba === 'paragrafo'
                ? <div id='configuracoes-musica'>
                    <div id='rotulo-configuracoes-musica' style={slidePreview.tipo === 'Música' ? null : {display: 'none'}}>
                      <BsMusicNoteBeamed size={this.state.tamIcones}/>
                    </div>
                  {this.gerarBotoesEstiloTexto(aba, 4)}
                </div>
                : null
              }
            </div>
          </div>
          <div className='container-configuracoes-tampao' style={{display: (aba === 'tampao' ? '' : 'none')}}>
            <button className='botao-configuracao bool' onMouseOver={() => this.ativarPainelCor(this.mudarCorFundo)}>
              <div className='container cor-fundo' style={{backgroundImage: ' url("' + require('./Quadriculado PNG.png') + '")'}}>
                <div className='quadrado cor-fundo' style={{backgroundColor: this.props.slidePreview.estilo.tampao.backgroundColor
                                                          // , mixBlendMode: this.props.slidePreview.estilo.tampao.mixBlendMode
                                                            }}>
                </div>
              </div>
            </button>
            <Select key={sel.elemento + '.' + sel.slide + '.' + aba}
                    className='botao-configuracao combo-fonte isolar-spans-filhos'
                    onChange={o => this.mudarBlendMode(o.valor)} 
                    defaultValue={slidePreview.estilo.fundo.mixBlendMode || 'normal'}
                    opcoes={opcoesListaBlendMode}
                    onMouseEnterOpcao={o => this.atualizarEstiloPreview(aba, o.style)}
                    onMouseLeaveOpcao={() => this.atualizarEstiloPreview(undefined, true)}
                    style={{fontSize: '90%'}}
                    estiloBloco={{...estiloBloco, fontSize: '90%', backgroundImage: this.getBackgroundImage(), 
                                  backgroundSize: 'auto 100%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
                                  boxShadow: 'var(--box-shadow)', color: slidePreview.estilo.paragrafo.color}}/>
          </div>
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
          abaAtiva: state.present.abaAtiva,
          tutorialAtivo: state.itensTutorial.includes('configuracoesSlide')
  }
}

export default connect(mapState)(ConfigurarSlides);