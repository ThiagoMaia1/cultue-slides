import React, { Component } from 'react';
import '../LetrasMusica/style.css';
import { Element } from '../../index'
import { connect } from 'react-redux';

class AdicionarImagem extends Component {
    
    onClick () {
        var titulo = document.getElementById('titulo').value;
        this.props.dispatch({type: "inserir", elemento: new Element( "Imagem", titulo, 'sei lá')})
    }

    render () {
        return (
            <div>
                <h4>Adicionar Imagem</h4>
                <input id="titulo" className='combo-popup' type='text' placeholder='Título do slide' />
                <button className='botao' onClick={this.onClick.bind(this)}>Inserir Imagem</button>
            </div>
        )
    }
}

export default connect()(AdicionarImagem);