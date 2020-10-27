import React, { Component } from 'react';
import { connect } from 'react-redux';
import ConfigurarSlides from './ConfigurarSlides';
import { toggleAnimacao } from '../Animacao/animacaoCoordenadas.js';

class Configurar extends Component {

  constructor (props) {
    super(props);
    this.state = {};
    this.coordenadasBotao = [ 3, 3, 89, 89];
    this.coordenadasMenu = [ 3, 3, 89, 75];
    this.state = {aberto: 'hidden', coordenadas: [...this.coordenadasBotao], menuVisivel: false, tamIcones: window.innerWidth*0.027 + 'px'};
  }

  abrirMenu = () => {
    var coor = this.state.coordenadas;
    coor[2] = this.coordenadasBotao[2];
    toggleAnimacao(
        coor,
        this.coordenadasBotao,
        this.coordenadasMenu,
        c => this.setState({coordenadas: [c[0], c[1], (c[1] === this.coordenadasMenu[1] ? 'auto' : c[2]), c[3]]}),
        bool => {
            if (this.state.menuVisivel !== bool)
                this.setState({menuVisivel: bool})
        },
        c => c[3] < 80
    )
}

	render() {
		return (
      <div id='botao-menu-configurar' className='botao-azul' onClick={this.abrirMenu}
              style={{top: this.state.coordenadas[0] + 'vh', right: this.state.coordenadas[1] + 'vw', 
                      bottom: this.state.coordenadas[2] + (this.state.coordenadas[2] === 'auto' ? '' : 'vh'), 
                      left: this.state.coordenadas[3] + 'vw',
                    pointerEvents: this.state.menuVisivel ? 'none' : 'all', background: this.state.menuVisivel ? 'var(--azul-forte)' : '',
                    paddingBottom: this.state.menuVisivel ? '2.5vh' : ''}}>
            <div className='colapsar-menu configurar' 
                 onClick={this.abrirMenu} 
                 style={{display: this.state.menuVisivel ? '' : 'none'}}>◥
            </div>
            <div style={{display: this.state.menuVisivel ? '' : 'none'}} 
                 className='menu-configuracoes' 
                 onClick={e => e.stopPropagation()} c>
                   <ConfigurarSlides />
            </div>
            <div style={{display: this.state.menuVisivel ? 'none' : ''}} className='div-titulo-botao'>
              Configurar Estilo
            </div>
      </div>
    )   
	}
}

const mapStateToProps = function (state) {
  state = state.present;
  return {elementos: state.elementos};
}

export default connect(mapStateToProps)(Configurar);