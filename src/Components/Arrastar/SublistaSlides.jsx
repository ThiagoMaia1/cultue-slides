import React, { Component } from 'react';
import { reverterSuperscrito } from '../Preview/TextoPreview.jsx';
import { connect } from 'react-redux';

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
            case 'Texto-Bíblico':
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
                        <li className={'item-sublista ' + elemento.tipo + ' ' +
                                       (this.props.selecionado.elemento === i && this.props.selecionado.slide === j ? 'selecionado' : '')}
                            onClick={() => this.props.marcarSelecionado(i, j)} key={j}>
                            {this.getRotuloSlide(elemento, slide)}
                        </li>
                    )
                })}
            </ol>
        );
    }
}

const mapStateToProps = function (state) {
    state = state.present;
    return {selecionado: state.selecionado, elementos: state.elementos}
}
  
export default connect(mapStateToProps)(SublistaSlides);