import React, { Component } from 'react';
import './style.css';
import Popup from './Popup/Popup';
import ComboLetra from './../LetrasMusica/ComboLetra'
import TextoBiblico from './../TextoBiblico/TextoBiblico'
import AdicionarTitulo from '../AdicionarTitulo/AdicionarTitulo'

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

        //this.props.atualizarLista();
    }
    
    adicionarTextoBiblico() {
        this.setState({popupCompleto: (
            <Popup ocultarPopup={this.ocultarPopup}>
                <TextoBiblico />
            </Popup>
        )});
        //this.forceUpdate();

        //this.props.atualizarLista();
    }

    adicionarTitulo() {
        this.setState({popupCompleto: (
            <Popup ocultarPopup={this.ocultarPopup}>
                <AdicionarTitulo />
            </Popup>
        )});
        //this.forceUpdate();
    }

    adicionarImagem() {
        this.setState({popupCompleto: (
            <Popup ocultarPopup={this.ocultarPopup}>
                {/* <AdicionarImagem /> */}
            </Popup>
        )});
    }

    ocultarPopup = () => {
        this.setState({popupCompleto: null})
    }

    render() {
        if (this.props.visibility === 'visible') {
            return (
                <>
                    <div id="div-botoes" visibility={this.props.visibility}>
                        <button className="Música" onClick={this.adicionarMusica.bind(this)}>Música</button>
                        <button className="Bíblia" onClick={this.adicionarTextoBiblico.bind(this)}>Texto Bíblico</button>
                        <button className="Título" onClick={this.adicionarTitulo.bind(this)}>Título</button>
                        <button className="Imagem" onClick={this.adicionarImagem.bind(this)}>Imagem</button>
                    </div>
                    {this.state.popupCompleto}
                </>
            )
        } else {
            return null;
        }
    }
}

export default Adicionar;