import React, { Component } from 'react';
import store from '../../index';
import Redimensionavel from '../Basicos/Redimensionavel/Redimensionavel';
import { listaDirecoes } from '../../principais/Constantes';
import BotaoReupload from './BotaoReupload';

class ImagemSlide extends Component {

    constructor (props) {
        super(props);
        let img = new Image();
        img.onload = e => this.setProporcaoNatural(e.target);
        img.src = props.imagem.src;
    }

    setProporcaoNatural = img => {
        this.setState({proporcao: img.naturalWidth/img.naturalHeight});
    }

    callback = estiloState => {
        const despachar = valor => store.dispatch({type: 'editar-slide', objeto: 'imagem', valor});
        for (var l of listaDirecoes) {
            if (estiloState[l] !== this.props.estiloImagem[l]) {
                despachar(estiloState);
                return;
            }
        }
    }

    reupload = () => {
        alert('todo');
    }

    render () {
        let { imagem, editavel, estiloRealce, estiloImagem } = this.props;
        let {borderRadius} = estiloImagem;
        return (
            <Redimensionavel callback={this.callback} 
                             estilo={{...estiloRealce, borderRadius}} 
                             redimensionamentoAtivo={editavel} 
                             proporcao={this.proporcao} 
                             insetInicial={estiloImagem}>
                <div className='div-imagem-slide'
                         style={{backgroundImage: 'url(' + imagem.src + ')'}}>
                    <BotaoReupload callbackReupload={this.reupload} src={imagem.src} inativo={!editavel}/>
                </div>
            </Redimensionavel>
        )
    }
};

export default ImagemSlide;
