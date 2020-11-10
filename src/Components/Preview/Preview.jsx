import React, { Component } from 'react';
import './style.css';
import { connect } from 'react-redux';
import { MdFullscreen, MdFullscreenExit } from 'react-icons/md';
import Estrofes from './Estrofes';

const wWidth = window.screen.width;
const wHeight = window.screen.height;
export const larguraTela = Math.max(wWidth, wHeight);
export const alturaTela = Math.min(wWidth, wHeight);

export const fonteBase = {numero: 0.025*alturaTela, unidade: 'px', fontFamily: 'Noto Sans'};
const full = {icone: <MdFullscreenExit className='icone-botao' size={140}/>, proporcao: 1, opacidadeBotao: '0%'}
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
        if (foraOuDentro) {
            if (foraOuDentro === 'fora' && !this.props.slidePreview.eMestre) {
                return;
            } else if(foraOuDentro === 'dentro' && this.props.slidePreview.eMestre) {
                return;
            }
        }
        return {boxShadow: (this.props.abaAtiva === aba && this.state.screen.proporcao === small.proporcao ? '0px 0px 9px var(--azul-forte)' : ''), 
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

    ativarRealce = e => {
        var aba = e.target.id.split('-')[0].replace('textoTitulo', 'titulo');
        this.props.dispatch({type: 'ativar-realce', abaAtiva: aba});
    }

    render() {
        var eFake = !!this.props.slidePreviewFake;
        var eMini = this.props.mini;
        var slidePreview = this.props.slidePreviewFake || this.props.slidePreview;
        var sel = slidePreview.selecionado;
        var proporcao = eMini ? 0.08 : this.state.screen.proporcao;
        return (
            <div className='borda-slide-mestre' style={{height: this.alturaTela*proporcao + 0.051*window.innerHeight, 
                                                        visibility: (slidePreview.eMestre && !eMini) ? '' : 'hidden',
                                                        position: (eFake && !eMini) ? 'absolute' : '',
                                                        padding: eFake ? '0' : '',
                                                        ...this.realcarElemento('tampao', 'fora')}}>
                <div ref={this.ref} id={'preview' + (eFake ? '-fake' + slidePreview.indice : '')} 
                     className={(eFake ? 'preview-fake ' : '') + (slidePreview.indice === 0 ? 'slide-ativo' : '')}
                     style={{width: larguraTela*proporcao, 
                            height: alturaTela*proporcao,
                            visibility: eMini ? 'visible' : '',
                            ...this.realcarElemento('tampao', 'dentro')}}>
                    <div className='tampao' style={slidePreview.estilo.tampao}></div>
                    <Img imagem={slidePreview.estilo.fundo} />
                    <div className='texto-preview' style={{fontSize: fonteBase.numero*proporcao + fonteBase.unidade}}>
                        <div className='slide-titulo' style={slidePreview.estilo.titulo}>
                            <div><span id='textoTitulo' onInput={this.editarTexto} onFocus={this.ativarRealce} 
                                contentEditable={!this.props.elementos[this.props.nElemento].eMestre && !eFake}
                                style={this.realcarElemento('titulo')}>{slidePreview.titulo}</span></div>
                        </div>
                        <div id='paragrafo-slide' className='slide-paragrafo' style={slidePreview.estilo.paragrafo}>
                            <div style={{...this.realcarElemento('paragrafo')}} 
                                 className={'realce-paragrafo ' + (slidePreview.estilo.paragrafo.duasColunas ? 'dividido-colunas' : '')}>
                                {<Estrofes selecionado={sel} slidePreview={slidePreview} onInput={this.editarTexto} onFocus={this.ativarRealce} eFake={eFake}/>}
                            </div>
                        </div>
                    </div>
                    {slidePreview.imagem ? 
                        <div className='div-imagem-slide' style={{padding: slidePreview.estilo.imagem.padding*100 + '%'}}>
                            <img className='imagem-slide' src={slidePreview.imagem.src} alt={slidePreview.imagem.alt}
                                 style={this.getEstiloImagem()}/>
                        </div>: 
                        null}
                    {eMini ? null :
                        <>
                            <div className='container-setas' style={{display: proporcao === small.proporcao ? 'none' : ''}}>
                                <div className='movimentar-slide esquerda' onClick={() => this.offsetSlide(-1)}></div>
                                <div className='movimentar-slide direita' onClick={() => this.offsetSlide(1)}></div>
                            </div>
                            <button id='ativar-tela-cheia' onClick={() => toggleFullscreen(this.ref.current)} 
                                style={{opacity: this.state.screen.opacidadeBotao, color: slidePreview.estilo.texto.color, 
                                        width: 140*proporcao + 'px', height: 140*proporcao + 'px',
                                        right: 7.5*proporcao + 'vh', bottom: 6.5*proporcao + 'vh'}}
                                onMouseOver={this.tornarBotaoVisivel} onMouseLeave={this.tornarBotaoInvisivel}>
                                {this.state.screen.icone}
                            </button>
                        </>
                    }
                </div>
                {(!slidePreview.eMestre || eMini) ? null : 
                    <div id="texto-slide-mestre" style={{textAlign: 'center', paddingTop: '0.7vh'}}>
                        Slide-Mestre - {slidePreview.selecionado.elemento === 0 ? 'Global' : slidePreview.nomeLongoElemento}
                    </div>
                }
            </div>
        )
    }
}

const Img = ({imagem}) => {
    if (imagem.src.substr(0, 4) === 'blob') {
        return <img id='fundo-preview' src={imagem.src} alt='' />
    } else {
        return <img id='fundo-preview' src={require('' + imagem.src)} alt='' />
    }
};

const mapStateToProps = function (state) {
    return {slidePreview: state.slidePreview, abaAtiva: state.present.abaAtiva, elementos: state.present.elementos, nElemento: state.present.selecionado.elemento}
}

export default connect(mapStateToProps)(Preview);