import React, { Component } from 'react';
import store from '../../../../index';
import '../LetrasMusica/style.css';
import './style.css';
import Carrossel from '../../../Basicos/Carrossel/Carrossel';
import { uploadImagem } from './imagemFirebase';
import ImagemGaleriaInput from './ImagemGaleriaInput';

const dMaxTracejado = 99;
const dMinTracejado = 93;

const substituirImagem = (selecionado, url, objeto) => 
    store.dispatch({type: 'editar-slide-temporariamente', objeto, valor: { src: url }, selecionado});

const callbackUpload = (idUpload, urlDownload, eFundo = false) => {
    atualizarImagensUsuario(eFundo ? 'fundos' : 'gerais', urlDownload);
    const elementos = store.getState().present.elementos;
    for (var i = 0; i < elementos.length; i++) {
        const slides = elementos[i].slides;
        for (var j = 0; j < slides.length; j++) {
            var sel = {elemento: i, slide: j};
            if (slides[j].estilo.fundo.idUpload === idUpload) 
                substituirImagem(sel, urlDownload, 'fundo');
            if (slides[j].imagem && slides[j].imagem.idUpload === idUpload)
                substituirImagem(sel, urlDownload, 'srcImagem');
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

const atualizarImagensUsuario = (subconjunto, url) => {
    let imagens = {...store.getState().usuario.imagens} || {};
    imagens[subconjunto] = [...(imagens[subconjunto] || []), url];
    store.dispatch({type: 'atualizar-colecao-imagens-usuario', imagens});
}

class InputImagem extends Component {
    
    constructor (props) {
        super(props);
        this.refInputFile = React.createRef();
        this.aumentando = true;
        this.state = {
            imagens: [], 
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

    onDrop = () => {
        clearInterval(this.animacao);
        this.animacao = null;
        this.setState({estiloCaixa: {...this.getTamanhoTracejado(), opacity: '0'}});
        this.aumentando = true;
    }

    adicionarImagem = e => {
        let img = e.target;
        this.setState({imagens: [...this.state.imagens, img]});
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
            imagem.onload = this.adicionarImagem;
            imagem.nomeComExtensao = img.name;
            var n = imagem.nomeComExtensao;

            for (var i = n.length-1; i >= 0; i--) {
                if (n[i] === '.') {
                    n = n.slice(0, i);
                    break;
                }
            }
            
            let eReedicao = img.eLinkFirebase || img.idUpload;
            imagem.contador = this.state.imagens.reduce(getReduce(n), -1) + 1;
            imagem.alt = n;
            imagem.arquivo = img;
            imagem.eLinkFirebase = eReedicao;
            imagem.src = eReedicao ? img.src : url.createObjectURL(img);
        }
        this.refInputFile.current.value = '';        
    }
    
    apagarImagem = indice => {
        this.setState({imagens: this.state.imagens.filter((_img, i) => i !== indice)});
    }

    gerarListaImagens = () => {
        var imgs = this.state.imagens;
        if (imgs.length === 0) return;
        if (imgs.length === 1 && !imgs[0].width) 
            return (<div className='texto-arquivo-invalido'>Arquivo Inválido: "{imgs[0].alt}"</div>);
        return (
            <div className='container-imagens-previa-upload'>
                {imgs.map((img, i) => 
                    <ImagemGaleriaInput key={img.alt + '-' + img.contador} 
                                 img={img} 
                                 indice={i} 
                                 apagar={this.apagarImagem} 
                                 nFiles={this.nFiles}
                                 setFinalCarrossel={() => this.setState({finalCarrossel: new Date().getTime()})}
                    />)
                }
            </div>
        )
    }

    limparInputs = () => {
        this.setState({imagens: []});
    }
    
    ativarSetas = () => this.setState({pointerEvents: 'all'}); 

    clicarInput = () => {
        if(this.refInputFile.current) this.refInputFile.current.click();
    }

    upload = () => {
        var imgsFiltradas = this.state.imagens.filter(i => i.width);

        imgsFiltradas = imgsFiltradas.map(i => {
            if (!i.eLinkFirebase) {
                i.idUpload = uploadImagem(i.arquivo, (idUpload, urlUpload) => {
                    callbackUpload(idUpload, urlUpload, this.props.eFundo);
                    if(this.props.callbackUpload) this.props.callbackUpload(idUpload, urlUpload);
                });
            }
            return i;
        })
        this.props.callback(imgsFiltradas);
    }

    componentDidMount = () => {
        if(this.props.imagens) {
            this.validarImagens(this.props.imagens.map(i => ({
                ...i, 
                name: this.props.titulo || '',
                eLinkFirebase: true
            })));
        }
    }

    render () {
        let nValidos = this.state.imagens.filter(i => !!i.width).length;
        let nInvalidos = this.state.imagens.length - nValidos;
        return (
            <>
                <div className='combo-popup caixa-input-imagem' 
                    onDragOver={this.onDragOver} 
                    onDrop={this.onDrop}
                    onDragLeave={this.onDrop} 
                    onMouseOver={this.ativarSetas}>
                    <div className='container-carrossel' style={{pointerEvents: this.state.pointerEvents}} onClick={this.clicarInput} onDragOver={() => this.setState({pointerEvents: 'none'})}>
                        <Carrossel tamanhoIcone={45} tamanhoMaximo='100%' direcao='vertical' style={{zIndex: '400', width: '100%'}} beiradaFinal={15} 
                                   final={this.state.finalCarrossel}>
                            <div className='file-input-container' >
                                <div className='container-texto-input-file'>
                                    <div className='texto-auxiliar' onClick={() => this.refInputFile.current.click()}>Arraste uma imagem, ou clique para selecionar o arquivo.</div>
                                    {this.gerarListaImagens()}
                                </div>
                            </div>
                        </Carrossel>
                    </div>
                    <input ref={this.refInputFile} id="adicionar-imagem" className='combo-popup' type='file' multiple="multiple" accept="image/*" 
                            onChange={e => this.validarImagens(e.target.files)}/>
                    <div className='animacao-drag-over'>
                        <div className='tracejado-animacao rotating-border' style={this.state.estiloCaixa}></div>
                    </div>
                </div>
                <div className='container-botoes-popup' style={!this.state.imagens.length ? {visibility: 'hidden'} : null}>
                    {nValidos 
                        ? <button className='botao' onClick={this.upload}>
                            {'Inserir Image' + (nInvalidos ? 'ns Válidas' : nValidos > 1 ? 'ns' : 'm')}
                            </button>
                        : null
                    }
                    <button className='botao limpar-input' onClick={this.limparInputs}>✕ Limpar</button>
                </div>
            </>
        )
    }
}

export default InputImagem;