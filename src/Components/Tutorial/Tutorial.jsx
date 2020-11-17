import React, { Component } from 'react';
import './Tutorial.css';

const listaBoxes = {
  criarElemento: {texto: 'Clique para criar um elemento', coordenadas: [38, 3], arrow: {rotacao: 270, estiloOffset: {left: '6vw'}}},
  slideMestre: {texto: 'As configurações do Slide-Mestre se aplicam aos demais slides', coordenadas: [4, 25], arrow: {rotacao: 180, estiloOffset: {}}},
  configuracoesSlide: {texto: 'Clique para alterar as configurações do slide selecionado', coordenadas: [0, 78], arrow: {rotacao: 360, estiloOffset: {}}},
  reordenarSlides: {texto: 'Arraste o elemento para reordenar a apresentação', coordenadas: [25, 25], arrow: {rotacao: 180, estiloOffset: {}}},
  galeriaFundos: {texto: 'Passe o mouse sobre uma imagem para ver o fundo aplicado ao slide selecionado, ou clique para selecionar o fundo', coordenadas: [45, 15], arrow: {rotacao: 135, estiloOffset: {}}},
  exportarApresentacao: {texto: 'Clique para exportar a apresentação pronta', coordenadas: [60, 70], arrow: {rotacao: 45, estiloOffset: {}}}
}

const keysBoxes = Object.keys(listaBoxes);

class Tutorial extends Component {

  constructor (props) {
    super(props);
    this.state = {indiceEtapa: 0};
  }

  getComponenteEtapa = indice => {
    var { texto, coordenadas, arrow } = listaBoxes[keysBoxes[indice]];
    var htmlArrow = arrow 
      ? <div className='container-arrow' style={{ transform: 'rotate(' + (arrow.rotacao + -45) + 'deg)', ...arrow.estiloOffset}}>
          <i className='arrow'></i>
        </div>
      : null;
    var arrowAcima;
    if (arrow) arrowAcima = arrow.rotacao >= 180;
    return (
      <div className='container-caixa-tutorial' style={{top: coordenadas[0] + 'vh', left: coordenadas[1] + 'vw'}}>
        {arrowAcima ? htmlArrow : null
        }
        <div className='caixa-tutorial'>
          {texto}
        </div>
        {!arrowAcima ? htmlArrow : null}
      </div>
    )
  }

  offsetEtapaTutorial = passo => {
    var novoIndice = this.state.indiceEtapa + passo;
    if (novoIndice >= keysBoxes.length)
      this.props.concluirTutorial();
    this.setState({indiceEtapa: novoIndice});
  }

  render() {
    return (
      <div id='fundo-tutorial'>
          <button id='pular-tutorial' className='botao limpar-input' onClick={this.props.concluirTutorial}>Pular Tutorial</button>
          {this.getComponenteEtapa(this.state.indiceEtapa)}
          <div id='rodape-tutorial'>
                <button className='botao neutro' onClick={() => this.offsetEtapa(-1)}>Anterior</button>
                  <button className='botao neutro' onClick={() => this.offsetEtapa(1)}>Próximo</button>
          </div>
      </div>
    );
  }
}

export default Tutorial;
