import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Tutorial.css';
// import { getNomeInterfaceTipo } from '../../Element';
import { FaLongArrowAltRight } from 'react-icons/fa';


const cssOpacidade = '{opacity: 0.2;} ';
const cssJoin = (css, selector = null) => css.join(selector ? ':not(' + selector + ')' : '');
const cssBotoes = ['#botoes-flutuantes-app > *', '{background-color: #d0d9ec; box-shadow: 2px 2px 6px rgba(0,0,0,0.3);} '];
const cssOrganizador = ['#organizador > *', cssOpacidade];
const cssArrastar = [cssJoin(cssOrganizador, '.coluna-lista-slides') + '.coluna-lista-slides > *', cssOpacidade];
const cssOrdemElementos = [cssJoin(cssArrastar, '.carrossel') + '#ordem-elementos > *', cssOpacidade]

const listaBoxes = {
  painelAdicionar: [{
    texto: 'Clique para criar um elemento', 
    coordenadas: [43, 18], 
    css: cssJoin(cssBotoes) + cssJoin(cssArrastar, '.tampao-do-overflow'), 
    arrow: {rotacao: 270, posicao: {top: '-8vh', left: '-10vw'}}
  }],
  slides: [
    {texto: 'As configurações do Slide-Mestre se aplicam aos demais slides', 
     coordenadas: [15, 25], 
     css: cssJoin(cssBotoes) + cssJoin(cssOrdemElementos, '#slide-mestre'), 
     arrow: {rotacao: 180, posicao: {top: '-19vh'}}},
    {texto: 'Clique para alterar as configurações e a imagem de fundo do slide selecionado', 
     coordenadas: [40, 40], 
     css: cssJoin(cssBotoes, '#botao-menu-configurar):not(#botao-mostrar-galeria') + cssJoin(cssOrganizador)},
    {texto: 'Clique para ver a prévia da apresentação em tela cheia', 
     coordenadas: [60, 51.5], 
     css: cssJoin(cssBotoes, '#botao-menu-configurar):not(#botao-mostrar-galeria') + cssJoin(cssOrganizador, '.borda-slide-mestre'),
     arrow: {rotacao: 270, posicao: {top: '-3vh', left: '14vw'}}}
  ],
  arrastar: [
    {texto: 'Clique no slide, ou utilize as setas para navegar', 
     coordenadas: [23, 25], 
     css: cssJoin(cssBotoes) + cssJoin(cssArrastar, '.carrossel'), 
     arrow: {rotacao: 180, posicao: {top: '-18vh', left: ''}}},
    {texto: 'Arraste os elementos para reordenar a apresentação', 
     coordenadas: [23, 25], 
     css: cssJoin(cssBotoes) + cssJoin(cssArrastar, '.carrossel'), 
     arrow: {rotacao: 180, posicao: {top: '-18vh', left: ''}}},
    {texto: 'Ao concluir, clique para exportar a apresentação pronta', 
     coordenadas: [59, 74], 
     css: cssJoin(cssBotoes, '#menu-exportacao') + cssJoin(cssOrganizador), 
     arrow: {rotacao: 0, posicao: {top: '8vh', left: '2vw'}}
  }],
  galeriaFundos: [{
    texto: 'Passe o mouse sobre uma imagem para ver o fundo aplicado ao slide selecionado, ou clique para selecionar o fundo', 
    coordenadas: [45, 45], 
    css: cssJoin(cssBotoes, '#botao-mostrar-galeria') + cssJoin(cssOrganizador)
  }],
  configuracoesSlide: [{
    texto: 'Selecione a aba para aplicar as configurações', 
    coordenadas: [15, 60], 
    css: cssJoin(cssBotoes, '#botao-menu-configurar') + cssJoin(cssOrganizador), 
    arrow: {rotacao: 0, posicao: {top: '-18.5vh', left: '5vw'}}
  }]
}

export const keysTutoriais = Object.keys(listaBoxes);

// const getNomeId = nome => getNomeInterfaceTipo(nome).toLowerCase().replace(' ', '-');

// const getNomeCamel = nome => nome.toLowerCase().replace(/-[a-z]/g, c => c.replace('-', '').toUpperCase());

class Tutorial extends Component {

  constructor (props) {
    super(props);
    this.styleSheet = null;
    this.state = {indiceEtapa: 0};
  }

  getComponenteEtapa = (indice = 0) => {
    var { texto, coordenadas, css, arrow } = this.props.itemTutorial[indice];
    // console.log('getComponenteEtapa',this.styleSheet);

    this.removerCss();
    this.styleSheet = document.createElement("style");
    this.styleSheet.innerHTML = css;
    document.head.appendChild(this.styleSheet);
    // console.log('getComponenteEtapaDepois', this.styleSheet);

    return (
      <div className='container-caixa-tutorial' style={{top: coordenadas[0] + 'vh', left: coordenadas[1] + 'vw'}}>
        {arrow 
          ? <div className='arrow' style={{transform: 'rotate(' + arrow.rotacao + 'deg)', ...arrow.posicao}}>
              <FaLongArrowAltRight size={150}/>
            </div>
          : null
        }
        <div className='caixa-tutorial'>
          {texto}
        </div>
      </div>
    )
  }

  offsetEtapaTutorial = passo => {
    this.removerCss();
    var novoIndice = this.state.indiceEtapa + passo;
    // console.log('offsetEtapa', this.styleSheet);

    if (novoIndice >= this.props.itemTutorial.length) {
      this.definirElemento(null);
    } else {
      this.setState({indiceEtapa: novoIndice});
    }
    // console.log('offsetEtapaFim', this.styleSheet);

  }

  definirElemento = elemento => {
    this.setState({indiceEtapa: 0});
    this.props.dispatch({type: 'definir-item-tutorial', itemTutorial: elemento});
  }

  removerCss = () => {
    // console.log('removerCss', this.styleSheet);

    if (this.styleSheet) this.styleSheet.remove();
  }

  render() {
    if (!this.props.itemTutorial) return null;
    return (
      <div id='fundo-tutorial'>
          <button id='pular-tutorial' className='botao limpar-input' onClick={() => this.props.dispatch({type: 'bloquear-tutoriais'})}>Não Exibir Tutoriais</button>
          {this.getComponenteEtapa(this.state.indiceEtapa)}
          <div id='rodape-tutorial'>
            <button className='botao neutro' onClick={() => this.offsetEtapaTutorial(-1)}
              style={this.state.indiceEtapa === 0 ? {visibility: 'hidden'} : null}>
              Anterior
            </button>
            <button className='botao neutro' onClick={() => this.offsetEtapaTutorial(1)}>
              {(this.state.indiceEtapa === this.props.itemTutorial.length-1) ? 'Concluir' : 'Próximo'}
            </button>
          </div>
      </div>
    );
  }
}

const mapState = state => (
  {itemTutorial: listaBoxes[state.itemTutorial]}
)

export default connect(mapState)(Tutorial);
