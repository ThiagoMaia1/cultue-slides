import React, { Component } from 'react';
import '../LetrasMusica/style.css';
import './style.css';
import { connect } from 'react-redux';
import Carrossel from '../../../Basicos/Carrossel/Carrossel';
import { getImgBase64 } from '../../../../principais/FuncoesGerais';
import { uploadImagem } from './imagemFirebase';
import { store } from '../../../../index';

const dMaxTracejado = 99;
const dMinTracejado = 93;

const substituirImagem = (selecionado, url, objeto) => 
    store.dispatch({type: 'editar-slide-temporariamente', objeto, valor: { src: url }, selecionado});

const callbackUpload = (idUpload, urlDownload) => {
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
    }
}

class ImagemInput extends Component {
    
    constructor (props) {
        super(props);
        this.background = this.getBackground(props.img, props.indice + 1 === props.nFiles);
        this.state = {maxWidth: '0'};
    }

    getBackground = (img, finalizar) => {
        var bG = {};
        if (img) {
            bG.backgroundImage = 'url(' + getImgBase64(img, window.innerWidth*0.13, window.innerWidth*0.10) + ')';
            bG.backgroundPosition = 'center';
            bG.backgroundRepeat = 'no-repeat';
            bG.backgroundSize = 'cover';
        } else {
            bG.backgroundColor = 'var(--vermelho-fraco)';
        }
        if (finalizar) document.body.style.cursor = 'default';
        return bG;
    }

    componentDidMount = () => {
        setTimeout(() => this.setState({maxWidth: '12vw'}), 0);
        this.props.setFinalCarrossel();
        setTimeout(() => this.props.setFinalCarrossel(), 300);
    }

    apagar = e => {
        e.stopPropagation();
        this.setState({maxWidth: 0});
        setTimeout(() => this.props.callback(this.props.indice), 300);
    }

    render() {
        var {img} = this.props;
        var alt = img.alt + (img.contador ? '-' + img.contador : '');
        // <div className='container-imagem-upload' key={alt}>
        //         {img.width ?
        //         <img className='previa-imagem-upload' src={img.src} alt={alt}/> :
        //         <div className='imagem-invalida previa-imagem-upload'>
        //             <div style={{textAlign: 'center'}}>Arquivo Inválido:<br></br>"{img.nomeComExtensao}"<br></br></div>
        //             <div style={{fontSize: '120%'}}>✕</div>
        //         </div>}
        //     </div>
        // )
        return (
            <div className='container-imagem-upload' key={alt}>
                <div className='imagem-invalida previa-imagem-upload' 
                     style={{...this.background, ...this.state}}>
                    {img.width 
                        ? null
                        : <> 
                            <div style={{textAlign: 'center'}}>Arquivo Inválido:<br></br>"{img.nomeComExtensao}"<br></br></div>
                            <div style={{fontSize: '120%'}}>✕</div>
                            </>
                    }
                </div>
                <button className='x-apagar-imagem' onClick={this.apagar}>✕</button>
            </div>
        )
    }
}

class InputImagem extends Component {
    
    constructor (props) {
        super(props);
        this.refInputFile = React.createRef();
        this.aumentando = true;
        this.state = {
            nArquivosValidos: 0, 
            nArquivosInvalidos: 0, 
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
        var nValidos = this.state.nArquivosValidos;
        var nInvalidos = this.state.nArquivosInvalidos;
        if (e.target.width) {
            nValidos++;
        } else {
            nInvalidos++;
        }
        this.setState({imagens: [...this.state.imagens, e.target], nArquivosInvalidos: nInvalidos, nArquivosValidos: nValidos});
        
    }

    validarImagem(input){
        document.body.style.cursor = 'progress';
        var url = window.URL || window.webkitURL;
        this.nFiles = input.files.length;
    
        const getReduce = (n) => (contador, i) => {
            if(i.alt === n) contador = Math.max(contador, i.contador);
            return contador;
        }

        for (var arquivo of input.files) {
            var imagem = new Image();
            imagem.nomeComExtensao = arquivo.name;
            var n = imagem.nomeComExtensao;

            for (var i = n.length-1; i >= 0; i--) {
                if (n[i] === '.') {
                    n = n.slice(0, i);
                    break;
                }
            }
            
            imagem.contador = this.state.imagens.reduce(getReduce(n), -1) + 1;
            imagem.alt = n;
            imagem.arquivo = arquivo;
            imagem.src = url.createObjectURL(arquivo);
            [ imagem.onload, imagem.onerror ] = [ this.adicionarImagem, this.adicionarImagem ];
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
                {this.state.imagens.map((img, i) => 
                    <ImagemInput key={img.alt + '-' + img.contador} 
                                 img={img} 
                                 indice={i} 
                                 callback={this.apagarImagem} 
                                 nFiles={this.nFiles}
                                 setFinalCarrossel={() => this.setState({finalCarrossel: new Date().getTime()})}
                    />)
                }
            </div>
        )
    }

    limparInputs = () => {
        this.setState({nArquivosValidos: 0, nArquivosInvalidos: 0, imagens: []});
    }
    
    ativarSetas = () => this.setState({pointerEvents: 'all'}); 

    clicarInput = () => {
        if(this.refInputFile.current) this.refInputFile.current.click();
    }

    upload = () => {
        var imgsFiltradas = this.state.imagens.filter(i => i.width);

        imgsFiltradas = imgsFiltradas.map(i => {
            // i.idUpload = uploadImagem(i.arquivo, (idUpload, urlUpload) => {
            //     callbackUpload(idUpload, urlUpload);
            //     if(this.props.callbackUpload) this.props.callbackUpload(idUpload, urlUpload);
            // });
            return i;
        })
        this.props.callback(imgsFiltradas);
    }

    render () {
        var nValidos = this.state.nArquivosValidos;
        var nInvalidos = this.state.nArquivosInvalidos;
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
                            onChange={e => this.validarImagem(e.target)} placeholder='Arraste uma imagem para fazer o upload' />
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

const mapState = state => {
    return {elementos: state.present.elementos}
}

export default connect(mapState)(InputImagem);