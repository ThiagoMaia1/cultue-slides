import React, { Component } from 'react';
import '../LetrasMusica/style.css';
import './style.css';
// import { Element } from '../../index'
import { connect } from 'react-redux';
import firebase, { firebaseStorage } from '../../firebase.js'

const arquivoInvalido = 'Arquivo Inválido';

class AdicionarImagem extends Component {
    
    constructor (props) {
        super(props);
        this.o = 100;
        this.state = {...props, path: this.mensagemPath, estiloCaixa: {opacity: '0'}};
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

    onClick = () => {
        console.log('oi');
        // var titulo = document.getElementById('titulo').value;
        // this.props.dispatch({type: "inserir", elemento: new Element( "Imagem", titulo, 'sei lá')})
    }  

    validarImagem(input){
        var url = window.URL || window.webkitURL;
        var arquivo = input.files[0];
    
        if (arquivo) {
            var imagem = new Image();
    
            imagem.onload = () => {
                if (imagem.width) {
                     console.log('Image has width, I think it is real image');
                     this.setState({imagem: imagem.src, path: input.files[0].name});
                     //TODO: upload to backend
                } else {
                    this.setState({path: arquivoInvalido});
                }
            };

            imagem.onerror = () => {
                this.setState({path: arquivoInvalido});
            }
    
            imagem.src = url.createObjectURL(arquivo);
        }
    }
    
    limparInputs = () => {
        this.setState({path: null, imagem: null});
    }

    render () {
        return (
            <div className='conteudo-popup'>
                <h4 className='titulo-popup'>Adicionar Imagem</h4>
                <label className='file-input-container combo-popup' onDragOver={this.onDragOver} onDrop={this.onDrop}>
                    <div className='animacao-drag-over'>
                        <div className='tracejado-animacao' style={this.state.estiloCaixa}></div>
                    </div>
                    <div className='container-texto-input-file'>
                        Arraste uma imagem, ou clique para selecionar o arquivo.
                        <br></br><br></br>
                        {this.state.path ? 
                            this.state.path === arquivoInvalido ? 
                            <div style={{color: 'red'}}>{arquivoInvalido}</div> : 
                            'Arquivo selecionado: ' + this.state.path : 
                        null}
                        {<div className='container-imagem-upload'>
                            <img className='previa-imagem-upload' src={this.state.imagem} alt={this.state.path}/>
                        </div>}
                    </div>
                    <input id="adicionar-imagem" className='combo-popup' type='file' accept="image/*" 
                           onChange={e => this.validarImagem(e.target)} placeholder='Arraste uma imagem para fazer o upload' />
                </label>
                <div className='container-botoes-popup'>
                    <button className='botao' onClick={this.onClick}>Inserir Imagem</button>
                    <button className='botao-limpar-input' onClick={this.limparInputs}>✕ Limpar</button>
                </div>
            </div>
        )
    }
}

export default connect()(AdicionarImagem);