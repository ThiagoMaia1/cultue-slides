import React, { Component } from 'react';
import './style.css';
import { connect } from 'react-redux';

export const getPathImagemReduzida = (path, px) => {
    if (px) {
        path = path.replace('/Fundos/','/Fundos/' + px + 'px/');
        path = path.replace(/.jpg|.png/,'.jpg');
    }
    return path;
}

class Img extends Component {

    constructor (props) {
        super(props);
        this.estiloAnterior = this.getEstiloAnterior(props);
    }

    getEstiloAnterior = (props = this.props) => ({...props.slideSelecionado.estilo});

    onMouseOver = () => {
        clearTimeout(this.esperaMouseOver);
        this.esperaMouseOver = setTimeout(() => {
            var t = this.mudancaTemporaria;
            this.mudancaTemporaria = true;
            if (!t || !this.estiloAnterior) this.estiloAnterior = this.getEstiloAnterior();
            this.togglePrevia(this.props.imagem);
        }, 100);
    }

    onMouseLeave = () => {
        clearTimeout(this.esperaMouseOver);
        this.mudancaTemporaria = false;
        this.togglePrevia(this.estiloAnterior);
    }

    onClick = () => {
        this.togglePrevia(this.props.imagem);
        this.props.dispatch({type: 'confirmar-mudanca'});
        this.mudancaTemporaria = false;
        this.estiloAnterior = {...this.props.slideSelecionado.estilo};
    }

    togglePrevia(estiloImagem) {
        var img = {...estiloImagem};
        var fundo = {...img.fundo};
        if (fundo.src && fundo.src.substr(0, 4) !== 'blob' && fundo.src.match(/Galeria/) === null) 
            fundo.src = fundo.src.replace('./','./Galeria/');
        this.props.dispatch({type: 'editar-slide-temporariamente', objeto: 'fundo', valor: fundo});
        this.props.dispatch({type: 'editar-slide-temporariamente', objeto: 'tampao', valor: img.tampao});
        this.props.dispatch({type: 'editar-slide-temporariamente', objeto: 'texto', valor: {color: img.texto.color}});
    }

    render () {
        return (
            <div className='div-img' 
                onClick={this.onClick}
                onMouseOver={this.onMouseOver}
                onMouseLeave={this.onMouseLeave}>
                <div className='texto-mini-preview'>
                    <div style={this.props.imagem.texto}>{this.props.imagem.alt}</div>
                </div>
                <div className='tampao' style={this.props.imagem.tampao}></div>
                <img className='imagem-galeria' 
                     src={this.props.imagem.fundo.src.substr(0, 4) === 'blob' ? this.props.imagem.fundo.src : require('' + getPathImagemReduzida(this.props.imagem.fundo.src, 300))} 
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
