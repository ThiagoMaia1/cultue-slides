import React, { Component } from 'react';
import Element from '../../../../principais/Element.js';
import InputImagem from './InputImagem';
import store from '../../../../index';

class AdicionarImagem extends Component { 

    constructor (props) {
        super(props);
        this.state = {...props.state, titulo: ''};
    }

    adicionarSlideImagem = imgs => {
        var imagensValidas = imgs.filter(i => i.width);
        var srcs = imagensValidas.map(i => ({src: i.src, ...(i.idUpload !== undefined ? {idUpload: i.idUpload} : {})}));
        var popupAdicionar = {input1: this.state.titulo || imagensValidas[0].alt, input2: srcs};
        store.dispatch({type: 'inserir', elemento: new Element('Imagem', this.state.titulo || imagensValidas[0].alt, [], srcs),
                             popupAdicionar, elementoASubstituir: this.props.elementoASubstituir})
    }

    onChange = e => {
        this.setState({titulo: e.target.value});
    }

    render () {
        return (
            <div className='conteudo-popup'>
                <h4 className='titulo-popup'>Adicionar Imagem</h4>
                <input className='combo-popup' type='text' placeholder='Digite um título para o slide (Opcional)'
                    defaultValue={this.props.input1} onChange={this.onChange}/>
                <InputImagem callback={this.adicionarSlideImagem} imagens={this.props.input2} titulo={this.props.input1}/>
            </div>
        )
    }
}

export default AdicionarImagem;