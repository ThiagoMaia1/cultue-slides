import React, { Component, Fragment } from 'react';
import './style.css';
import { connect } from 'react-redux';
import { CgErase, CgEye } from 'react-icons/cg';
import { RiMastercardLine } from 'react-icons/ri'
import { BsTextLeft, BsTextCenter, BsTextRight, BsJustify, BsMusicNoteBeamed, BsFileBreak, BsArrowsFullscreen} from 'react-icons/bs';
import { BiVerticalCenter, BiHorizontalCenter } from 'react-icons/bi';
import { VscCollapseAll } from 'react-icons/vsc';
import { AiOutlineRotateLeft, AiOutlineBook } from 'react-icons/ai';
import Slider from '../Basicos/Slider/Slider';
import Select from '../Basicos/Select/Select';
import BotaoInfo from '../Basicos/BotaoInfo/BotaoInfo';
import ColorPicker from '../Basicos/ColorPicker/ColorPicker';
import { rgbObjToStr, parseCorToRgb, invertColor, rgbToHex } from '../../principais/FuncoesGerais';
import { listaPartesEstilo } from '../../principais/Element';
import { lerImagem } from '../Preview/Img';
import { fontes } from '../MenuExportacao/ModulosFontes';

const estiloBloco = {borderRadius: 'var(--round-border-pequeno)', maxWidth: '15vw', backgroundColor: '#efefef', marginTop: '0.8vh', zIndex: 29};

const casesTexto = [{valor: 'Nenhum', icone: (<span style={{color: '#999'}}>Aa</span>)}, {valor: 'Primeira Maiúscula', icone: 'Aa'}, 
                    {valor: 'Maiúsculas', icone: 'AA'}, {valor: 'Minúsculas', icone: 'aa'}
];

const SeparadorFontes = () => {
  
  return (
    <div className='separador-fontes'>
      Fontes Especiais
      <BotaoInfo mensagem={'As fontes abaixo não estão disponíveis na maioria dos computadores. Para utiliza-las no PowerPoint você deverá ' + 
                          'instalá-las individualmente. Recomendamos o download em HTML, que não apresenta essa limitação.'}/>
    </div>
  )
}

