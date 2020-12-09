import React, { Component } from 'react';
import './style.css';
import { connect } from 'react-redux';
import Estrofes from './Estrofes';
import { getFonteBase } from '../../Element';
import { getPathImagem } from './Img';
import { limparHighlights } from '../BarraPesquisa/BarraPesquisa';
import { markupParaSuperscrito } from '../Preview/TextoPreview';
import { ratioPadrao } from '../../firestore/apresentacoesBD';


class SlideFormatado extends Component {
    
    constructor (props) {
        super(props);
        var realcarElemento = () => {};
        this.realcarElemento = props.realcarElemento || realcarElemento;
    }

    getEstiloImagem = () => {
        var e = this.props.slidePreview.estilo.imagem;
        return {...this.realcarElemento('imagem'), height: e.height, width: e.width};
    }
    
    editarTexto = e => {
        clearTimeout(this.timeoutEditar);
        this.timeoutEditar = setTimeout(div => {
            var dados = div.id.split('-');
            var [ objeto, numero ] = [ dados[0], dados[1] ]; 
            var objAction = {
                type: 'editar-slide', 
                objeto: objeto, 
                valor: markupParaSuperscrito(limparHighlights(div.innerHTML)), 
                redividir: true, 
                selecionado: this.props.selecionado
            };
            if (numero) objAction.numero = numero;
            this.props.dispatch(objAction);
        }, 1000, e.target);
    }

    
    ativarRealce = aba => this.props.dispatch({type: 'ativar-realce', abaAtiva: aba});

    getClasseLetraClara = nomeObjeto => {
        var cor = this.props.slidePreview.estilo[nomeObjeto].color;
        if (!cor) return '';
        var eClara = true;
        var partesCor = cor.length === 7 
                        ? [cor.slice(1,3), cor.slice(3, 5), cor.slice(5)]
                        : [cor.slice(1,2), cor.slice(2,3), cor.slice(3,4)].map(c => c.repeat(2));
        for (var p of partesCor) {
            if (parseInt('0x' + p) < 210) {
                eClara = false;
                break;
            }
        }
        return eClara ? 'letra-clara' : '';   
    }

    render() {
        var slidePreview = this.props.slidePreview;
        var proporcao = this.props.proporcao;
        var proporcaoTela = proporcao*this.props.ratio.width/ratioPadrao.width;
        var sel = this.props.selecionado;
        return (
                <div ref={this.props.referencia} 
                     id={this.props.id} 
                     className={this.props.className}
                     style={{width: this.props.ratio.width*proporcao, 
                             height: this.props.ratio.height*proporcao,
                             ...this.realcarElemento('tampao', 'dentro'),
                             ...this.props.style}}>
                    <div className='tampao' style={slidePreview.estilo.tampao}></div>
                    <Img imagem={slidePreview.estilo.fundo} proporcao={proporcaoTela}/>
                    <div className='texto-preview' style={{fontSize: getFonteBase().numero*proporcao + getFonteBase().unidade}}>
                        <div className={'slide-titulo ' + this.getClasseLetraClara('titulo')} style={slidePreview.estilo.titulo}>
                            <div><span key={sel.elemento + '.' + sel.slide} id='textoTitulo' onInput={this.editarTexto} onFocus={() => this.ativarRealce('titulo')} 
                                contentEditable={this.props.editavel} suppressContentEditableWarning='true'
                                style={this.realcarElemento('titulo')}>{slidePreview.titulo}</span></div>
                        </div>
                        <div id='paragrafo-slide' className={'slide-paragrafo ' + this.getClasseLetraClara('paragrafo')} style={slidePreview.estilo.paragrafo}>
                            <div style={this.realcarElemento('paragrafo')} 
                                 className={'realce-paragrafo ' + (slidePreview.estilo.paragrafo.duasColunas ? 'dividido-colunas' : '')}>
                                {<Estrofes slidePreview={slidePreview} onInput={this.editarTexto} ativarRealce={this.ativarRealce} editavel={this.props.editavel}
                                           selecionado={sel}/>}
                            </div>
                        </div>
                    </div>
                    {slidePreview.imagem ? 
                        <div className='div-imagem-slide' style={{padding: slidePreview.estilo.imagem.padding}}>
                            <img className='imagem-slide' src={slidePreview.imagem.src} alt={slidePreview.imagem.alt}
                                 style={this.getEstiloImagem()}/>
                        </div>: 
                        null}
                    {this.props.children}
                </div>
        )
    }
}

const ImgNormal = ({urlImgs, id}) => (
    <div id={id} className='imagem-fundo-preview' style={{backgroundImage: urlImgs}} />
)

const Img = ({imagem, proporcao}) => {
    var urlImgs = '';
    if (imagem.src) {
        urlImgs = 'url("' + imagem.src + '")';
    } else if(imagem.path) {
        var pixeis = [[300, 0], [600, 0.3], [null, 0.65]];
        urlImgs = pixeis.reverse().reduce((resultado, px, i) => {
            if(px[1] < proporcao) 
                resultado.push('url("' + require('' + getPathImagem(imagem.path, px[0])) + '")');
            return resultado;            
        }, []).join(', ');
    }
    return <ImgNormal urlImgs={urlImgs}/>
};

const mapState = function (state) {
    const sP = state.present;
    return {abaAtiva: sP.abaAtiva, ratio: sP.ratio, selecionado: sP.selecionado}
}

export default connect(mapState)(SlideFormatado);