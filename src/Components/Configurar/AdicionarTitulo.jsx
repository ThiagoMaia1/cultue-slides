import React, { Component } from 'react';
import '../LetrasMusica/style.css';
import Element from '../../Element'
import { connect } from 'react-redux';

const listaSlidesPadrao = [{titulo: 'Visitantes', subtitulo: 'Sejam bem-vindos à nossa Igreja!\n\n\nuhduhwdowqdijijwjqaaaaaaaaaaaaaaaaaaa\n\na8hsqhhaas\n888888888888888888888888888888888888888888888'},
                           {titulo: 'Avisos', subtitulo: ''}, 
                           {titulo: 'Mensagem', subtitulo: ''}
]

class AdicionarTitulo extends Component {
    
    gerarListaSlidesPadrao = () => 
        listaSlidesPadrao.map(s => (
            <button className='botao' 
                    onClick={() => {
                        document.getElementById('titulo').value = s.titulo === '✕ Limpar' ? '' : s.titulo;
                        document.getElementById('subtitulo').value = s.subtitulo
                    }}>{s.titulo}</button>
    ));

    onClick () {
        var titulo = document.getElementById('titulo').value;
        var subtitulo = (document.getElementById('subtitulo').value || '');
        if (!titulo) {
            alert("Título não pode ser vazio.");
            return;
        }
        this.props.dispatch({type: "inserir", elemento: new Element( "Título", titulo, [...subtitulo.split(/(?=\n\n)/)])});
    }

    limparInputs = () => {
        document.getElementById('titulo').value = '';
        document.getElementById('subtitulo').value = '';
    }

    render () {
        return (
            <div className='conteudo-popup'>
                <div>
                    <h4 className='titulo-popup'>Adicionar Slide de Título</h4>
                    <input id="titulo" className='combo-popup' type='text' placeholder='Título do slide' />
                </div>
                <textarea id="subtitulo" className='combo-popup' placeholder='Texto do slide'></textarea>
                <div className='lista-slides-padrao'>
                    <div className='titulo-secao-popup'>Slides Padrão: </div>
                    {this.gerarListaSlidesPadrao()}
                </div>
                <div className='container-botoes-popup'>
                    <button className='botao' onClick={this.onClick.bind(this)}>Inserir Título</button>
                    <button className='botao-limpar-input' onClick={this.limparInputs}>✕ Limpar</button>
                </div>
            </div>
        )
    }
}

export default connect()(AdicionarTitulo);