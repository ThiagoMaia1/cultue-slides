import React, { Component } from 'react';
import './style.css';
import { connect } from 'react-redux';
import Estrofes from './Estrofes';
import { getFonteBase } from '../../Element';

class SlideFormatado extends Component {
    
    constructor (props) {
        super(props);
        var realcarElemento = () => {};
        this.realcarElemento = props.realcarElemento || realcarElemento;
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

    
    ativarRealce = aba => this.props.dispatch({type: 'ativar-realce', abaAtiva: aba});

    render() {
        var slidePreview = this.props.slidePreview;
        var proporcao = this.props.proporcao;
        return (
                <div ref={this.props.referencia} 
                     id={this.props.id} 
                     className={this.props.className}
                     style={{width: this.props.ratio.width*proporcao, 
                             height: this.props.ratio.height*proporcao,
                             ...this.realcarElemento('tampao', 'dentro'),
                             ...this.props.style}}>
                    <div className='tampao' style={slidePreview.estilo.tampao}></div>
                    <Img imagem={slidePreview.estilo.fundo} />
                    <div className='texto-preview' style={{fontSize: getFonteBase().numero*proporcao + getFonteBase().unidade}}>
                        <div className='slide-titulo' style={slidePreview.estilo.titulo}>
                            <div><span id='textoTitulo' onInput={this.editarTexto} onFocus={() => this.ativarRealce('titulo')} 
                                contentEditable={this.props.editavel}
                                style={this.realcarElemento('titulo')}>{slidePreview.titulo}</span></div>
                        </div>
                        <div id='paragrafo-slide' className='slide-paragrafo' style={slidePreview.estilo.paragrafo}>
                            <div style={this.realcarElemento('paragrafo')} 
                                 className={'realce-paragrafo ' + (slidePreview.estilo.paragrafo.duasColunas ? 'dividido-colunas' : '')}>
                                {<Estrofes slidePreview={slidePreview} onInput={this.editarTexto} ativarRealce={this.ativarRealce} editavel={this.props.editavel}/>}
                            </div>
                        </div>
                    </div>
                    {slidePreview.imagem ? 
                        <div className='div-imagem-slide' style={{padding: slidePreview.estilo.imagem.padding*100 + '%'}}>
                            <img className='imagem-slide' src={slidePreview.imagem.src} alt={slidePreview.imagem.alt}
                                 style={this.getEstiloImagem()}/>
                        </div>: 
                        null}
                    {this.props.children}
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

const mapState = function (state) {
    const sP = state.present;
    return {abaAtiva: sP.abaAtiva, ratio: sP.ratio}
}

export default connect(mapState)(SlideFormatado);