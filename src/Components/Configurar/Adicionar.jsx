import React, { Component } from 'react';
import Popup from './Popup/Popup';
import ComboLetra from './../LetrasMusica/ComboLetra';
import TextoBiblico from './../TextoBiblico/TextoBiblico';
import AdicionarTitulo from './AdicionarTitulo';
import AdicionarImagem from './../AdicionarImagem/AdicionarImagem';
import { GrChapterAdd } from 'react-icons/gr';

class Adicionar extends Component {
    
    constructor(props) {
        super(props);
        this.state = {...props, adicionarVisivel: true};
    }

    onMouse = visivel => {
        this.setState({adicionarVisivel: visivel});
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
                <div id="div-botoes" onMouseOver={() => this.onMouse(false)} onMouseLeave={() => this.onMouse(true)}>
                    <div id='container-adicionar-slide' style={{display: this.state.adicionarVisivel ? '' : 'none' }}>
                        <div><div id='p-adicionar-slide'>Adicionar um Slide</div>
                        <GrChapterAdd size={50}/></div>
                    </div>
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