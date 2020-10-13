import React, { Component } from 'react';
import './style.css';
import { connect } from 'react-redux';

class Img extends Component {

    togglePrevia(estiloImagem) {
        this.fundoAnterior = this.props.slidePreview.estilo;
        this.props.dispatch({type: 'atualizar-estilo', objeto: 'fundo', valor: estiloImagem.fundo});
        this.props.dispatch({type: 'atualizar-estilo', objeto: 'tampao', valor: estiloImagem.tampao});
        this.props.dispatch({type: 'atualizar-estilo', objeto: 'texto', subitem: 'color',valor: estiloImagem.texto.color});
    }

        render () {
        return (
        <div className='div-img'>
            <img className='imagem-galeria sombrear-selecao' src={require('' + this.props.imagem.fundo)} alt={this.props.imagem.alt} 
                onClick={() => {
                    this.togglePrevia(this.props.imagem.fundo).replace('./','./Galeria/');
                    }
                }
                onMouseOver={() => this.togglePrevia(this.props.imagem.fundo).replace('./','./Galeria/')}
                onMouseLeave={() => this.togglePrevia(this.fundoAnterior)}
            />
        </div>
        )
    }
};

const mapStateToProps = function(state) {
    return {slidePreview: state.slidePreview}
}

export default connect(mapStateToProps)(Img);
