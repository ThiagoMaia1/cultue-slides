import React, { Component } from 'react';
import './style.css';
import { connect } from 'react-redux';

class Img extends Component {

    onMouseOver = () => {
        var t = this.mudancaTemporaria;
        this.mudancaTemporaria = true;
        if (!t || !this.estiloAnterior) this.estiloAnterior = {...this.props.slideSelecionado.estilo};
        this.togglePrevia(this.props.imagem);
    }

    onMouseLeave = () => {
        this.mudancaTemporaria = false;
        this.togglePrevia(this.estiloAnterior);
    }

    onClick = () => {
        this.togglePrevia(this.props.imagem);
        this.mudancaTemporaria = false;
        this.estiloAnterior = {...this.props.slideSelecionado.estilo};
    }

    togglePrevia(estiloImagem) {
        var img = {...estiloImagem};
        var fundo = {...img.fundo};
        if (fundo.src && fundo.src.substr(0, 4) !== 'blob' && fundo.src.match(/Galeria/) === null) 
            fundo.src = fundo.src.replace('./','./Galeria/');
        this.props.dispatch({type: 'editar-slide', objeto: 'fundo', valor: fundo});
        this.props.dispatch({type: 'editar-slide', objeto: 'tampao', valor: img.tampao});
        this.props.dispatch({type: 'editar-slide', objeto: 'texto', valor: {color: img.texto.color}});
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
                     src={this.props.imagem.fundo.src.substr(0, 4) === 'blob' ? this.props.imagem.fundo.src : require('' + this.props.imagem.fundo.src.replace(/.jpg|.png/,'-300px.jpg'))} 
                     alt={this.props.imagem.alt}
                />
            </div>
        )
    }
};

const mapStateToProps = function(state) {
    var sel = state.present.selecionado
    return {slidePreview: state.slidePreview, slideSelecionado: state.present.elementos[sel.elemento].slides[sel.slide]}
}

export default connect(mapStateToProps)(Img);
