import React, { Component } from 'react';
import './style.css';
import { connect } from 'react-redux';

class Img extends Component {

    togglePrevia(path) {
        this.props.dispatch({type: 'atualizar-prévia-imagem', pathImagem: path.replace('./','./Galeria/')});
    }

        render () {
        return (
        <div className='div-img'>
            <img src={require('' + this.props.imagem.path)} alt={this.props.imagem.alt} 
                onClick={() => {
                    //se nenhum elemento específico estiver selecionado
                    this.props.dispatch({type: 'definir-fundo-padrao', pathImagem:this.props.imagem.path.replace('./','./Galeria/')});
                    }
                }
                onMouseOver={() => this.togglePrevia(this.props.imagem.path)}
                onMouseLeave={() => this.togglePrevia('')}
            />
        </div>
        )
    }
};

// const mapStateToProps = function(state) {
//     return {imagemPreview: state.imagemPreview};
// }

export default connect()(Img);
