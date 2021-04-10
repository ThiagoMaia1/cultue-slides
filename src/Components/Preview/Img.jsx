import React, { Component } from 'react';
import './Galeria.css';
import { connect } from 'react-redux';
import { ativarPopupConfirmacao } from '../Popup/PopupConfirmacao';

export const getPathImagem = (path, px) => {
    const pasta = './Fundos/';
    if (px) {
        path = px + 'px/' + path;
        path = path.replace(/.jpg|.png/,'.jpg');
    }
    return pasta + path;
  }
  
export const lerImagem = (fundo, px = null) => (
    fundo.src
        ? fundo.src
        : fundo.path 
            ? require('' + getPathImagem(fundo.path, px)).default
            : ''
);  

class Img extends Component {

    constructor (props) {
        super(props);
        if(!props.estatico) this.estiloAnterior = this.getEstiloAnterior(props);
    }

    getEstiloAnterior = (props = this.props) => ({...props.slideSelecionado.estilo});

    onMouseOver = () => {
        clearTimeout(this.esperaMouseOver);
        let t = this.mudancaTemporaria;
        this.mudancaTemporaria = true;
        if (!t || !this.estiloAnterior) this.estiloAnterior = this.getEstiloAnterior();
        this.esperaMouseOver = setTimeout(() => {
            this.togglePrevia(this.props.imagem);
        }, 100);
    }

    onMouseLeave = () => {
        clearTimeout(this.esperaMouseOver);
        this.mudancaTemporaria = false;
        this.reverterPrevia();
    }

    onClick = () => {
        this.props.dispatch(this.getObjetoDispatch(this.props.imagem));
        this.mudancaTemporaria = false;

        this.estiloAnterior = this.getEstiloAnterior();
        let { callback } = this.props;
        if (callback) callback();
    }

    togglePrevia(estiloImagem, checarBasico = true) {
        var img = {...estiloImagem};
        this.props.dispatch(this.getObjetoDispatch(img, true, checarBasico));
    }

    reverterPrevia = () => this.togglePrevia(this.estiloAnterior, false);

    getObjetoDispatch = (img, temp = false, checarBasico) => {
        let { estilo } = this.props.slidePreview;
        let objetos = {};
        let keys = ['tampao', 'texto'];
        for (let k of keys) {
            if (!checarBasico || estilo[k].eBasico)
                objetos[k] = {...img[k]};
            else if (k === 'tampao' && Number(estilo[k].opacityFundo) >= 0.9)
                objetos.tampao = {opacityFundo: img[k].opacityFundo};
        }
        return {
            type: 'editar-slide' + (temp ? '-temporariamente' : ''), 
            objeto: 'estiloSemReplace', 
            estilo: {
                fundo: {...img.fundo}, 
                ...objetos
            }
        }
    }

    clickApagar = e => {
        e.stopPropagation();
        this.reverterPrevia();
        ativarPopupConfirmacao(
            'simNao',
            'Confirmar Exclusão',
            <div>
                {'Tem certeza de que deseja excluir essa imagem dos seus fundos?'}
                <div className='img-popup-confirmacao'>
                    <Img imagem={{...this.props.imagem, excluivel: false}} estatico={true}/>
                </div>
                {'(Se for excluída, ela irá permanecer na sua coleção de imagens, mas não ficará disponível na Galeria de Fundos).'}
            </div>,
            fazer => {
                if(fazer)   
                        this.props.dispatch({
                        type: 'alterar-imagem-colecao-usuario', 
                        urls: this.props.imagem.fundo.src, 
                        subconjunto: 'fundos', 
                        transferirPara: 'gerais'
                    })
            }
        )
    }

    render () {
        var estiloTampao = {...this.props.imagem.tampao};
        estiloTampao.opacity = estiloTampao.opacityFundo;
        const img = this.props.imagem;
        return (
            <div className='div-img' 
                onClick={this.onClick}
                onMouseOver={this.onMouseOver}
                onMouseLeave={this.onMouseLeave}
                style={{pointerEvents: this.props.estatico ? 'none' : ''}}>
                {this.props.estatico ? null :
                    <>
                        {!img.excluivel ? null : 
                            <button className='x-apagar-imagem' onClick={this.clickApagar}>✕</button>
                        }
                        <div className='texto-mini-preview'>
                            <div style={img.texto}>{img.alt}</div>
                        </div>
                        <div className='tampao' style={estiloTampao}></div>
                    </>
                }
                <img className='imagem-galeria' 
                     src={lerImagem(img.fundo, 300)} 
                     alt={img.alt}
                />
            </div>
        )
    }
};

const mapState = function(state) {
    var sel = state.present.selecionado;
    return {
        slidePreview: state.slidePreview, 
        slideSelecionado: state.present.elementos[sel.elemento].slides[sel.slide]
    }
}

export default connect(mapState)(Img);
