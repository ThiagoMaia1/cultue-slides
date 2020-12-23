import React, { Component } from 'react';
import { connect } from 'react-redux';
import ConfigurarSlides from './ConfigurarSlides';
import { toggleAnimacao } from '../Basicos/Animacao/animacaoCoordenadas.js';

class Configurar extends Component {

  constructor (props) {
    super(props);
    this.state = {};
    this.coordenadasBotao = [ 8, 3, 84, 89];
    this.coordenadasMenu = [ 8, 3, 84, 78];
    let coordenadas = [...this.coordenadasMenu];
    coordenadas[2] = 'auto';
    this.state = {aberto: 'hidden', coordenadas, menuVisivel: true, tamIcones: window.innerWidth*0.027 + 'px'};
  }

  abrirMenu = () => {
    this.props.dispatch({type: 'ativar-realce', abaAtiva: 'texto'});      
    var coor = this.state.coordenadas;
    coor[2] = this.coordenadasBotao[2];
    toggleAnimacao(
        coor,
        this.coordenadasBotao,
        this.coordenadasMenu,
        c => this.setState({coordenadas: [c[0], c[1], (c[3] <= this.coordenadasMenu[3]+10 ? 'auto' : c[2]), c[3]]}),
        bool => {
          if (this.state.menuVisivel !== bool)
              this.setState({menuVisivel: bool})
              setTimeout(() => this.props.dispatch({type: 'definir-item-tutorial', itemTutorial: 'configuracoesSlide'}), 10)
        },
        c => c[3] < 81
    )
  }

  componentDidUpdate = prevProps => {
    if(!this.state.menuVisivel && prevProps.tutorialAtivo !== this.props.tutorialAtivo) {
        this.abrirMenu();
    }
  }

	render() {
    if (this.props.autorizacao !== 'editar') return null;
    var estiloMenuVisivel = {};
    if (this.state.menuVisivel) {
      estiloMenuVisivel = {pointerEvents: 'none', background: 'var(--azul-forte)', paddingBottom: '2.5vh'}
    }
    var c = this.state.coordenadas;
    var estiloCoordenadas = {top: c[0] + 'vh', right: c[1] + 'vw', 
                             bottom: c[2] + (c[2] === 'auto' ? '' : 'vh'), left: c[3] + 'vw'}
		return (
      <div id='botao-menu-configurar' className='botao-azul' onClick={this.abrirMenu}
              style={{...estiloCoordenadas, ...estiloMenuVisivel}}>
            <div style={{display: this.state.menuVisivel ? '' : 'none'}}> 
              <div className='colapsar-menu configurar' onClick={this.abrirMenu}>◥</div>
              <div className='menu-configuracoes' 
                  onClick={e => e.stopPropagation()}>
                    <ConfigurarSlides />
              </div>
            </div>
            <div style={{display: this.state.menuVisivel ? 'none' : ''}} className='div-titulo-botao'>
              Configurar Estilo
            </div>
      </div>
    )   
	}
}

const mapState = function (state) {
  var sP = state.present;
  return {
    elementos: sP.elementos,
    autorizacao: sP.apresentacao.autorizacao,
    tutorialAtivo: state.itensTutorial.includes('configuracoesSlide')
  };
}

export default connect(mapState)(Configurar);