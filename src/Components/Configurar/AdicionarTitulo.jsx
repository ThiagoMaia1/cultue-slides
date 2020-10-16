import React, { Component } from 'react';
import '../LetrasMusica/style.css';
import { Element } from '../../index'
import { connect } from 'react-redux';

class AdicionarTitulo extends Component {
    
    onClick () {
        var titulo = document.getElementById('titulo').value;
        var subtitulo = (document.getElementById('subtitulo').value || '');
        if (!titulo) {
            alert("Título não pode ser vazio.");
            return;
        }
        this.props.dispatch({type: "inserir", elemento: new Element( "Título", titulo, [...subtitulo.split(/(?=\n\n)/)])});
    }

    render () {
        return (
            <div className='conteudo-popup'>
                <h4>Adicionar Slide de Título</h4>
                <input id="titulo" className='combo-popup' type='text' placeholder='Título do slide' />
                <textarea id="subtitulo" className='combo-popup' rows={10} placeholder='Texto do slide'></textarea>
                <button className='botao' onClick={this.onClick.bind(this)}>Inserir Título</button>
            </div>
        )
    }
}

export default connect()(AdicionarTitulo);