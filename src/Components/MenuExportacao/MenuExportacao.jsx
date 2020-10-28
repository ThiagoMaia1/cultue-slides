import React, { Component } from 'react';
import './MenuExportacao.css';
// import { connect } from 'react-redux';
import { toggleAnimacao } from '../Animacao/animacaoCoordenadas.js';
import { BsLink45Deg } from 'react-icons/bs';
import { IoMdMail } from 'react-icons/io';
import ExportadorHTML from '../../ExportadorHTML';

class MenuExportacao extends Component {

    constructor (props) {
        super(props);
        this.coordenadasBotao = [ 80, 3, 12, 89];
        this.coordenadasMenu = [ 62, 3, 12, 78];
        this.state = {coordenadas: [...this.coordenadasBotao], menuVisivel: false, tamIcones: window.innerWidth*0.027 + 'px'};
    }

    abrirMenu = () => {
        toggleAnimacao(
            this.state.coordenadas,
            this.coordenadasBotao,
            this.coordenadasMenu,
            c => this.setState({coordenadas: c}),
            bool => {
                if (this.state.menuVisivel !== bool)
                    this.setState({menuVisivel: bool})
            },
            c => c[0] < 70,
            1.72
        )
    }

    render() {
        return (
            <div id='menu-exportacao' className='botao-azul' onClick={this.abrirMenu}
                 style={{top: this.state.coordenadas[0] + 'vh', right: this.state.coordenadas[1] + 'vw', bottom: this.state.coordenadas[2] + 'vh', left: this.state.coordenadas[3] + 'vw',
                        pointerEvents: this.state.menuVisivel ? 'none' : 'all', background: this.state.menuVisivel ? 'var(--azul-forte)' : ''}}>
                <div className='colapsar-menu exportacao' style={{display: this.state.menuVisivel ? '' : 'none'}}
                    onClick={this.abrirMenu}>◢
                </div>
                <div id='opcoes-menu-exportacao' style={{display: this.state.menuVisivel ? '' : 'none'}} onClick={e => e.stopPropagation()}>
                    <ExportadorHTML/>
                    <div className='div-botao-exportar'> 
                            <div className='container-logo-pptx'>
                                <img id='logo-pptx' className='logo-exportacao' src={require('./Logos/Logo PowerPoint.png')} alt='Logo PowerPoint'/>
                                <button id='exportar-pptx' className='botao-exportar sombrear-selecao'/>
                            </div>
                        <div className='rotulo-botao-exportar'>PowerPoint</div>
                    </div>
                    <div className='div-botao-exportar'> 
                        <button id='exportar-pdf' className='botao-exportar sombrear-selecao'>
                            <img id='logo-pdf' src={require('./Logos/Logo PDF.png')} alt='Logo PDF'></img>
                        </button>
                        <div className='rotulo-botao-exportar'>PDF</div>
                    </div>
                    <div className='div-botao-exportar'> 
                        <button id='exportar-email' className='botao-exportar sombrear-selecao'>
                            <IoMdMail size={this.state.tamIcones}/>
                        </button>
                        <div className='rotulo-botao-exportar'>E-mail</div>
                    </div>
                    <div className='div-botao-exportar'> 
                        <button id='exportar-link' className='botao-exportar sombrear-selecao'>
                            <BsLink45Deg size={this.state.tamIcones}/>
                        </button>
                        <div className='rotulo-botao-exportar'>Link</div>
                    </div>
                </div>
                <div style={{display: this.state.menuVisivel ? 'none' : ''}}>Exportar Slides</div>
            </div>
        )
    }
}

export default MenuExportacao;