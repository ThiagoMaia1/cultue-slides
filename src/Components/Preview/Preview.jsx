import React, { Component } from 'react';
import { connect } from 'react-redux';
import { MdFullscreen, MdFullscreenExit } from 'react-icons/md';
import SlideFormatado from './SlideFormatado';
import SelecionarRatio from './SelecionarRatio';
import { objetosSaoIguais } from '../../principais/FuncoesGerais';
import { ratioTela } from '../../principais/firestore/apresentacoesBD';
import hotkeys from 'hotkeys-js';

class Preview extends Component {
    
    constructor(props) {
        super(props);
        this.full = {icone: <MdFullscreenExit className='icone-botao' size={80}/>, proporcao: 1, opacidadeBotao: '0%'}
        this.small = {icone: <MdFullscreen className='icone-botao' size={50}/>, proporcao: 0.47, opacidadeBotao: '30%'}
        this.state = {transitionAtivo: true, corBloqueador: '', screen: this.props.slidePreviewFake ? 
            {...this.full, icone: <MdFullscreen className='icone-botao' size={80}/>} : 
            {...this.small}};

        document.addEventListener('fullscreenchange', () => {
            var modoApresentacao = !!document.fullscreenElement;
            if (modoApresentacao !== this.props.modoApresentacao) 
                this.props.dispatch({type: 'definir-modo-apresentacao', modoApresentacao})
            if (modoApresentacao) {
                if (this.props.slidePreview.eMestre) this.offsetSlide(0);
                this.setState({screen: {...this.full}});
            } else {
                this.setState({screen: {...this.small}});
            }
        });
        this.definirAtalhos();
    }

    definirAtalhos = () => {
        hotkeys('b,w,enter,space,backspace,esc,up,left,down,right', 'apresentacao', (e, handler) => {
            e.preventDefault();
            switch (handler.key) {
                case 'right':
                case 'down':
                case 'enter':
                case 'space':
                    this.props.dispatch({type: 'offset-selecao', offset: 1});
                    break;
                case 'left':
                case 'up':
                case 'backspace':
                    this.props.dispatch({type: 'offset-selecao', offset: -1});
                    break;
                case 'esc': 
                    this.props.dispatch({type: 'definir-modo-apresentacao', modoApresentacao: false})
                    break;
                case 'b':
                    this.setCorBloqueador('black');
                    break;
                case 'w':                    
                    this.setCorBloqueador('white');
                    break;
                default:
                    return;
            }
        });
    }    

    setCorBloqueador = cor => {
        this.setState({corBloqueador: this.state.corBloqueador === cor ? null : cor});
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

    componentDidUpdate = prevProps => {
        if (!objetosSaoIguais(this.props.selecionado, prevProps.selecionado)) {
            this.setState({transitionAtivo: false});
            setTimeout(() => this.setState({transitionAtivo: true}), 1000);
        }
        if (this.props.modoApresentacao !== prevProps.modoApresentacao) {
        }
    }

    definirModoApresentacao = () => {
        this.props.dispatch({type: 'definir-modo-apresentacao'})
    }

    render() {
        var slidePreview = this.props.slidePreview;
        var proporcao = this.state.screen.proporcao*Math.min(ratioTela.height/this.props.ratio.height, ratioTela.width/this.props.ratio.width);
        const telaCheia = this.state.screen.proporcao === this.full.proporcao;
        const transition = this.state.transitionAtivo && !telaCheia; 
        const eMestre = slidePreview.eMestre;
        return (
            <div id='centralizador-preview'>
                <div id='borda-slide-mestre' style={{height: this.props.ratio.height*proporcao + 0.051*window.innerHeight, 
                                             visibility: eMestre ? '' : 'hidden',
                                             padding: telaCheia ? '' : '1vh',
                                             ...this.realcarElemento('tampao', 'fora')}}>
                    {telaCheia ? null : <SelecionarRatio/>}
                    {!this.state.corBloqueador || !telaCheia ? null :
                        <div className='bloqueador-apresentacao' style={{backgroundColor: this.state.corBloqueador}}></div>
                    }
                    <div className='container-setas' style={{visibility: 'visible', display: telaCheia ? '' : 'none'}}>
                        <div className='movimentar-slide esquerda' onClick={() => this.offsetSlide(-1)}></div>
                        <div className='movimentar-slide direita' onClick={() => this.offsetSlide(1)}></div>
                    </div>
                    <SlideFormatado
                        proporcao={proporcao}
                        id='preview'
                        className={'preview' + (!transition ? ' sem-transition' : '')} 
                        realcarElemento={this.realcarElemento}
                        editavel={!eMestre && this.props.autorizacao === 'editar' && !telaCheia}
                        slidePreview={slidePreview}
                        style={telaCheia ? {overflow: 'visible'} : null}>
                        <button id='ativar-tela-cheia' onClick={this.definirModoApresentacao} 
                            style={{opacity: this.state.screen.opacidadeBotao, color: slidePreview.estilo.texto.color, 
                                    right: '1vh', bottom: '0.5vh'}}
                            onMouseOver={this.tornarBotaoVisivel} onMouseLeave={this.tornarBotaoInvisivel}>
                            {this.state.screen.icone}
                        </button>
                    </SlideFormatado>
                    {telaCheia && !eMestre ? null
                        : <div id="texto-slide-mestre" 
                               style={{textAlign: 'center', ...(telaCheia ? {padding: '1vh 0', fontSize: '110%'} : {paddingTop: '0.7vh'}), 
                                       maxWidth: proporcao*this.props.ratio.width}}>
                            Slide-Mestre - {slidePreview.selecionado.elemento === 0 ? 'Global' : slidePreview.nomeLongoElemento}
                        </div>
                    }
                </div>
            </div>
        )
    }
}

const mapState = function (state) {
    const sP = state.present;
    return {
        slidePreview: state.slidePreview, 
        abaAtiva: sP.abaAtiva, 
        autorizacao: sP.apresentacao.autorizacao,
        ratio: sP.ratio, 
        selecionado: sP.selecionado,
        modoApresentacao: sP.modoApresentacao
    }
}

export default connect(mapState)(Preview);