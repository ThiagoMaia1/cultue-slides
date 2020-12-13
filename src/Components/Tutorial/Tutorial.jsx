import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Tutorial.css';
import Arrow from './Arrow';
import { store } from '../../index';
import hotkeys from 'hotkeys-js';

const cssOpacidade = 'opacity: 0.2';
const cssCorFundo = 'background-color: #d0d9ec; box-shadow: 2px 2px 6px rgba(0,0,0,0.1)';
const selectorQuadradinhoCanto = '.itens.lista-slides .quadradinho-canto';

const setOpacidadeQuadradinhoCanto = opacidade => {
  store.dispatch({type: 'definir-selecao', selecionado: {elemento: opacidade ? 1 : 2, slide: 0}})
  document.querySelectorAll(selectorQuadradinhoCanto)[0].style.opacity = opacidade || null;
}

const selecionarSlide = (elemento, slide) => store.dispatch({type: 'definir-selecao', selecionado: {elemento, slide}});
const selecionarAba = abaAtiva => store.dispatch({ type: 'ativar-realce', abaAtiva });

const getCSSFade = elementos => {
  var elemento = elementos[0];
  var pai = elemento.parentElement;
  var css = '';
  while (!(pai.id === 'App')) {
    var excecoes = '';
    var regraCss = (pai.id === '#botoes-flutuantes-app' ? cssCorFundo : cssOpacidade);
    for (var e of elementos) {
      excecoes += cssNot(getSelectors(e));
    }
    css += getSelectors(pai) + ' > *' + cssNot(getSelectors(elemento)) + excecoes + ' {' + regraCss + ';} ';
    elemento = pai;
    pai = elemento.parentElement;
  }
  if(elemento.id === 'organizador') { 
    css += '#botoes-flutuantes-app > * {' + cssCorFundo + ';} ';
  } else {
    css += '#organizador > * {' + cssOpacidade + ';} ' 
  }
  return css;
} 

const cssNot = (selector, bool = true) => {
  if(bool) {
    return ':not(' + selector + ')';
  } else {
    return ''
  }
}

const getSelectors = elemento => {
  var selectors = '';
  if (elemento.id) {
    selectors += ('#' + elemento.id);
  } else {
    if (elemento.className) selectors += '.' + elemento.className.replace(/ (?=\w)/, '.').replace(/\s+$/, '');
  }
  return selectors;
}

