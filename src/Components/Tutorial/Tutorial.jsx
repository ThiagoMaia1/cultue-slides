import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Tutorial.css';
import { FaLongArrowAltRight } from 'react-icons/fa';
import { store } from '../../index';

const cssOpacidade = 'opacity: 0.2';
const cssCorFundo = 'background-color: #d0d9ec; box-shadow: 2px 2px 6px rgba(0,0,0,0.1)';

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
    coordenadas: [43, 18], 
    arrow: {rotacao: 270, posicao: {top: '-8vh', left: '-10vw'}},
    selectorElemento: '#tampao-do-overflow'},
  ],
  slides: [
    {texto: 'As configurações do Slide-Mestre se aplicam aos demais slides. Cada grupo de slides também possui seu próprio slide-mestre.', 
     coordenadas: [15, 25], 
     arrow: {rotacao: 180, posicao: {top: '-19vh'}},
     selectorElemento: '#slide-mestre',
     callback: () => store.dispatch({type: 'definir-selecao', selecionado: {elemento: 0, slide: 0}})
    },
    {texto: 'Clique para alterar as configurações e a imagem de fundo do slide selecionado', 
     coordenadas: [40, 40], 
     selectorElemento: '#botao-menu-configurar, #botao-mostrar-galeria',
     callback: () => store.dispatch({type: 'definir-selecao', selecionado: {elemento: 1, slide: 0}})
    },
    {texto: 'Clique para ver a prévia da apresentação em tela cheia', 
     coordenadas: [60, 51.5], 
     arrow: {rotacao: 270, posicao: {top: '-3vh', left: '14vw'}},
     selectorElemento: '#borda-slide-mestre'}
  ],
  arrastar: [
    {texto: 'Clique no slide, ou utilize as setas para navegar', 
     coordenadas: [23, 25], 
     arrow: {rotacao: 180, posicao: {top: '-18vh', left: ''}},
     selectorElemento: '#slide-mestre'},
    {texto: 'Arraste os elementos para reordenar a apresentação', 
     coordenadas: [23, 25], 
     arrow: {rotacao: 180, posicao: {top: '-18vh', left: ''}},
     selectorElemento: '#ordem-elementos'},
    {texto: 'Clique no canto superior direito de um slide ou grupo de slides para exclui-lo, ou clique no botão do lápis para editar o conteúdo do slide na janela de adição', 
     coordenadas: [15, 25], 
     arrow: {rotacao: 180, posicao: {top: '-19vh'}},
     selectorElemento: '#slide-mestre'},
    {texto: 'Ao concluir, clique para exportar a apresentação pronta', 
     coordenadas: [59, 74], 
     arrow: {rotacao: 0, posicao: {top: '8vh', left: '2vw'}},
     selectorElemento: '#menu-exportacao'},
  ],
  galeriaFundos: [
   {texto: 'Passe o mouse sobre uma imagem para ver o fundo aplicado ao slide selecionado, ou clique para selecionar o fundo', 
    coordenadas: [45, 45], 
    selectorElemento: '#botao-mostrar-galeria'}
  ],
  configuracoesSlide: [
   {texto: 'Selecione a aba para aplicar as configurações', 
    coordenadas: [15, 60], 
    arrow: {rotacao: 0, posicao: {top: '-18.5vh', left: '5vw'}},
    selectorElemento: '#botao-menu-configurar'},
   {texto: 'Ao editar as configurações de texto, os slides são automaticamente redivididos para caber', 
    coordenadas: [45, 45], 
    selectorElemento: '#botao-mostrar-galeria'},
   {texto: 'Você pode alterar a cor de fundo, e a opacidade da camada que se sobrepõe à imagem de fundo', 
    coordenadas: [45, 45], 
    selectorElemento: '#botao-mostrar-galeria',
    callback: () => store.dispatch({type: 'ativar-realce', abaAtiva: 'tampao'})}
  ]
}

export const keysTutoriais = Object.keys(listaBoxes);

// const getNomeId = nome => getNomeInterfaceTipo(nome).toLowerCase().replace(' ', '-');

// const getNomeCamel = nome => nome.toLowerCase().replace(/-[a-z]/g, c => c.replace('-', '').toUpperCase());

class EtapaTutorial extends Component {
  
  componentDidUpdate = () => {
    console.log('oi');
    this.removerCss();
    this.styleSheet = document.createElement("style");
    var elementos = document.querySelectorAll(this.props.selectorElemento);
    if (!elementos.length) return null;
    this.styleSheet.innerHTML = getCSSFade(elementos);
    if (this.props.callback) this.props.callback();
    document.head.appendChild(this.styleSheet);
  }
  
  removerCss = () => {
    if (this.styleSheet) {
      this.styleSheet.remove();
      this.styleSheet = null;
    }
  }

  componentWillUnmount = () => this.removerCss();

  render() {
    return (
      <div className='container-caixa-tutorial' style={{top: this.props.coordenadas[0] + 'vh', left: this.props.coordenadas[1] + 'vw'}}>
        {this.props.arrow 
          ? <div className='arrow' style={{transform: 'rotate(' + this.props.arrow.rotacao + 'deg)', ...this.props.arrow.posicao}}>
              <FaLongArrowAltRight size={150}/>
            </div>
          : null
        }
        <div className='caixa-tutorial'>
          {this.props.texto}
        </div>
      </div>
    )
  }
}

class Tutorial extends Component {

  constructor (props) {
    super(props);
    this.styleSheet = null;
    this.state = {indiceEtapa: 0};
  }

  offsetEtapaTutorial = passo => {
    var novoIndice = this.state.indiceEtapa + passo;
    if (novoIndice >= this.props.itensTutorial.length) {
      this.setState({indiceEtapa: 0});
      this.props.dispatch({type: 'definir-item-tutorial', zerar: true});
    } else {
      this.setState({indiceEtapa: novoIndice});
    }
  }

  render() {
    if (this.props.itensTutorial.length === 0) return null;
    return (
      <div id='fundo-tutorial'>
          <button id='pular-tutorial' className='botao limpar-input' onClick={() => this.props.dispatch({type: 'bloquear-tutoriais'})}>Não Exibir Tutoriais</button>
          <EtapaTutorial {...this.props.itensTutorial[this.state.indiceEtapa]}/>
          <div id='rodape-tutorial'>
            <button className='botao neutro' onClick={() => this.offsetEtapaTutorial(-1)}
              style={this.state.indiceEtapa === 0 ? {visibility: 'hidden'} : null}>
              Anterior
            </button>
            <button className='botao neutro' onClick={() => this.offsetEtapaTutorial(1)}>
              {(this.state.indiceEtapa === this.props.itensTutorial.length-1) ? 'Concluir' : 'Próximo'}
            </button>
          </div>
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
