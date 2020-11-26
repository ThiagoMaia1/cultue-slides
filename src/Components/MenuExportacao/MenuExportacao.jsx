import React, { Component } from 'react';
import { connect } from 'react-redux';
import './MenuExportacao.css';
import { toggleAnimacao } from '../Animacao/animacaoCoordenadas.js';
import Exportador from './Exportador';
import ExportarHTML from './ExportarHTML';
import ExportarPptx from './ExportarPptx';
import ExportarPDF from './ExportarPDF';
import ExportarOnline from './ExportarOnline';
import ExportarEmail from './ExportarEmail';
import ExportarLink from './ExportarLink';
import ExportarDownload from './ExportarDownload';

class MenuExportacao extends Component {

    constructor (props) {
        super(props);
        this.coordenadasBotao = [ 80, 3, 12, 89];
        this.coordenadasMedio = [ 73, 3, 12, 77]
        this.coordenadasMenu = [ 60, 3, 12, 70];
        this.state = {coordenadas: [...this.coordenadasBotao], 
            menuVisivel: false, 
            menuFormatos: false,
            posicaoArrow: null  
        };
    }

    getMeios = (tamIcones) => (
        [ExportarDownload, ExportarEmail, ExportarLink] 
            .map((m, i) => {
                const BotaoMeio = m;
                return (
                    <BotaoMeio 
                        tamIcones={tamIcones} 
                        definirMeioExportacao={this.definirMeioExportacao} 
                        posicaoArrow={this.state.posicaoArrow}
                        posicao={i}
                        key={i}
                    />
                )
            })
    )

    getFormatos = () => (
        [ExportarHTML, ExportarPptx, ExportarPDF, ExportarOnline]
            .slice(0, this.state.posicaoArrow === 2 ? 4 : 3)
            .map((f, i) => {
                const BotaoFormato = f;
                return <BotaoFormato key={i} definirCallback={this.definirCallback}/>
            })
    )

    abrirMenu = () => {
        toggleAnimacao(
            this.state.coordenadas,
            this.coordenadasBotao,
            this.coordenadasMedio,
            c => this.setState({coordenadas: c}),
            bool => {
                if (this.state.menuVisivel !== bool)
                    this.setState({menuVisivel: bool, menuFormatos: false, posicaoArrow: null, 
                                   callbackMeio: null, callbackFormato: null, callback: null})
            },
            c => c[3] < 84,
            1.72
        )
    }

    abrirMenuFormatos = () => {
        toggleAnimacao(
            this.state.coordenadas,
            this.coordenadasMenu,
            this.coordenadasMedio,
            c => this.setState({coordenadas: c}),
            bool => {
                if (this.state.menuFormatos !== bool)
                    this.setState({menuFormatos: bool})
            },
            c => c[0] < 67,
            0.4
        )
    }

    definirMeioExportacao = (callbackMeio, posicaoArrow) => {
        var posicao = posicaoArrow === this.state.posicaoArrow ? null : posicaoArrow
        var callback = this.state.callbackMeio ? null : callbackMeio;
        if ((posicao !== null) !== (this.state.posicaoArrow !== null)) 
            this.abrirMenuFormatos(posicao);
        var timeout = (posicao !== null ? 100 : 20);
        setTimeout(() => this.setState({posicaoArrow: posicao}), timeout);
        this.setState({callbackMeio: callback});
        this.definirCallbackFinal();
    }

    definirCallback = (callbackFormato, criarSlideFinal = false) => {
        this.setState({callbackFormato: callbackFormato, criarSlideFinal: criarSlideFinal});
        this.definirCallbackFinal();
    }

    definirCallbackFinal = () => {
        if (!this.state.callbackMeio || !this.state.callbackFormato) return;
        var callback = (copiaDOM, imagensBase64, previews, nomeArquivo) => {
            this.state.callbackMeio(this.state.callbackFormato(copiaDOM, imagensBase64, previews, nomeArquivo))
        }
        this.setState({callback: callback});
    }

    render() {
        var estiloDivOculta = {overflow: 'hidden', width: '1px', height: '1px'};
        var tamIcones = window.innerWidth*0.027 + 'px';
        return (
            <div id='menu-exportacao' className='botao-azul' onClick={this.abrirMenu}
                style={{top: this.state.coordenadas[0] + 'vh', right: this.state.coordenadas[1] + 'vw', 
                bottom: this.state.coordenadas[2] + 'vh', left: this.state.coordenadas[3] + 'vw',
                        pointerEvents: this.state.menuVisivel ? 'none' : 'all', background: this.state.menuVisivel ? 'var(--azul-forte)' : ''}}>
                <div className='colapsar-menu exportacao' style={{display: this.state.menuVisivel ? '' : 'none'}}
                    onClick={this.abrirMenu}>◢
                </div>
                <div id='opcoes-menu-exportacao' className='opcoes-menu-exportacao' 
                        style={this.state.menuVisivel ? null : estiloDivOculta} onClick={e => e.stopPropagation()}>
                    {this.getMeios(tamIcones)}
                    <div id='formatos-exportacao' className='opcoes-menu-exportacao' 
                            style={this.state.menuFormatos ? null : estiloDivOculta}>
                        {this.getFormatos()}
                    </div>
                </div>
                <Exportador callback={this.state.callback} criarSlideFinal={this.state.criarSlideFinal}/>
                <div style={{display: this.state.menuVisivel ? 'none' : '', marginBottom: '0.7vw'}}>Exportar Slides</div>
            </div>
        )
    }
}

const mapState = state => (
    {formatoExportacao: state.present.apresentacao.formatoExportacao}
)

export default connect(mapState)(MenuExportacao);