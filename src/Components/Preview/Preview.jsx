import React, { Component } from 'react';
import './style.css';
import { connect } from 'react-redux';

class Preview extends Component {
    
    constructor(props) {
        super(props);
        this.state = {fullScreen: 'preview'}
    }

    toggleFullScreen () {
        if (this.state.fullScreen === 'preview') {
            this.setState({fullScreen: 'tela-cheia'});
            document.body.style='height:100%;overflow:hidden;'            
        } else {
            this.setState({fullScreen: 'preview'});
            document.body.style="height:;overflow:auto;"
        }
        
    }

    render() {
        return (
            <div id={this.state.fullScreen}>
                <div id='tampao' style={this.props.apresentacao.estilo.tampao}></div>
                <Img imagem={{path: (this.props.apresentacao.imagemPreview || this.props.apresentacao.fundoPadrao), alt: "Aquarela"}} />
                <div className='titulo slide texto'>{'Título'||this.props.apresentacao.texto}</div>
                <div className='paragrafo slide texto'>{this.props.apresentacao.texto}</div>
                <button id='ativar-tela-cheia' onClick={this.toggleFullScreen.bind(this)}><span role='img' aria-label='Tela Cheia'>🖥️</span></button>
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