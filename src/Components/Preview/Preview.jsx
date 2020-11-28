import React, { Component } from 'react';
import { connect } from 'react-redux';
import { MdFullscreen, MdFullscreenExit } from 'react-icons/md';
import SlideFormatado from './SlideFormatado';
import { alturaTela } from './TamanhoTela/TamanhoTela';
import SelecionarRatio from './SelecionarRatio';

const full = {icone: <MdFullscreenExit className='icone-botao' size={100}/>, proporcao: 1, opacidadeBotao: '0%'}
export const small = {icone: <MdFullscreen className='icone-botao' size={60}/>, proporcao: 0.45, opacidadeBotao: '30%'}

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
        this.ref = React.createRef();
        this.state = {screen: this.props.slidePreviewFake ? 
            {...full, icone: <MdFullscreen className='icone-botao' size={100}/>} : 
            {...small}};

        document.addEventListener('fullscreenchange', () => {
            if (document.fullscreenElement) {
                if (this.props.slidePreview.eMestre) this.offsetSlide(1);
                this.setState({screen: {...full}});
            } else {
                this.setState({screen: {...small}});
            }
          });
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
        if (document.fullscreenElement) return;
        if (foraOuDentro) {
            if (foraOuDentro === 'fora' && !this.props.slidePreview.eMestre) {
                return;
            } else if(foraOuDentro === 'dentro' && this.props.slidePreview.eMestre) {
                return;
            }
        }
        return {boxShadow: (this.props.abaAtiva === aba ? '0px 0px 9px var(--azul-forte)' : ''), 
                    borderRadius: aba === 'tampao' ? 'var(--round-border-grande)' : 'var(--round-border-medio)'};        
    }

    getEstiloImagem = () => {
        var e = this.props.slidePreview.estilo.imagem;
        return {...this.realcarElemento('imagem'), height: e.height*100 + '%', width: e.width*100 + '%'}
    }

    editarTexto = e => {
        clearTimeout(this.timeoutEditar);
        this.timeoutEditar = setTimeout(div => {
            var dados = div.id.split('-');
            var [ objeto, numero ] = [ dados[1], dados[4] ]; 
            var objAction = {type: 'editar-slide', objeto: objeto, valor: div.innerHTML, redividir: true};
            if (numero) objAction.numero = numero;
            this.props.dispatch(objAction);
        }, 1000, e.target);
    }

    render() {
        var eMini = this.props.mini;
        var slidePreview = this.props.slidePreview;
        var proporcao = this.state.screen.proporcao;
        const telaCheia = proporcao === full.proporcao;
        return (
            <div id='borda-slide-mestre' style={{height: alturaTela*proporcao + 0.051*window.innerHeight, 
                                                        visibility: slidePreview.eMestre ? '' : 'hidden',
                                                        ...this.realcarElemento('tampao', 'fora')}}>
                <SelecionarRatio/>
                <SlideFormatado
                    proporcao={proporcao}
                    id='preview'
                    className='preview'
                    realcarElemento={this.realcarElemento}
                    referencia={this.ref}
                    editavel={!slidePreview.eMestre && this.props.autorizacao === 'editar' && !telaCheia}
                    slidePreview={slidePreview}
                    style={telaCheia ? {overflow: 'visible'} : null}
                >
                    {eMini ? null :
                        <>
                            <div className='container-setas' style={{display: telaCheia ? '' : 'none'}}>
                                <div className='movimentar-slide esquerda' onClick={() => this.offsetSlide(-1)}></div>
                                <div className='movimentar-slide direita' onClick={() => this.offsetSlide(1)}></div>
                            </div>
                            <button id='ativar-tela-cheia' onClick={() => toggleFullscreen(this.ref.current)} 
                                style={{opacity: this.state.screen.opacidadeBotao, color: slidePreview.estilo.texto.color, 
                                        width: 140*proporcao + 'px', height: 140*proporcao + 'px',
                                        right: 5.5*proporcao*0.7 + 'vh', bottom: 4.5*proporcao*0.7 + 'vh'}}
                                onMouseOver={this.tornarBotaoVisivel} onMouseLeave={this.tornarBotaoInvisivel}>
                                {this.state.screen.icone}
                            </button>
                        </>
                    }
                </SlideFormatado>
                {(!slidePreview.eMestre || eMini) ? null : 
                    <div id="texto-slide-mestre" style={{textAlign: 'center', paddingTop: '0.7vh'}}>
                        Slide-Mestre - {slidePreview.selecionado.elemento === 0 ? 'Global' : slidePreview.nomeLongoElemento}
                    </div>
                }
            </div>
        )
    }
}

const mapState = function (state) {
    return {slidePreview: state.slidePreview, abaAtiva: state.present.abaAtiva, autorizacao: state.present.apresentacao.autorizacao}
}

export default connect(mapState)(Preview);