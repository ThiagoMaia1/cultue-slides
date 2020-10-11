import React, { Component } from 'react';
//import './style.css';
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
                <input id="titulo" type='text' />
                <input id="subtitulo" type='text' />
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