const listaBoxes = {
  painelAdicionar: [{
    texto: 'Clique para criar um elemento', 
    arrow: {posicao: 'bottomCenter', posicaoChildren: 'right', selectorElemento: '#div-botoes'},
    selectorElemento: '#bloco-adicionar'},
  ],
  slides: [
    {texto: 'As configurações do Slide-Mestre se aplicam aos demais slides. Cada grupo de slides também possui seu próprio slide-mestre.', 
     coordenadas: [15, 25], 
     arrow: {posicao: 'centerRight', posicaoChildren: 'bottom'},
     selectorElemento: '#slide-mestre',
     callbackAntes: () => selecionarSlide(0, 0)
    },
    {texto: 'Clique no canto superior esquerdo do slide-mestre para alterar as dimensões da tela/projetor.', 
     arrow: {posicao: 'centerLeft', posicaoChildren: 'bottom', selectorElemento: '#selecionar-aspect-ratio'},
     selectorElemento: '#borda-slide-mestre',
     callbackDepois: () => selecionarSlide(1, 0)
    },
    {texto: 'Clique para alterar as configurações e a imagem de fundo do slide selecionado', 
     coordenadas: [40, 40], 
     selectorElemento: '#botao-menu-configurar, #botao-mostrar-galeria'
    },
    {texto: 'Clique para ver a prévia da apresentação em tela cheia', 
     arrow: {posicao: 'bottomCenter', posicaoChildren: 'left', selectorElemento: '#ativar-tela-cheia'},
     selectorElemento: '#borda-slide-mestre',
    }
  ],
  arrastar: [
    {texto: 'Clique no slide, ou utilize as setas para navegar', 
     arrow: {posicao: 'centerRight', posicaoChildren: 'bottom'},
     selectorElemento: '#ordem-elementos'},
    {texto: 'Arraste os elementos para reordenar a apresentação', 
     arrow: {posicao: 'centerRight', posicaoChildren: 'bottom'},
     selectorElemento: '#ordem-elementos'},
    {texto: 'Clique no canto superior direito de um grupo de slides para exclui-lo, ou clique no lápis para editar o conteúdo do slide', 
     arrow: {posicao: 'centerRight', posicaoChildren: 'bottom', selectorElemento: '.itens.lista-slides'},
     selectorElemento: selectorQuadradinhoCanto,
     callbackAntes: () => setOpacidadeQuadradinhoCanto(1),
     callbackDepois: () => setOpacidadeQuadradinhoCanto(0)
    },
    {texto: 'Ao concluir, clique para exportar a apresentação pronta', 
     arrow: {posicao: 'centerLeft', posicaoChildren: 'top'},
     selectorElemento: '#menu-exportacao'},
  ],
  galeriaFundos: [
   {texto: 'Passe o mouse sobre uma imagem para ver o fundo aplicado ao slide selecionado, ou clique para selecionar o fundo', 
    coordenadas: [45, 45], 
    selectorElemento: '#botao-mostrar-galeria'}
  ],
  configuracoesSlide: [
   {texto: 'Selecione a aba para aplicar as configurações', 
    arrow: {posicao: 'centerLeft', posicaoChildren: 'bottom', selectorElemento: '#abas'},
    selectorElemento: '#botao-menu-configurar',
  },
   {texto: 'Ao editar as configurações de texto, os slides são automaticamente redivididos para caber', 
    coordenadas: [45, 45], 
    selectorElemento: '#botao-menu-configurar'},
   {texto: 'Você pode alterar a cor de fundo, e a opacidade da camada que se sobrepõe à imagem de fundo', 
    arrow: {posicao: 'centerLeft', posicaoChildren: 'bottom'},
    selectorElemento: '#botao-menu-configurar',
    callbackAntes: () => selecionarAba('tampao'),
    callbackDepois: () => selecionarAba('texto')
   },
   {texto: 'Clique diretamente no texto do slide para editar seu conteúdo', 
    coordenadas: [30, 50], 
    selectorElemento: '#borda-slide-mestre',
    callbackAntes: () => selecionarAba('paragrafo'),
    callbackDepois: () => selecionarAba('texto')
  },
   {texto: 'Clique para aplicar o estilo do slide selecionado ao slide-mestre do grupo ou da apresentação.',
    arrow: {posicao: 'centerLeft', posicaoChildren: 'bottom'},
    selectorElemento: '#botao-clonar-estilo'
   },
   {texto: 'Clique para limpar os estilos do slide, grupo ou apresentação selecionados.',
    arrow: {posicao: 'centerLeft', posicaoChildren: 'bottom'},
    selectorElemento: '#botao-limpar-estilo'
   }
  ]
}

export const keysTutoriais = Object.keys(listaBoxes);

class EtapaTutorial extends Component {
  
  constructor (props) {
    super(props);
    this.state = {item: {...props.itens[props.indice]}};
  }

  static getDerivedStateFromProps = (props, state) => {
    var itemProps = props.itens[props.indice] || {};
    if(state.item.texto !== itemProps.texto) {
      if (state.item.callbackDepois) state.item.callbackDepois();
      return {item: {...itemProps}};
    }
    return null;
  }
  
  removerCss = () => {
    if (this.styleSheet) {
      this.styleSheet.remove();
      this.styleSheet = null;
    }
    window.removeEventListener('resize', this.listenerResize);
  }

  componentDidUpdate = prevProps => {
    if(JSON.stringify(prevProps) !== JSON.stringify(this.props))
      this.componentDidMount();
  }

  componentDidMount = () => {
    hotkeys.setScope('tutorial');
    this.listenerResize = window.addEventListener('resize', () => this.forceUpdate());
    this.removerCss();
    var item = this.state.item;
    if (!item.texto) return;
    var elementos = document.querySelectorAll(item.selectorElemento);
    if (!elementos.length) return null;
    this.styleSheet = document.createElement("style");
    this.styleSheet.innerHTML = getCSSFade(elementos);
    if (item.callbackAntes) item.callbackAntes();
    document.head.appendChild(this.styleSheet);
  }