const getOpcaoFonte = f => (
  {valor: f, style: {fontFamily: f}}
)
const opcoesListaFontes = [
  ...fontes.basicas.sort().map(getOpcaoFonte),
  {valor: 'Fontes Especiais', rotulo: <SeparadorFontes/>, style: {minHeight: '6vh', marginBottom: '1vh', backgroundColor: 'var(--platinum)'}, 
   eSeparador: true},
  ...fontes.google.sort().map(getOpcaoFonte)
]

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
                      {rotulo: 'Margens Laterais', aba: 'paragrafo', atributo: 'paddingRight', min: 0.02, max: 0.3, step: 0.01,  redividir: true},
                      {rotulo: 'Margem Inferior', aba: 'paragrafo', atributo: 'paddingBottom', min: 0.02, max: 0.3, step: 0.01,  redividir: true},
                      {rotulo: 'Espaça-\nmento', aba: 'paragrafo', atributo: 'lineHeight', min: 0.5, max: 3, step: 0.1,  redividir: true},
                      {rotulo: 'Fonte', aba: 'titulo', atributo: 'fontSize', min: 1, max: 7, step: 0.01,  redividir: true},
                      {rotulo: 'Margem', aba: 'titulo', atributo: 'paddingRight', min: 0, max: 0.4, step: 0.01,  redividir: true},
                      {rotulo: 'Altura', aba: 'titulo', atributo: 'height', min: 0.1, max: 1, step: 0.01,  redividir: true},
                      {rotulo: 'Opacidade', aba: 'tampao', atributo: 'opacityFundo', min: 0, max: 1, step: 0.05},
                      {rotulo: 'Curvatura\nda Borda', aba: 'imagem', atributo: 'borderRadius', min: 0, max: 500, step: 1, unidade: 'px'}
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
                                simbolo: <div className='icone-duas-colunas'>
                                           <BsJustify size={this.state.tamIcones}/><BsJustify size={this.state.tamIcones}/>
                                         </div>, objeto: 'paragrafo'}, 
                              {apelido: 'Multiplicadores', nomeAtributo: 'multiplicadores', valorNormal: false, valorAlterado: true, 
                                simbolo: 'x2', tipo: 'Música', objeto: 'paragrafo'},
                              {apelido: 'Juntar Estrofes Repetidas', nomeAtributo: 'omitirRepeticoes', valorNormal: false, valorAlterado: true, 
                                simbolo: <VscCollapseAll size={1.2*this.state.tamIcones}/>, tipo: 'Música', objeto: 'paragrafo'},
                              {apelido: 'Slide de Título', nomeAtributo: 'isolar', valorNormal: false, valorAlterado: true, 
                                simbolo: <AiOutlineRotateLeft size={this.state.tamIcones}/>, objeto: 'titulo', exigeMestre: true,
                                callback: () => {
                                  let t = this.props.slidePreview.estilo.titulo;
                                  if(!t.isolar && !t.visibility) this.toggleEstiloTexto(this.listaEstilosTexto[8]);
                                }},
                              {apelido: 'Posição Título', nomeAtributo: 'abaixo', valorNormal: false, valorAlterado: true, 
                                simbolo: <div className='icone-posicao-titulo'><BsFileBreak size={this.state.tamIcones}/></div>, 
                                objeto: 'titulo', exigeNaoTitulo: true, callback: () => {
                                  let t = this.props.slidePreview.estilo.titulo;
                                  if(t.visibility === 'hidden') this.toggleEstiloTexto(this.listaEstilosTexto[8]);
                                }},
                              {apelido: 'Ocultar Título', nomeAtributo: 'visibility', valorNormal: null, valorAlterado: 'hidden', 
                                exigeNaoTitulo: true, naoAplicarEstilo: true, objeto: 'titulo', 
                                simbolo: <><div className='risco-olho'/><CgEye size={this.state.tamIcones}/></>
                              },
                              {apelido: 'Cobrir Tela', exigeNaoTitulo: true, naoAplicarEstilo: true, objeto: 'imagem', 
                               valorAlterado: -1, simbolo: <BsArrowsFullscreen size={this.state.tamIcones}/>, 
                               callback: () => this.despacharAlinhamento('cobrir')
                              },
                              {apelido: 'Alinhar Horizontalmente', exigeNaoTitulo: true, naoAplicarEstilo: true, objeto: 'imagem', 
                               valorAlterado: -1, simbolo: <BiHorizontalCenter size={this.state.tamIcones}/>, 
                               callback: () => this.despacharAlinhamento('horizontal')
                              },
                              {apelido: 'Alinhar Verticalmente', exigeNaoTitulo: true, naoAplicarEstilo: true, objeto: 'imagem', 
                               valorAlterado: -1, simbolo: <BiVerticalCenter size={this.state.tamIcones}/>, 
                               callback: () => this.despacharAlinhamento('vertical')
                              },
                              {apelido: 'Exibir Livro', exigeNaoTitulo: true, nomeAtributo: 'temLivro', objeto: 'paragrafo', 
                               valorNormal: false, valorAlterado: true, simbolo: <AiOutlineBook size={this.state.tamIcones}/>, tipo: "TextoBíblico"
                              },
                              {apelido: 'Exibir Capítulo', exigeNaoTitulo: true, nomeAtributo: 'temCap', objeto: 'paragrafo', 
                               valorNormal: false, valorAlterado: true, simbolo: 2, tipo: "TextoBíblico"
                              },
                              {apelido: 'Exibir Versículo', exigeNaoTitulo: true, nomeAtributo: 'temVers', objeto: 'paragrafo', 
                               valorNormal: false, valorAlterado: true, simbolo: <sup>2</sup>, tipo: "TextoBíblico"
                              }
    ]; 
  }

  getTargetBotao = event => {
    let {target} = event;
    if(target.parentNode.tagName === 'BUTTON') target = target.parentNode; 
    return target;
  }

  gerarBotoesEstiloTexto = (aba, iIni = 0, iFin = 20) => {
    var lista = this.listaEstilosTexto.filter((_e, i) => i >= iIni && i <= iFin);
    return lista.map((e, i) => {
      const slidePreview = this.props.slidePreview;
      if (   (e.tipo && e.tipo !== slidePreview.tipo) 
          || (e.objeto && e.objeto !== aba)
          || (e.exigeNaoTitulo && slidePreview.eTitulo))
        return null;
      var objEstilo = {};
      objEstilo[e.nomeAtributo] = e.valorAlterado;
      if (e.exigeMestre && !slidePreview.eMestre) objEstilo.visibility = 'hidden';
      return (
        <button key={i} title={e.apelido}
                className={e.nomeAtributo + ' botao-configuracao bool ' + (this.props.slideSelecionado.estilo[aba][e.nomeAtributo] === e.valorAlterado ? ' clicado' : '')} 
                onMouseDown={event => {
                  let target = this.getTargetBotao(event);
                  target.classList.add('clicado')}}
                onClickCapture={event => {
                  let target = this.getTargetBotao(event);
                  target.classList.remove('clicado');
                  if(e.callback) e.callback(e);
                  if(e.nomeAtributo) this.toggleEstiloTexto(e);
                }}
                style={e.naoAplicarEstilo ? null : objEstilo}>
          {e.simbolo ? e.simbolo : e.apelido[0]}
        </button>
      )
    })
  }

  despacharAlinhamento = alinhamento => {
    this.props.dispatch({type: 'editar-slide', objeto: 'insetImagem', alinhamento})
  }

  gerarBotoesAbas = () => {
    return listaBotoesAbas.slice(1).map((a, i) => {
      var { tipo, eTitulo } = this.props.slidePreview;
      if (tipo === 'Imagem' || tipo === 'Vídeo') {
        if (a.nomeCodigo === 'paragrafo') return null;
        if (a.nomeCodigo === 'imagem' && tipo !== a.nomeInterface) return null;
      } else {
        if (a.nomeCodigo === 'imagem') return null;
      }
      if(eTitulo && a.nomeCodigo === 'paragrafo') return null;
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
  
  ativarPainelCor = (callback, corAtual) => {
    this.setState({painelCor: (
      <div className='container-painel-cor' onMouseLeave={this.desativarPainelCor}>
        <div className='painel-cor'>
          <ColorPicker corAtual={corAtual} callback={cor => {
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
    this.props.dispatch(
      {type: 'editar-slide', 
       objeto: 'estilo', 
       valor: this.props.slidePreview.estilo,
       selecionado: {
          elemento: sel.slide !== 0 ? sel.elemento : 0,
          slide: 0
        }
      }
    );
  }
  
  getQuadriculado = () => require('./Quadriculado PNG.png').default;

  getBackgroundImage = () => {
    let { fundo } = this.props.slidePreview.estilo;
    let url = (!fundo.path && !fundo.src) ? this.getQuadriculado() : lerImagem(fundo, 600);
    return 'url("' + url + '")';
  }

  ativarPainelCorFundo = () => 
    this.ativarPainelCor(this.mudarCorFundo, this.props.slidePreview.estilo.tampao.backgroundColor || {r: 255, g: 255, b: 255});

	render() {
    var aba = this.props.abaAtiva;
    var slidePreview = this.props.slidePreview;
    var sel = this.props.selecionado;
    var slideSelecionado = this.props.slideSelecionado;
    let { fundo } = slidePreview.estilo;
    let semFundo = !fundo.path && !fundo.src;
    const corFonte = rgbObjToStr(parseCorToRgb(slideSelecionado.estilo[aba].color || '#000000'));
    const corFonteParagrafo = rgbToHex(slideSelecionado.estilo.paragrafo.color || {})  || '#000000';
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
        <div id='configuracoes'>
          {aba === 'tampao' || aba === 'imagem' 
            ? <div className='botoes-direita float'>
                {botoesDireita}
              </div> 
            : null}
          <div className='configuracoes-texto' 
                style={{display: (aba === 'tampao' || aba === 'imagem' ? 'none' : '')}}>  
            <div className='bloco-configuracoes-texto-botoes-direita'>
              <div className='linha-configuracoes-texto'>
                <button id={'cor-texto'} className='botao-configuracao bool' onMouseOver={() => this.ativarPainelCor(this.mudarCorFonte, slidePreview.estilo[aba].color || {r: 0, g: 0, b: 0})}>
                  <span className='a-cor-texto' style={{color: corFonte}}>A</span>
                  <div className='cor-texto' style={{backgroundColor: corFonte}}></div>
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
            {aba !== 'titulo' ? null 
              : <div className='linha-configuracoes-texto'>
                  {this.gerarBotoesEstiloTexto(aba, 6)}
                </div>
              }
          </div>
          <div id='container-configuracoes-tampao' style={{display: (aba === 'tampao' ? '' : 'none')}}>
            <button id='botao-cor-fundo' className='botao-configuracao bool' onMouseOver={this.ativarPainelCorFundo} onClick={this.ativarPainelCorFundo}>
              <div className='container cor-fundo' style={{backgroundImage: ' url("' + this.getQuadriculado() + '")'}}>
                <div className='quadrado cor-fundo' style={{backgroundColor: slidePreview.estilo.tampao.backgroundColor}}>
                </div>
              </div>
            </button>
            <Select id='selecionar-filtro-fundo'
                    iniciaAberto={this.props.tutorialAtivo}
                    key={sel.elemento + '.' + sel.slide + '.' + aba}
                    className='botao-configuracao combo-fonte isolar-spans-filhos'
                    onChange={o => this.mudarBlendMode(o.valor)} 
                    defaultValue={slidePreview.estilo.fundo.mixBlendMode || 'normal'}
                    opcoes={opcoesListaBlendMode}
                    onMouseEnterOpcao={o => this.atualizarEstiloPreview(aba, {mixBlendMode: o.style.mixBlendMode})}
                    onMouseLeaveOpcao={() => this.atualizarEstiloPreview(undefined, true)}
                    style={{fontSize: '90%'}}
                    estiloBloco={{...estiloBloco, '--cor-sombra-select-filtro': invertColor(corFonteParagrafo, true), 
                                  fontSize: '90%', backgroundImage: this.getBackgroundImage(), 
                                  backgroundPosition: 'center', backgroundSize: semFundo ? '' : 'auto 100%',  
                                  backgroundRepeat: semFundo ? '' : 'no-repeat',
                                  boxShadow: 'var(--box-shadow)', color: corFonteParagrafo}}/>
          </div>
          {aba !== 'imagem' ? null :
            this.gerarBotoesEstiloTexto(aba, 7)}
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