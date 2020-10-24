import React, { Component } from 'react';
import './style.css';
import { connect } from 'react-redux';
import { MdFullscreen, MdFullscreenExit } from 'react-icons/md'

export const fonteBase = {numero: 0.015*window.screen.width, unidade: 'px', fontFamily: 'Noto Sans'};
const full = {icone: <MdFullscreenExit className='icone-botao' size={140}/>, proporcao: 1, opacidadeBotao: '0%'}
const small = {icone: <MdFullscreen className='icone-botao' size={60}/>, proporcao: 0.4, opacidadeBotao: '30%'}

class Preview extends Component {
    
    constructor(props) {
        super(props);
        var wWidth = window.screen.width;
        var wHeight = window.screen.height;
        this.larguraTela = Math.max(wWidth, wHeight);
        this.alturaTela = Math.min(wWidth, wHeight);
        this.state = {screen: {...small}}
        document.addEventListener('fullscreenchange', () => {
            if (document.fullscreenElement) {
                if (this.props.slidePreview.eMestre) this.offsetSlide(1);
                this.setState({screen: {...full}});
            } else {
                this.setState({screen: {...small}});
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

    offsetSlide = offset => this.props.dispatch({type: 'offset-selecao', offset: offset})
    
    tornarBotaoVisivel = () => {
        this.setState({screen: {...this.state.screen, opacidadeBotao: '80%'}})
    }

    tornarBotaoInvisivel = () => {
        if (this.state.screen.proporcao === full.proporcao) {
            this.setState({screen: {...this.state.screen, opacidadeBotao: full.opacidadeBotao}})
        } else {
            this.setState({screen: {...this.state.screen, opacidadeBotao: small.opacidadeBotao}})    
        }
    }

    realcarElemento = (aba, foraOuDentro = null) => {
        if (foraOuDentro) {
            if (foraOuDentro === 'fora' && !this.props.slidePreview.eMestre) {
                return;
            } else if(foraOuDentro === 'dentro' && this.props.slidePreview.eMestre) {
                return;
            }
        }
        return {boxShadow: (this.props.realce.aba === aba && this.state.screen.proporcao === small.proporcao ? '0px 0px 9px ' + this.props.realce.cor : ''), 
                    borderRadius: aba === 'tampao' ? 'var(--round-border-grande)' : 'var(--round-border-medio)', marginTop: '2px'};        
    }

    render() {
        

        return (
            <div className='borda-slide-mestre' style={{height: this.alturaTela*this.state.screen.proporcao + 50, 
                                                        visibility: this.props.slidePreview.eMestre ? '' : 'hidden', 
                                                        ...this.realcarElemento('tampao', 'fora')}}>
                <div id='preview' style={{width: this.larguraTela*this.state.screen.proporcao, 
                                        height: this.alturaTela*this.state.screen.proporcao,
                                        ...this.realcarElemento('tampao', 'dentro')}}>
                    <div className='tampao' style={this.props.slidePreview.estilo.tampao}>
                                    
                    </div>
                    {this.props.marcaDagua}
                    <Img imagem={this.props.slidePreview.estilo.fundo} />
                    <div className='texto-preview' style={{fontSize: fonteBase.numero*this.state.screen.proporcao + fonteBase.unidade}}>
                        <div className='slide-titulo' style={this.props.slidePreview.estilo.titulo}>
                            <div><span style={this.realcarElemento('titulo')}>{this.props.slidePreview.titulo}</span></div>
                        </div>
                        <div id='paragrafo-slide' className='slide-paragrafo' style={this.props.slidePreview.estilo.paragrafo}>
                            <div style={this.realcarElemento('paragrafo')}>{this.props.slidePreview.texto}</div>
                        </div>
                    </div>
                    {this.props.slidePreview.imagem ? 
                        <div className='div-imagem-slide' style={this.props.slidePreview.estilo.imagem}>
                            <img className='imagem-slide' src={this.props.slidePreview.imagem.src} alt={this.props.slidePreview.imagem.alt}/>
                        </div>: 
                        null}
                    <div className='container-setas'>
                        <div className='movimentar-slide' onClick={() => this.offsetSlide(-1)}></div>
                        <div className='movimentar-slide' onClick={() => this.offsetSlide(1)}></div>
                    </div>
                    <button id='ativar-tela-cheia' onClick={this.toggleFullscreen.bind(this)} 
                        style={{opacity: this.state.screen.opacidadeBotao, color: this.props.slidePreview.estilo.texto.color, 
                                width: 140*this.state.screen.proporcao + 'px', height: 140*this.state.screen.proporcao + 'px',
                                right: 7.5*this.state.screen.proporcao + 'vh', bottom: 6.5*this.state.screen.proporcao + 'vh'}}
                        onMouseOver={this.tornarBotaoVisivel} onMouseLeave={this.tornarBotaoInvisivel}>
                        {this.state.screen.icone}
                    </button>
                </div>
                <div style={{textAlign: 'center', paddingTop: '0.7vh'}}>Slide-Mestre - {this.props.slidePreview.selecionado.elemento === 0 ? 'Global' : this.props.slidePreview.nomeLongoElemento}</div>
            </div>
        )
    }
}

const Img = ({imagem}) => (
    <>
        <img id='fundo-preview' src={require('' + imagem)} alt='' />
    </>
);

const mapStateToProps = function (state) {
    return {slidePreview: state.slidePreview, realce: state.realce}
    
}

export default connect(mapStateToProps)(Preview);