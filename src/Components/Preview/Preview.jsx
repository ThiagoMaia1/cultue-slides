import React, { Component } from 'react';
import './style.css';
import { connect } from 'react-redux';
import { MdFullscreen, MdFullscreenExit } from 'react-icons/md'

class Preview extends Component {
    
    constructor(props) {
        super(props);
        this.state = {fullScreenIcon: <MdFullscreen/>}
    }

    toggleFullscreen () {
    
        if (document.fullscreenElement) {
            document.exitFullscreen()
            .catch(function(error) {
                console.log(error.message);
            });
            this.setState({fullScreenIcon: <MdFullscreen />})
        } else {
            var element = document.getElementById('preview');

            element.requestFullscreen()
            .catch(function(error) {
                console.log(error.message);
            });
            this.setState({fullScreenIcon: <MdFullscreenExit/>})
        }
    }
    
    render() {
        return (
            <div id='preview'>
                <div id='tampao' style={this.props.slidePreview.estilo.tampao}></div>
                <Img imagem={this.props.slidePreview.estilo.fundo} />
                <div className='titulo slide texto' style={this.props.slidePreview.estilo.titulo}>{this.props.slidePreview.titulo}</div>
                <div className='paragrafo slide texto' style={this.props.slidePreview.estilo.paragrafo}>{this.props.slidePreview.texto}</div>
                <button id='ativar-tela-cheia' onClick={this.toggleFullscreen.bind(this)}>{this.state.fullScreenIcon}</button>
            </div>
        )
    }

    // getEstiloAplicavel (obj) {
    //     if (obj === 'fundo') {
    //         return this.props.slide.fundo || this.props.elemento.fundo || this.props.global.fundo;
    //     } else {        
    //         var estiloTexto = {};
    //         if (obj === 'paragrafo' || obj === 'titulo')
    //             estiloTexto = {...this.props.slide.texto, ...this.props.global.texto, ...this.props.elemento.texto};  
    //         return {...estiloTexto, ...this.props.slide[obj], ...this.props.global[obj], ...this.props.elemento[obj]};       
    
    //     }
    // }

    // render() {
    //     return (
    //         <div id='preview'>
    //             <div id='tampao' style={this.getEstiloAplicavel('tampao')}></div>
    //             <Img imagem={this.getEstiloAplicavel('fundo')} />
    //             <div className='titulo slide texto' style={this.getEstiloAplicavel('titulo')}>Título</div>
    //             <div className='paragrafo slide texto' style={this.getEstiloAplicavel('paragrafo')}>Lorem ipsum</div>
    //             <button id='ativar-tela-cheia' onClick={this.toggleFullscreen.bind(this)}>{this.state.fullScreenIcon}</button>
    //         </div>
    //     )
    // }
}

const Img = ({imagem}) => (
    <>
        <img id='fundo-preview'  src={require('' + imagem)} alt='' />
    </>
);

const mapStateToProps = function (state) {
    return {slidePreview: state.slidePreview}
}

// const Img = connect(mapStateToProps)(ImgS);
export default connect(mapStateToProps)(Preview);