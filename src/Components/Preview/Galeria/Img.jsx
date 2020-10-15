import React, { Component } from 'react';
import './style.css';
import { connect } from 'react-redux';

class Img extends Component {

    togglePrevia(estiloImagem) {
        var img = {...estiloImagem};
        if (img.fundo.match(/Galeria/) === null) 
            img.fundo = img.fundo.replace('./','./Galeria/');
        this.fundoAnterior = this.props.slidePreview.estilo;
        this.props.dispatch({type: 'atualizar-estilo', objeto: 'fundo', valor: img.fundo});
        this.props.dispatch({type: 'atualizar-estilo', objeto: 'tampao', valor: img.tampao});
        this.props.dispatch({type: 'atualizar-estilo', objeto: 'texto', valor: {color: img.texto.color}});
    }

        render () {
        return (
        <div className='div-img' 
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
        </div>
        )
    }
};

const mapStateToProps = function(state) {
    return {slidePreview: state.slidePreview}
}

export default connect(mapStateToProps)(Img);
