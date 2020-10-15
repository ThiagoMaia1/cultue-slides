import React, { Component } from 'react';
import './style.css';
import { connect } from 'react-redux';
import { MdFullscreen, MdFullscreenExit } from 'react-icons/md'

export const fonteBase = {numero: 0.024*window.screen.height, unidade: 'px'};
export const proporcaoTela = 0.5;

class Preview extends Component {
    
    constructor(props) {
        super(props);
        this.larguraTela = window.screen.width;
        this.alturaTela = window.screen.height;
        this.full = {icone: <MdFullscreenExit/>, proporcao: 1}
        this.small = {icone: <MdFullscreen />, proporcao: proporcaoTela}
        this.state = {screen: this.small}
        document.addEventListener('fullscreenchange', (event) => {
            if (document.fullscreenElement) {
                this.setState({screen: this.full});
            } else {
                this.setState({screen: this.small});
            }
          });
    }

    toggleFullscreen () {        

        if (document.fullscreenElement) {
            document.exitFullscreen()
            .catch(function(error) {
                console.log(error.message);
            });
        } else {
            var element = document.getElementById('preview');

            element.requestFullscreen()
            .catch(function(error) {
                console.log(error.message);
            });
        }
    }
    
    render() {
        

        return (
            <div id='preview' style={{width: this.larguraTela*this.state.screen.proporcao, 
                                      height: this.alturaTela*this.state.screen.proporcao}}>
                <div className='tampao' style={this.props.slidePreview.estilo.tampao}></div>
                <Img imagem={this.props.slidePreview.estilo.fundo} />
                <div className='texto-preview' style={{fontSize: fonteBase.numero*this.state.screen.proporcao + fonteBase.unidade}}>
                    <div className='slide-titulo' style={this.props.slidePreview.estilo.titulo}>{this.props.slidePreview.titulo}</div>
                    <div id='paragrafo-slide' className='slide-paragrafo' style={this.props.slidePreview.estilo.paragrafo}>{this.props.slidePreview.texto}</div>
                </div>
                <button id='ativar-tela-cheia' onClick={this.toggleFullscreen.bind(this)}>{this.state.screen.icone}</button>
            </div>
        )
    }
}

const Img = ({imagem}) => (
    <>
        <img id='fundo-preview'  src={require('' + imagem)} alt='' />
    </>
);

const mapStateToProps = function (state) {
    return {slidePreview: state.slidePreview}
}

export default connect(mapStateToProps)(Preview);