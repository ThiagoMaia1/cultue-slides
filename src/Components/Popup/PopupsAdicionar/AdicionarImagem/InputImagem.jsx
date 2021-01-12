import React, { Component } from 'react';
import { connect } from 'react-redux';
import store from '../../../../index';
import '../LetrasMusica/style.css';
import './style.css';
import { uploadImagem } from '../../../../principais/firestore/imagemFirebase';
import GaleriaUsuario from './GaleriaUsuario';
import GaleriaImagensPopup from './GaleriaImagensPopup';

const dMaxTracejado = 97;
const dMinTracejado = 91;

const substituirImagem = (selecionado, src, objeto) =>
    store.dispatch({type: 'editar-slide-temporariamente', objeto, valor: {src}, selecionado});

const callbackUpload = (idUpload, urlDownload, eFundo = false) => {
    if (urlDownload) adicionarImagemColecaoUsuario(eFundo ? 'fundos' : 'gerais', urlDownload);
    const elementos = store.getState().present.elementos;
    for (var i = 0; i < elementos.length; i++) {
        const slides = elementos[i].slides;
        for (var j = 0; j < slides.length; j++) {
            var sel = {elemento: i, slide: j};
            
            let { fundo } = slides[j].estilo;
            if (fundo.idUpload === idUpload)  
                substituirImagem(sel, urlDownload || fundo.src, 'fundo');
            
            let { imagem } = slides[j];
            if (imagem && imagem.idUpload === idUpload)
                substituirImagem(sel, urlDownload || imagem.src, 'srcImagem');
        }
        atualizarArrayInput2(elementos[i], i, idUpload, urlDownload);
    }
}

function atualizarArrayInput2(elemento, i, idUpload, src) {
    const input2 = elemento.input2;
    if (input2 && input2.length) {
        let inputAtualizado = [];
        for (var p of input2) {
            let novoInput = {
                ...(p.idUpload === idUpload ? {src, eLinkFirebase: true} : {})
            }
            inputAtualizado.push(novoInput);
        }
        store.dispatch({ type: 'editar-slide-temporariamente', objeto: 'input2', valor: inputAtualizado, selecionado: { elemento: i, slide: 0 } });
    }
}

const adicionarImagemColecaoUsuario = (subconjunto, urls) => {
    store.dispatch({type: 'alterar-imagem-colecao-usuario', subconjunto, urls});
}

class InputImagem extends Component {
    
    constructor (props) {
        super(props);
        this.refInputFile = React.createRef();
        this.aumentando = true;
        let imagens = props.imagens || [];
        this.state = {
            imagens: imagens.map(({src}, i) => ({
                src, 
                alt: (props.titulo || '') + i,
                eLinkFirebase: true
            })), 
            estiloCaixa: {opacity: '0', ...this.getTamanhoTracejado()}, 
            pointerEvents: 'none'
        };
    }

    getTamanhoTracejado = (porcentagem = dMaxTracejado) => (
        {width: porcentagem + '%', height: porcentagem + '%'}
    )

    inverterTracejado = () => {
        var dTracejado = dMaxTracejado;
        this.aumentando = !this.aumentando;
        if (!this.aumentando) dTracejado = dMinTracejado;
        this.setState({estiloCaixa: {opacity: '1', ...this.getTamanhoTracejado(dTracejado)}})
    }

    onDragOver = () => {
        this.setState({pointerEvents: 'none'});
        if (this.animacao) return;
        this.inverterTracejado();
        this.animacao = setInterval(this.inverterTracejado, 801);
    }

    onDrop = e => {
        console.log(e.target);
        clearInterval(this.animacao);
        this.animacao = null;
        this.setState({estiloCaixa: {...this.getTamanhoTracejado(), opacity: '0'}});
        this.aumentando = true;
    }

    onLoadImagem = e => {
        let img = e.target;
        this.adicionarImagem(img);
    }

