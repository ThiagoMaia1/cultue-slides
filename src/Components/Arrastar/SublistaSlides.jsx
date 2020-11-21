import React, { Component } from 'react';
import { reverterSuperscrito } from '../Preview/TextoPreview.jsx';
import { connect } from 'react-redux';
// import { Estilo } from '../../Element';

// const estiloVazio = JSON.stringify(new Estilo());
const eEstiloVazio = estilo => {
    var keysEstilo = Object.keys(estilo);
    for (var k of keysEstilo) {
        var keysObjeto = Object.keys(estilo[k]).filter(k => k !== 'paddingBottom');
        for (var kO of keysObjeto) {
            if (estilo[k][kO]) {
                return false;
            }
        }
    }
    return true;
}

class SublistaSlides extends Component {

    constructor (props) {
        super(props);
        this.state = {...props};
    }

    getRotuloSlide = (elemento, slide) => {
        var t0 = slide.textoArray.filter(t => !/\$\d\$/.test(t))[0] || '';
        switch (elemento.tipo) {
            case 'Imagem':
                return elemento.titulo || slide.imagem.alt;
            case 'TextoBíblico':
                var n = 0;
                var palavras = t0.split(' ');
                do {
                    var verso = reverterSuperscrito(palavras[n]);
                    n++;
                } while (isNaN(verso))
                return 'v. ' + verso.padStart(2, 0);
            default:
                return t0.substr(0, 50);
        }
    }

    render () {
        //Se elemento tem múltiplos slides, cria subdivisão ol.
        var elemento = this.props.elemento;
        var i = this.props.ordem;
        return (
            <ol className='sublista'>
                {elemento.slides.map((slide, j) => {
                    if (j === 0) return null; //Pula o slide 0, pois se tem múltiplos slides, o slide 0 é o mestre.
                    return (
                        <li className={'item-sublista ' + elemento.tipo + ' fade-estilizado ' +
                                       (this.props.selecionado.elemento === i && this.props.selecionado.slide === j ? 'selecionado' : '') + ' ' +
                                       (eEstiloVazio(slide.estilo) ? '' : 'elemento-slide-estilizado')
                                    }
                            onClick={() => this.props.marcarSelecionado(i, j)} key={j}>
                            {this.getRotuloSlide(elemento, slide)}
                        </li>
                    )
                })}
            </ol>
        );
    }
}

const mapState = function (state) {
    var sP = state.present;
    return {selecionado: sP.selecionado, elementos: sP.elementos}
}
  
export default connect(mapState)(SublistaSlides);