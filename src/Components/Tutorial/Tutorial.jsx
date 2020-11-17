import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Tutorial.css';
// import { getNomeInterfaceTipo } from '../../Element';
// import FaLongArrowAltRight from 'react-icons/fa';


const cssOpacidade = '{opacity: 0.3;} ';
const cssJoin = (css, selector = null) => css.join(selector ? ':not(' + selector + ')' : '');
const cssBotoes = ['#botoes-flutuantes-app > *', '{background-color: #c3cde5; box-shadow: 2px 2px 6px rgba(0,0,0,0.3);} '];
const cssOrganizador = ['#organizador > *', cssOpacidade];
const cssArrastar = [cssJoin(cssOrganizador, '.coluna-lista-slides') + '.coluna-lista-slides > *', cssOpacidade];
const cssOrdemElementos = [cssJoin(cssArrastar, '.carrossel') + '#ordem-elementos > *', cssOpacidade]

const listaBoxes = {
  painelAdicionar: [{texto: 'Clique para criar um elemento', coordenadas: [38, 3], css: cssJoin(cssBotoes) + cssJoin(cssArrastar, '.tampao-do-overflow'), arrow: {rotacao: 270, estiloOffset: {left: '6vw'}}}],
  arrastar: [
    {texto: 'As configurações do Slide-Mestre se aplicam aos demais slides', coordenadas: [4, 25], css: cssJoin(cssBotoes) + cssJoin(cssOrdemElementos, '#slide-mestre'), arrow: {rotacao: 180, estiloOffset: {}}},
    {texto: 'Arraste o elemento para reordenar a apresentação', coordenadas: [25, 25], css: cssJoin(cssBotoes) + cssJoin(cssArrastar, '.carrossel')},
    {texto: 'Clique para alterar as configurações/imagem de fundo do slide selecionado', coordenadas: [45, 45], css: cssJoin(cssBotoes, 'painel-configuracao') + cssJoin(cssOrganizador)},
    {texto: 'Clique para exportar a apresentação pronta', coordenadas: [60, 70], css: cssJoin(cssBotoes, 'menu-exportacao') + cssJoin(cssOrganizador) }
  ],
  galeriaFundos: [{texto: 'Passe o mouse sobre uma imagem para ver o fundo aplicado ao slide selecionado, ou clique para selecionar o fundo', coordenadas: [45, 15], css: cssJoin(cssBotoes, 'botao-mostrar-galeria') + cssJoin(cssOrganizador), arrow: {rotacao: 180, estiloOffset: {}}}],
  configuracoesSlide: [{texto: 'Selecione a aba para aplicar as configurações', coordenadas: [45, 15], css: cssJoin(cssBotoes, 'painel-configuracao') + cssJoin(cssOrganizador)}]
}

// export const keysBoxes = Object.keys(listaBoxes);

// const getNomeId = nome => getNomeInterfaceTipo(nome).toLowerCase().replace(' ', '-');

// const getNomeCamel = nome => nome.toLowerCase().replace(/-[a-z]/g, c => c.replace('-', '').toUpperCase());

class Tutorial extends Component {

  constructor (props) {
    super(props);
    this.styleSheet = null;
    this.state = {indiceEtapa: 0};
  }

  getComponenteEtapa = (indice = 0) => {
    var { texto, coordenadas, css } = this.props.itemTutorial[indice];
    console.log('getComponenteEtapa',this.styleSheet);

    this.removerCss();
    this.styleSheet = document.createElement("style");
    this.styleSheet.innerHTML = css;
    document.head.appendChild(this.styleSheet);
    console.log('getComponenteEtapaDepois', this.styleSheet);

    return (
      <div className='container-caixa-tutorial' style={{top: coordenadas[0] + 'vh', left: coordenadas[1] + 'vw'}}>
        <div className='caixa-tutorial'>
          {texto}
        </div>
      </div>
    )
  }

  offsetEtapaTutorial = passo => {
    this.removerCss();
    var novoIndice = this.state.indiceEtapa + passo;
    console.log('offsetEtapa', this.styleSheet);

    if (novoIndice >= this.props.itemTutorial.length) {
      this.definirElemento(null);
    } else {
      this.setState({indiceEtapa: novoIndice});
    }
    console.log('offsetEtapaFim', this.styleSheet);

  }

  definirElemento = elemento => {
    this.props.dispatch({type: 'definir-item-tutorial', itemTutorial: elemento})
  }

  removerCss = () => {
    console.log('removerCss', this.styleSheet);

    if (this.styleSheet) this.styleSheet.remove();
  }

  render() {
    if (!this.props.itemTutorial) return null;
    return (
      <div id='fundo-tutorial'>
          <button id='pular-tutorial' className='botao limpar-input' onClick={() => this.definirElemento(null)}>Pular Tutorial</button>
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
