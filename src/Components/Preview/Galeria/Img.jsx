import React, { Component } from 'react';
import './style.css';
import { connect } from 'react-redux';

class Img extends Component {

    togglePrevia(estiloImagem) {
        var img = {...estiloImagem};
        if (img.fundo.match(/Galeria/) === null) 
            img.fundo = img.fundo.replace('./','./Galeria/');
        this.fundoAnterior = this.props.slideSelecionado.estilo;
        this.props.dispatch({type: 'atualizar-estilo', objeto: 'fundo', valor: img.fundo});
        this.props.dispatch({type: 'atualizar-estilo', objeto: 'tampao', valor: img.tampao});
        this.props.dispatch({type: 'atualizar-estilo', objeto: 'texto', valor: {color: img.texto.color}});
    }

    // isInViewport(path, alt) {
    //     var element = document.getElementById('img-galeria-path-' + path)
    //     if (!element) return;
    //     const rect = element.getBoundingClientRect();
    //     if(rect.left + rect.width >= 0 && rect.right - rect.width <= (window.innerWidth || document.documentElement.clientWidth))
    //         return (<img className='imagem-galeria' src={require('' + path)} alt={alt}/>);
    // }

    render () {
        return (
            <div id={'img-galeria-path-' + this.props.imagem.fundo} className='div-img' 
                onClick={() => {
                    this.togglePrevia(this.props.imagem);
                }}
                onMouseOver={() => this.togglePrevia(this.props.imagem)}
                onMouseLeave={() => this.togglePrevia(this.fundoAnterior)}>
                <div className='texto-mini-preview sombrear-selecao'>
                    <div style={this.props.imagem.texto}>{this.props.imagem.alt}</div>
                </div>
                <div className='tampao' style={this.props.imagem.tampao}></div>
                <img className='imagem-galeria' src={require('' + this.props.imagem.fundo)} alt={this.props.imagem.alt}/>
                {/* {this.isInViewport(this.props.imagem.fundo, this.props.imagem.alt)} */}
            </div>
        )
    }
};

const mapStateToProps = function(state) {
    var sel = state.selecionado
    return {slidePreview: state.slidePreview, slideSelecionado: state.elementos[sel.elemento].slides[sel.slide]}
}

export default connect(mapStateToProps)(Img);
