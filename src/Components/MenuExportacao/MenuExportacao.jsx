import React, { Component } from 'react';
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

const getChamada = () => new Date().getTime();

class MenuExportacao extends Component {

    constructor (props) {
        super(props);
        this.coordenadasBotao = [ 80, 3, 12, 89];
        this.coordenadasMedio = [ 73, 3, 12, 77]
        this.coordenadasMenu = [ 60, 3, 12, 70];
        this.state = {coordenadas: [...this.coordenadasBotao], 
            menuVisivel: false, 
            menuFormatos: false,
            posicaoArrow: null,
            chamada: getChamada()  
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
                        formatoExportacao={this.props.formatoExportacao}
                    />
                )
            })
    )

    getFormatos = () => (
        [ExportarHTML, ExportarPptx, ExportarPDF, ExportarOnline]
            .slice(0, this.state.posicaoArrow === 2 ? 4 : 3)
            .map((f, i) => {
                const BotaoFormato = f;
                return (
                    <BotaoFormato key={i} 
                                  definirFormatoExportacao={this.definirFormatoExportacao} 
                                  formatoExportacao={this.props.formatoExportacao}
                    />
                )
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

    definirMeioExportacao = (callbackMeio, posicaoArrow, meio) => {
        var posicao = posicaoArrow === this.state.posicaoArrow ? null : posicaoArrow
        if ((posicao !== null) !== (this.state.posicaoArrow !== null)) 
            this.abrirMenuFormatos(posicao);
        var timeout = (posicao !== null ? 100 : 20);
        setTimeout(() => this.setState({posicaoArrow: posicao}), timeout);
        var objState = {callbackMeio: this.state.callbackMeio === callbackMeio ? null : callbackMeio, meio: meio};
        if(this.props.formatoExportacao) objState.chamada = getChamada();
        this.setState(objState);
    }

    definirFormatoExportacao = (callbackFormato, formato, criarSlideFinal = false) => {
        this.setState({
            callbackFormato: callbackFormato, 
            criarSlideFinal: criarSlideFinal,
            chamada: getChamada(),
            formato: formato
        });
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
                <Exportador 
                    callbackMeio={this.state.callbackMeio} 
                    callbackFormato={this.state.callbackFormato} 
                    criarSlideFinal={this.state.criarSlideFinal} 
                    chamada={this.state.chamada}
                    meio={this.state.meio}
                    formato={this.state.formato}
                />
                <div style={{display: this.state.menuVisivel ? 'none' : '', marginBottom: '0.7vw'}}>Exportar Slides</div>
            </div>
        )
    }
}

export default MenuExportacao;