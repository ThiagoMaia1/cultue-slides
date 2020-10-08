import React, { Component } from 'react';
import './style.css';
import Popup from './Popup/Popup';
import ComboLetra from './../LetrasMusica/ComboLetra'
import TextoBiblico from './../TextoBiblico/TextoBiblico'

class Adicionar extends Component {
    
    constructor(props) {
        super(props);
        this.state = {...props, popupCompleto: (<div id="div-popup"></div>)}
      }
    
    adicionarMusica() {

        this.setState({popupCompleto: (
            <Popup text="Buscar música por título, artista ou trecho: " showPopup={true}>
                <ComboLetra />
            </Popup>
        )});
        this.forceUpdate();

        //this.props.atualizarLista();
    }
    
    adicionarTextoBiblico() {
        this.setState({popupCompleto: (
            <Popup text="Buscar texto bíblico: " showPopup={true}>
                <TextoBiblico />
            </Popup>
        )});
        this.forceUpdate();

        //this.props.atualizarLista();
    }

    adicionarTitulo() {

    }

    adicionarImagem() {

    }

    render() {
        if (this.props.visibility) {
            return (
                <>
                    <div id="div-botoes">
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