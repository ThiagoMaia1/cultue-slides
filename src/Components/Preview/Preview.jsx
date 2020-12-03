import React, { Component } from 'react';
import { connect } from 'react-redux';
import { MdFullscreen, MdFullscreenExit } from 'react-icons/md';
import SlideFormatado from './SlideFormatado';
import SelecionarRatio from './SelecionarRatio';

const alturaTela = window.screen.height;
const larguraTela = window.screen.width;

export function toggleFullscreen (element = null) {        
    
    if (document.fullscreenElement || !element) {
        document.exitFullscreen()
        .catch(function(error) {
            console.log(error.message);
        });
    } else {
        element.requestFullscreen()
        .catch(function(error) {
            console.log(error.message);
        });
    }
}

class Preview extends Component {
    
    constructor(props) {
        super(props);
        this.full = {icone: <MdFullscreenExit className='icone-botao' size={80}/>, proporcao: 1, opacidadeBotao: '0%'}
        this.small = {icone: <MdFullscreen className='icone-botao' size={50}/>, proporcao: 0.45, opacidadeBotao: '30%'}
        this.ref = React.createRef();
        this.state = {screen: this.props.slidePreviewFake ? 
            {...this.full, icone: <MdFullscreen className='icone-botao' size={80}/>} : 
            {...this.small}};

        document.addEventListener('fullscreenchange', () => {
            if (document.fullscreenElement) {
                if (this.props.slidePreview.eMestre) this.offsetSlide(0);
                this.setState({screen: {...this.full}});
            } else {
                this.setState({screen: {...this.small}});
            }
          });
    }

    offsetSlide = offset => this.props.dispatch({type: 'offset-selecao', offset: offset})
    
    tornarBotaoVisivel = () => {
        this.setState({screen: {...this.state.screen, opacidadeBotao: '80%'}})
    }

    tornarBotaoInvisivel = () => {
        if (this.state.screen.proporcao === this.full.proporcao) {
            this.setState({screen: {...this.state.screen, opacidadeBotao: this.full.opacidadeBotao}})
        } else {
            this.setState({screen: {...this.state.screen, opacidadeBotao: this.small.opacidadeBotao}})    
        }
    }

    realcarElemento = (aba, foraOuDentro = null) => {
        if (document.fullscreenElement) return;
        if (foraOuDentro) {
            if (foraOuDentro === 'fora' && !this.props.slidePreview.eMestre) {
                return;
            } else if(foraOuDentro === 'dentro' && this.props.slidePreview.eMestre) {
                return;
            }
        }
        var ativa = this.props.abaAtiva === aba
        return {...(ativa ? {boxShadow: '0px 0px 9px var(--azul-forte)', transition: 'font-size 0.1s'} : {}), 
                borderRadius: aba === 'tampao' ? 'var(--round-border-grande)' : 'var(--round-border-medio)',
                
        };        
    }

    getEstiloImagem = () => {
        var e = this.props.slidePreview.estilo.imagem;
        return {...this.realcarElemento('imagem'), height: e.height*100 + '%', width: e.width*100 + '%'}
    }

    render() {
        var slidePreview = this.props.slidePreview;
        var proporcao = this.state.screen.proporcao*Math.min(alturaTela/this.props.ratio.height, larguraTela/this.props.ratio.width);
        const telaCheia = this.state.screen.proporcao === this.full.proporcao;
        return (
            <div id='borda-slide-mestre' ref={this.ref} 
                                         style={{height: this.props.ratio.height*proporcao + 0.051*window.innerHeight, 
                                         visibility: slidePreview.eMestre ? '' : 'hidden',
                                         padding: telaCheia ? '' : '1vh',
                                         ...this.realcarElemento('tampao', 'fora')}}>
                {telaCheia ? null : <SelecionarRatio/>}
                <div className='container-setas' style={{visibility: 'visible', display: telaCheia ? '' : 'none'}}>
                    <div className='movimentar-slide esquerda' onClick={() => this.offsetSlide(-1)}></div>
                    <div className='movimentar-slide direita' onClick={() => this.offsetSlide(1)}></div>
                </div>
                <SlideFormatado
                    proporcao={proporcao}
                    id='preview'
                    className={'preview' + (telaCheia ? ' sem-transition' : '')} 
                    realcarElemento={this.realcarElemento}
                    editavel={!slidePreview.eMestre && this.props.autorizacao === 'editar' && !telaCheia}
                    slidePreview={slidePreview}
                    style={telaCheia ? {overflow: 'visible'} : null}>
                    <button id='ativar-tela-cheia' onClick={() => toggleFullscreen(this.ref.current)} 
                        style={{opacity: this.state.screen.opacidadeBotao, color: slidePreview.estilo.texto.color, 
                                right: '1vh', bottom: '0.5vh'}}
                        onMouseOver={this.tornarBotaoVisivel} onMouseLeave={this.tornarBotaoInvisivel}>
                        {this.state.screen.icone}
                    </button>
                </SlideFormatado>
                {(!slidePreview.eMestre) ? null : 
                    <div id="texto-slide-mestre" style={{textAlign: 'center', paddingTop: '0.7vh'}}>
                        Slide-Mestre - {slidePreview.selecionado.elemento === 0 ? 'Global' : slidePreview.nomeLongoElemento}
                    </div>
                }
            </div>
        )
    }
}

const mapState = function (state) {
    const sP = state.present;
    return {slidePreview: state.slidePreview, abaAtiva: sP.abaAtiva, autorizacao: sP.apresentacao.autorizacao, ratio: sP.ratio}
}

export default connect(mapState)(Preview);