  componentWillUnmount = () => {
    hotkeys.setScope('app');
    this.removerCss();
  }

  render() {
    if(!this.props.itens.length) return null;
    var item = this.state.item;
    // if (!document.querySelectorAll(item.selectorElemento).length) return null;
    var a = item.arrow;
    var caixa = (
      <div className='caixa-tutorial'>
        {item.texto}
      </div>
    )
    return (
      <>
        {a
          ? <Arrow posicao={a.posicao} 
                   selectorElemento={a.selectorElemento || item.selectorElemento} 
                   posicaoChildren={a.posicaoChildren}
                   distancia={a.distancia || '10'}
                   tamanhoIcone={window.innerHeight*0.23}
            >
              {caixa}
            </Arrow>
          : <div style={{position: 'absolute', top: item.coordenadas[0] + 'vh', left: item.coordenadas[1] + 'vw'}}>
              {caixa}
            </div>
        }
      </>
    )
  }
}

class Tutorial extends Component {

  constructor (props) {
    super(props);
    this.styleSheet = null;
    this.state = {indiceEtapa: -1};

    hotkeys('backspace,enter,space,esc,left,right', 'tutorial', (e, handler) => {
      e.preventDefault();    
      var offset;
      switch (handler.key) {
        case 'left':
        case 'backspace':
          offset = -1;
          break;
        case 'right':
        case 'enter':
        case 'space':
          offset = 1;
          break;
        case 'esc':
          this.finalizar();
          return;
        default:
          return;
      }
      this.offsetEtapaTutorial(offset);
    });
  }

  getNovoIndice = (passo, indiceEtapa) => {
    var novoIndice = indiceEtapa + passo;
    return novoIndice >= this.props.itensTutorial.length 
           ? -1 
           : novoIndice;
  }

  offsetEtapaTutorial = passo => {
    var indice = this.state.indiceEtapa;
    // do {
      indice = this.getNovoIndice(passo, indice);
      if (indice === -1) {
        this.props.dispatch({type: 'definir-item-tutorial', zerar: true});
        // break;
      }
    // } while(!document.querySelectorAll(this.props.itensTutorial[indice].selectorElemento).length)
    this.setState({indiceEtapa: indice});
  }

  static getDerivedStateFromProps = (props, state) => {
    if(props.itensTutorial.length > 0 && state.indiceEtapa === -1)
      return {indiceEtapa: 0}
    return null;
  }

  finalizar = () => {
    for (var i = this.state.indiceEtapa; i < this.props.itensTutorial.length; i++) {
      setTimeout(() => this.offsetEtapaTutorial(1), 1)
    }
    setTimeout(() => this.props.dispatch({type: 'bloquear-tutoriais'}), 10);
  }

  temTutorialAtivo = (props = this.props) => !!props.itensTutorial.length; 

  render() {
    var ativo = this.temTutorialAtivo();
    return (
      <div id='fundo-tutorial' style={ativo ? null : {pointerEvents: 'none'}}>
        <EtapaTutorial itens={[...this.props.itensTutorial]} indice={this.state.indiceEtapa}/>
        {ativo
          ? <>
              <button id='pular-tutorial' className='botao limpar-input' onClick={this.finalizar}>Não Exibir Tutoriais</button>
              <div id='rodape-tutorial'>
                <button className='botao neutro' onClick={() => this.offsetEtapaTutorial(-1)}
                  style={this.state.indiceEtapa === 0 ? {visibility: 'hidden'} : null}>
                  Anterior
                </button>
                <button className='botao neutro' onClick={() => this.offsetEtapaTutorial(1)}>
                  {(this.state.indiceEtapa === this.props.itensTutorial.length-1) ? 'Concluir' : 'Próximo'}
                </button>
              </div>
            </>
          : null  
        }
      </div>
    );
  }
}

const mapState = state => {
  var arrayTutorial = [];
  for (var i of state.itensTutorial) {
    arrayTutorial.push(listaBoxes[i]);
  }
  return {itensTutorial: arrayTutorial.flat()}
}

export default connect(mapState)(Tutorial);

