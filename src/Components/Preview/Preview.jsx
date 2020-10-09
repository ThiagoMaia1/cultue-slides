import React, { Component } from 'react';
import './style.css';
import { connect } from 'react-redux';

class Preview extends Component {
    
    // constructor(props) {
    //     super(props);
    //   }

    render() {
        return (
            <div id="preview">
                <Img imagem={{path: (this.props.apresentacao.imagemPreview || this.props.apresentacao.fundoPadrao), alt: "Aquarela"}} />
                <div className='titulo slide'>{'titulo'||this.props.apresentacao.texto}</div>
                <div className='paragrafo slide'>{this.props.apresentacao.texto}</div>
            </div>
        )
    }
}

const ImgS = ( { imagem } ) => (
    <>
        <img id='fundo-preview' src={require('' + imagem.path)} alt={imagem.alt} />
    </>
);

const mapStateToProps = function (state) {
    return {apresentacao: state.apresentacao}
}

const Img = connect(mapStateToProps)(ImgS);
export default connect(mapStateToProps)(Preview);