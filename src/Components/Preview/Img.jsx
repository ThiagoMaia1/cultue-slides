import React, { Component } from 'react';
import './Galeria.css';
import { connect } from 'react-redux';

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
        : require('' + getPathImagem(fundo.path || 'Cor Sólida.jpg', px)) 
);  

class Img extends Component {

    constructor (props) {
        super(props);
        this.estiloAnterior = this.getEstiloAnterior(props);
    }

    getEstiloAnterior = (props = this.props) => ({...props.slideSelecionado.estilo});

    onMouseOver = () => {
        clearTimeout(this.esperaMouseOver);
        var t = this.mudancaTemporaria;
        this.mudancaTemporaria = true;
        if (!t || !this.estiloAnterior) this.estiloAnterior = this.getEstiloAnterior();
        this.esperaMouseOver = setTimeout(() => {
            this.togglePrevia(this.props.imagem);
        }, 100);
    }

    onMouseLeave = () => {
        clearTimeout(this.esperaMouseOver);
        this.mudancaTemporaria = false;
        this.togglePrevia(this.estiloAnterior);
    }

    onClick = () => {
        this.props.dispatch(this.getObjetoDispatch(this.props.imagem));
        this.mudancaTemporaria = false;
        this.estiloAnterior = {...this.props.slideSelecionado.estilo};
    }

    togglePrevia(estiloImagem) {
        var img = {...estiloImagem};
        this.props.dispatch(this.getObjetoDispatch(img, true));
    }

    getObjetoDispatch = (img, temp = false) => ({
        type: 'editar-slide' + (temp ? '-temporariamente' : ''), 
        objeto: 'estiloSemReplace', 
        estilo: {fundo: {...img.fundo}, tampao: {...img.tampao}, texto: {...img.texto}}
    })

    render () {
        var estiloTampao = {...this.props.imagem.tampao};
        estiloTampao.opacity = estiloTampao.opacityFundo;
        return (
            <div className='div-img' 
                onClick={this.onClick}
                onMouseOver={this.onMouseOver}
                onMouseLeave={this.onMouseLeave}>
                <div className='texto-mini-preview'>
                    <div style={this.props.imagem.texto}>{this.props.imagem.alt}</div>
                </div>
                <div className='tampao' style={estiloTampao}></div>
                <img className='imagem-galeria' 
                     src={lerImagem(this.props.imagem.fundo, 300)} 
                     alt={this.props.imagem.alt}
                />
            </div>
        )
    }
};

const mapState = function(state) {
    var sel = state.present.selecionado
    return {slidePreview: state.slidePreview, slideSelecionado: state.present.elementos[sel.elemento].slides[sel.slide]}
}

export default connect(mapState)(Img);
