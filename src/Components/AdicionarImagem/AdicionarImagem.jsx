import React, { Component } from 'react';
import Element from '../../Element.js';
import InputImagem from './InputImagem';
import { connect } from 'react-redux';

class AdicionarImagem extends Component { 

    constructor (props) {
        super(props);
        this.state = {...props.state, titulo: ''};
    }

    adicionarSlideImagem = img => {
        this.props.dispatch({type: 'adicionar', elemento: new Element('Imagem', this.state.titulo, [], img)})
    }

    onChange = e => {
        this.setState({titulo: e.target.value});
    }

    render () {
        return (
            <div className='conteudo-popup'>
                <h4 className='titulo-popup'>Adicionar Imagem</h4>
                <input className='combo-popup' type='text' placeholder='Digite um título para o slide. (opcional)' onChange={this.onChange} />
                <InputImagem callback={this.adicionarSlideImagem} />
            </div>
        )
    }
}

export default connect()(AdicionarImagem);