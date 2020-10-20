import React, { Component } from 'react';
//import './style.css';
import Popup from './Popup/Popup';
import ComboLetra from './../LetrasMusica/ComboLetra'
import TextoBiblico from './../TextoBiblico/TextoBiblico'
import AdicionarTitulo from './AdicionarTitulo'
import AdicionarImagem from './../AdicionarImagem/AdicionarImagem'

class Adicionar extends Component {
    
    constructor(props) {
        super(props);
        this.state = {...props}
      }
    
    adicionarMusica() {

        this.setState({popupCompleto: (
            <Popup ocultarPopup={this.ocultarPopup}>
                <ComboLetra />
            </Popup>
        )});
        this.forceUpdate();

    }
    
    adicionarTextoBiblico() {
        this.setState({popupCompleto: (
            <Popup ocultarPopup={this.ocultarPopup}>
                <TextoBiblico />
            </Popup>
        )});
    }

    adicionarTitulo() {
        this.setState({popupCompleto: (
            <Popup ocultarPopup={this.ocultarPopup}>
                <AdicionarTitulo />
            </Popup>
        )});
    }

    adicionarImagem() {
        this.setState({popupCompleto: (
            <Popup ocultarPopup={this.ocultarPopup}>
                <AdicionarImagem />
            </Popup>
        )});
    }

    adicionarVideo() {
        this.setState({popupCompleto: (
            <Popup ocultarPopup={this.ocultarPopup}>
                {/* <AdicionarVideo /> */}
            </Popup>
        )});
    }

    ocultarPopup = () => {
        this.setState({popupCompleto: null})
    }

    render() {
        return (
            <>
                <div id="div-botoes">
                    <button className="Música itens botao-adicionar" onClick={this.adicionarMusica.bind(this)}>Música</button>
                    <button className="Texto-Bíblico itens botao-adicionar" onClick={this.adicionarTextoBiblico.bind(this)}>Texto Bíblico</button>
                    <button className="Título itens botao-adicionar" onClick={this.adicionarTitulo.bind(this)}>Título</button>
                    <button className="Imagem itens botao-adicionar" onClick={this.adicionarImagem.bind(this)}>Imagem</button>
                    <button className="Vídeo itens botao-adicionar" onClick={this.adicionarVideo.bind(this)}>Vídeo</button>
                </div>
                {this.state.popupCompleto}
            </>
        )
    }
}

export default Adicionar;