    validarImagens(inputImagens){
        if(this.state.imagens.length === 1 && !this.state.imagens[0].width) this.limparInputs();
        var url = window.URL || window.webkitURL;
        this.nFiles = inputImagens.length;
    
        const getReduce = (n) => (contador, i) => {
            if(i.alt === n) contador = Math.max(contador, i.contador);
            return contador;
        }

        for (var img of inputImagens) {
            var imagem = new Image();   
            imagem.crossOrigin = 'Anonymous';
            imagem.onload = this.onLoadImagem;
            imagem.nomeComExtensao = img.name;
            var n = imagem.nomeComExtensao;

            for (var i = n.length-1; i >= 0; i--) {
                if (n[i] === '.') {
                    n = n.slice(0, i);
                    break;
                }
            }
            
            imagem.contador = this.state.imagens.reduce(getReduce(n), -1) + 1;
            imagem.alt = n;
            imagem.altContador = imagem.alt + (imagem.contador ? '-' + imagem.contador : '');
            imagem.arquivo = img;
            imagem.src = url.createObjectURL(img);
        }
        this.refInputFile.current.value = '';        
    }
    
    adicionarImagem = img => this.setState({imagens: [...this.state.imagens, img]});

    apagarImagem = indice => this.setState({imagens: this.state.imagens.filter((_img, i) => i !== indice)});

    limparInputs = () => this.setState({imagens: []});
    
    clicarInput = () => {
        if(this.refInputFile.current) this.refInputFile.current.click();
    }

    eImagemValida = img => !!img.width || img.eLinkFirebase;

    callbackImagensValidas = () => {
        let imgsFiltradas = this.state.imagens.filter(this.eImagemValida);
        imgsFiltradas = imgsFiltradas.map(i => {
            if (!i.eLinkFirebase) this.upload(i);
            return i;
        });
        this.props.callback(imgsFiltradas);
    }

    upload = img => {
        let metadados = {
            name: img.altContador
        };
        img.idUpload = uploadImagem(img.arquivo, metadados, (idUpload, urlUpload) => {
            callbackUpload(idUpload, urlUpload, this.props.eFundo);
        });
        return img
    };

    render () {
        let { imagens } = this.state;
        let nValidos = imagens.filter(this.eImagemValida).length;
        let nInvalidos = imagens.length - nValidos;
        let visibilidadeBotao = !imagens.length ? {visibility: 'hidden'} : null;
        return (
            <>
                <div className='caixa-input-imagem'
                    onDragOver={this.onDragOver} 
                    onDrop={this.onDrop}
                    onDragLeave={this.onDrop} 
                    onMouseOver={() => this.setState({pointerEvents: 'all'})}>
                    <GaleriaImagensPopup imagens={imagens} 
                                        onClickGaleria={this.clicarInput} 
                                        apagar={this.apagarImagem} 
                                        textoPlaceholder='Arraste uma imagem, ou clique para selecionar o arquivo.'
                                        pointerEvents={this.state.pointerEvents}/>
                    <input ref={this.refInputFile} id="adicionar-imagem" className='combo-popup' type='file' multiple="multiple" accept="image/*" 
                            onChange={e => this.validarImagens(e.target.files)}/>
                    <div className='animacao-drag-over'>
                        <div className='tracejado-animacao rotating-border' style={this.state.estiloCaixa}></div>
                    </div>
                </div>
                <div className='container-botoes-popup'>
                    <button className='botao' onClick={this.callbackImagensValidas} style={nValidos ?  visibilidadeBotao : {visibility: 'hidden'}}>
                        {'Inserir Image' + (nInvalidos ? 'ns Válidas' : nValidos > 1 ? 'ns' : 'm')}
                    </button>
                    {!this.props.usuario.uid ? null :
                        <button className='botao neutro' onClick={() => this.setState({galeriaUsuarioAtiva: true})}>Minhas Imagens</button>
                    }
                    <button className='botao limpar-input' onClick={this.limparInputs} style={visibilidadeBotao}>✕ Limpar</button>
                </div>
                {!this.state.galeriaUsuarioAtiva ? null :
                    <GaleriaUsuario callback={this.adicionarImagem} 
                                    fecharPopup={() => this.setState({galeriaUsuarioAtiva: false})}
                                    subconjunto={this.props.eFundo ? 'gerais' : null}/>
                }
            </>
        )
    }
}

const mapState = state => ({
    usuario: state.usuario
});

export default connect(mapState)(InputImagem);