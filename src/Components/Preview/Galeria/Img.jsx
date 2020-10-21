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
        if (img.fundo.match(/Galeria/) === null) 
            img.fundo = img.fundo.replace('./','./Galeria/');
        this.props.dispatch({type: 'atualizar-estilo', objeto: 'fundo', valor: img.fundo});
        this.props.dispatch({type: 'atualizar-estilo', objeto: 'tampao', valor: img.tampao});
        this.props.dispatch({type: 'atualizar-estilo', objeto: 'texto', valor: {color: img.texto.color}});
    }

    render () {
        return (
            <div id={'img-galeria-path-' + this.props.imagem.fundo} className='div-img' 
                onClick={this.onClick}
                onMouseOver={this.onMouseOver}
                onMouseLeave={this.onMouseLeave}>
                <div className='texto-mini-preview sombrear-selecao'>
                    <div style={this.props.imagem.texto}>{this.props.imagem.alt}</div>
                </div>
                <div className='tampao' style={this.props.imagem.tampao}></div>
                <img className='imagem-galeria' 
                     src={require('' + this.props.imagem.fundo.replace(/.jpg|.png/,'-300px.jpg'))} 
                     alt={this.props.imagem.alt}
                />
            </div>
        )
    }
};

const mapStateToProps = function(state) {
    var sel = state.selecionado
    return {slidePreview: state.slidePreview, slideSelecionado: state.elementos[sel.elemento].slides[sel.slide]}
}

export default connect(mapStateToProps)(Img);
