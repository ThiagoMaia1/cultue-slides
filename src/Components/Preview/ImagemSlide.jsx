import React, { Component } from 'react';
import store from '../../index';
import Redimensionavel from '../Basicos/Redimensionavel/Redimensionavel';
import { listaDirecoes } from '../../principais/Constantes';
import BotaoReupload from './BotaoReupload';

const despachar = valor => store.dispatch({type: 'editar-slide', objeto: 'imagem', valor});

class ImagemSlide extends Component {

    constructor (props) {
        super(props);
        let img = new Image();
        img.onload = e => this.setProporcaoNatural(e.target);
        img.src = props.imagem.src;
    }

    setProporcaoNatural = img => despachar({proporcaoNatural: img.naturalWidth/img.naturalHeight});

    callback = estiloState => {
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
        let inset = listaDirecoes.reduce((resultado, l) => {
            resultado[l] = estiloImagem[l];
            return resultado;            
        }, {})
        let {borderRadius, proporcaoNatural, espelhadoVertical, espelhadoHorizontal} = estiloImagem;
        return (
            <Redimensionavel callback={this.callback} 
                             estilo={{borderRadius}} 
                             redimensionamentoAtivo={editavel} 
                             proporcao={proporcaoNatural || 1}
                             insetInicial={inset}
                             espelhadoVertical={espelhadoVertical}
                             espelhadoHorizontal={espelhadoHorizontal}>
                <div className='div-imagem-slide'
                     style={{backgroundImage: 'url(' + imagem.src + ')'}}>
                    <BotaoReupload callbackReupload={this.reupload} src={imagem.src} inativo={!editavel || imagem.idUpload}/>
                </div>
            </Redimensionavel>
        )
    }
};

export default ImagemSlide;
