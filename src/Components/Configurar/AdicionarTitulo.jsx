import React, { Component } from 'react';
import '../LetrasMusica/style.css';
import { Element } from '../../index'
import { connect } from 'react-redux';

class AdicionarTitulo extends Component {

    // constructor (props) {
    //     super(props);
    // }
    
    onClick () {
        var titulo = document.getElementById('titulo').value;
        var subtitulo = (document.getElementById('subtitulo').value || '');
        if (!titulo) {
            alert("Título não pode ser vazio.");
            return;
        }
        this.props.dispatch({type: "inserir", elemento: new Element(null, "Título", titulo, subtitulo)})
    }

    render () {
        return (
            <div>
                <h4>Adicionar Slide de Título</h4>
                <input id="titulo" className='combo' type='text' placeholder='Título do slide' />
                <textarea id="subtitulo" className='combo' placeholder='Texto do slide'></textarea>
                <button onClick={this.onClick.bind(this)}>Inserir Título</button>
            </div>
        )
    }
}

const mapStateToProps = function (state) {
    return {elementos: state.elementos};
}

// const mapDispatchToProps = function (state) {
//     { }
// }

export default connect(mapStateToProps)(AdicionarTitulo);