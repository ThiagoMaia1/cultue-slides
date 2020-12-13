import React, { Component } from 'react';
import './MenuExportacao.css';
// import { toggleAnimacao } from '../Animacao/animacaoCoordenadas.js';
import Exportador from './Exportador';
import ExportarHTML from './Botoes/Formatos/ExportarHTML';
import ExportarPptx from './Botoes/Formatos/ExportarPptx';
import ExportarPDF from './Botoes/Formatos/ExportarPDF';
import ExportarOnline from './Botoes/Formatos/ExportarOnline';
import ExportarEmail from './Botoes/Meios/ExportarEmail';
import ExportarLink from './Botoes/Meios/ExportarLink';
import ExportarDownload from './Botoes/Meios/ExportarDownload';

const getChamada = () => new Date().getTime();

const getMaxTamanho = (width, height) => ({maxTamanho: {maxWidth: width, maxHeight: height}});

const tamBotao = 8;

class MenuExportacao extends Component {
    
    constructor (props) {
        super(props);
        this.estiloDivOculta = {overflow: 'hidden', maxWidth: '0.01px', maxHeight: '0.01px', margin: 0};
        this.state = {
            menuVisivel: false, 
            menuFormatos: false,
            posicaoArrow: null,
            chamada: getChamada(),
            ...getMaxTamanho(tamBotao, tamBotao)
        };
    }

    setMaxTamanho = (width, height) => {
        this.setState(getMaxTamanho(width, height));
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
            .map((f, i) => {
                const BotaoFormato = f;
                return (
                    <BotaoFormato key={i} 
                                  definirFormatoExportacao={this.definirFormatoExportacao} 
                                  formatoExportacao={this.props.formatoExportacao}
                                  style={this.state.posicaoArrow === 2 && i === 3 ? {maxWidth: '100vw'} : this.estiloDivOculta}
                    />
                )
            })
    )

    abrirMenu = bool => {
        if (this.state.menuVisivel !== bool)
            this.setState({menuVisivel: bool, menuFormatos: false, posicaoArrow: null, 
                           callbackMeio: null, callbackFormato: null, callback: null})
        this.setMaxTamanho(bool ? 20 : tamBotao, bool ? 15 : tamBotao)
    }

    abrirMenuFormatos = posicao => {
        var bool = posicao !== null;
        if (this.state.menuFormatos !== bool)
            this.setState({menuFormatos: bool})
        this.setMaxTamanho(bool ? (posicao === 2 ? 27 : 23) : 20, bool ? 32 : 15)
    }

    definirMeioExportacao = (callbackMeio, posicaoArrow, meio) => {
        var posicao = posicaoArrow === this.state.posicaoArrow ? null : posicaoArrow
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
        var tamIcones = window.innerWidth*0.027 + 'px';
        var maxTamanho = {maxWidth: this.state.maxTamanho.maxWidth + 'vw', maxHeight: this.state.maxTamanho.maxHeight + 'vh'}
        return (
            <div id='menu-exportacao' className='botao-azul' onClick={() => this.abrirMenu(true)}
                style={{right: '3vw', bottom: '12vh',
                        ...maxTamanho,
                        pointerEvents: this.state.menuVisivel ? 'none' : 'all', background: this.state.menuVisivel ? 'var(--azul-forte)' : ''}}>
                <div className='colapsar-menu exportacao' style={{display: this.state.menuVisivel ? '' : 'none'}}
                    onClick={e => {
                        e.stopPropagation();
                        this.abrirMenu(false)
                    }}>
                    ◢
                </div>
                <div id='opcoes-menu-exportacao' 
                        style={this.state.menuVisivel ? maxTamanho : this.estiloDivOculta} onClick={e => e.stopPropagation()}>
                    <div id='meios-exportacao'>
                        {this.getMeios(tamIcones)}
                    </div>
                    <div id='formatos-exportacao'
                            style={this.state.menuFormatos ? maxTamanho : this.estiloDivOculta}>
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
                <div id='rotulo-exportar' style={this.state.menuVisivel ? {maxWidth: 0, maxHeight: 0} : {maxWidth: '8vw', maxHeight: '8vh'}}>Exportar Slides</div>
            </div>
        )
    }
}

export default MenuExportacao;