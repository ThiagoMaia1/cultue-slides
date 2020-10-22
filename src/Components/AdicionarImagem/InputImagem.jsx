import React, { Component } from 'react';
import '../LetrasMusica/style.css';
import './style.css';
import { connect } from 'react-redux';
import firebase, { firebaseStorage } from '../../firebase.js'

class InputImagem extends Component {
    
    constructor (props) {
        super(props);
        this.o = 100;
        this.state = {...props, umArquivoInvalido: false, imagens: [], estiloCaixa: {opacity: '0'}};
    }

    onDragOver = () => {
        if (this.animacao) return;
        this.setState({estiloCaixa: {...this.state.estiloCaixa, opacity: '1'}})
        this.o = 100;
        this.x = 99;
        this.aumentando = true;
        this.animacao = setInterval(() => {
            this.x += this.aumentando ? 0.1 : -0.1;
            if (this.x >= 99) {
                this.aumentando = false;
            } else if (this.x <= 93) {
                this.aumentando = true;
            }
            this.setState({estiloCaixa: {...this.state.estiloCaixa, width: this.x + '%', height: this.x + '%'}})
        }, 20);
    }

    onDrop = () => {
        clearInterval(this.animacao);
        this.animacao = null;
        const fade = () => {
            if (this.animacao) {
                this.setState({estiloCaixa: {...this.state.estiloCaixa, opacity: '1'}})
                return;
            }
            this.o -= 11;
            this.setState({estiloCaixa: {...this.state.estiloCaixa, opacity: String(this.o/100)}})
            if (this.o > 0) setTimeout(fade, 20);
        }
            
        fade();
    }

    validarImagem(input){
        var url = window.URL || window.webkitURL;
        const adicionarImagem = e => this.setState({imagens: [...this.state.imagens, e.target]});
    
        for (var arquivo of input.files) {
            var imagem = new Image();
            var n = arquivo.name;

            for (var i = n.length; i >= 0; i--) {
                if (i === '.') {
                    n = n.slice(0, i-1);
                    break;
                }
            }

            imagem.alt = n;
            [ imagem.onload, imagem.onerror ] = [ adicionarImagem, adicionarImagem];
            imagem.src = url.createObjectURL(arquivo);
        }
    }
    
    gerarListaImagens = () => {
        var imgs = this.state.imagens;
        if (imgs.length === 0) return;
        if (imgs.length === 1 && !imgs[0].width) 
            return (<div style={{color: 'red'}}>Arquivo Inválido: {imgs[0].alt}</div>);
        return (
            this.state.imagens.map( img => 
                <div className='container-imagem-upload'>
                    {img.width ?
                        <img className='previa-imagem-upload' src={img.src} alt={img.alt}/> :
                        <div className='imagem-invalida previa-imagem-upload'>
                            <div>Arquivo Inválido: "{img.alt}"<br></br></div>
                            <div style={{fontSize: '120%'}}>✕</div>
                        </div>}                    
                </div>
        )); 
    }

    limparInputs = () => {
        this.setState({umArquivoInvalido: false, imagens: []});
    }

    render () {
        return (
            <>
                <label className='file-input-container combo-popup' onDragOver={this.onDragOver} onDrop={this.onDrop}>
                    <div className='animacao-drag-over'>
                        <div className='tracejado-animacao' style={this.state.estiloCaixa}></div>
                    </div>
                    <div className='container-texto-input-file'>
                        <p className='texto-auxiliar'>Arraste uma imagem, ou clique para selecionar o arquivo.</p>
                        {this.gerarListaImagens()}
                    </div>
                    <input id="adicionar-imagem" className='combo-popup' type='file' multiple="multiple" accept="image/*" 
                            onChange={e => this.validarImagem(e.target)} placeholder='Arraste uma imagem para fazer o upload' />
                </label>
                <div className='container-botoes-popup'>
                    <button className='botao' onClick={() => this.props.callback()}>Inserir Imagem</button>
                    <button className='botao-limpar-input' onClick={this.limparInputs}>✕ Limpar</button>
                </div>
            </>
        )
    }
}

export default connect()(InputImagem);