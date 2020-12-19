import React, { Component } from 'react';
import { getNumeroVersiculo } from '../Preview/TextoPreview.jsx';
import { connect } from 'react-redux';

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

const getMaxHeight = props => {

    if(!props.elemento.colapsado) 
        return {maxHeight: '5vh'};
    return {maxHeight: 0, paddingTop: 0, paddingBottom: 0, marginTop: 0, marginBottom: 0}
}

class SublistaSlides extends Component {

    constructor (props) {
        super(props);
        this.state = {...props, estiloBloco: getMaxHeight(props)};
    }   

    getRotuloSlide = (elemento, slide) => {
        if(slide.eTitulo) return 'Título';
        var t0 = slide.textoArray.filter(t => !/\$\d\$/.test(t))[0] || '';
        switch (elemento.tipo) {
            case 'Imagem':
                return elemento.titulo || slide.imagem.alt;
            case 'TextoBíblico':
                return 'v. ' + (getNumeroVersiculo(t0).numero || '').padStart(2, 0);
            default:
                return t0.substr(0, 50);
        }
    }

    static getDerivedStateFromProps = (props, state) => {
        if(props.elemento.colapsado !== !state.estiloBloco.maxHeight)
            return {estiloBloco: getMaxHeight(props)};
        return null;
    }

    render () {
        //Se elemento tem múltiplos slides, cria subdivisão ol.
        var elemento = this.props.elemento;
        var i = this.props.ordem;
        var sel = this.props.selecionado;
        return (
            <div className='container-sublista'>
                <ol className='sublista'>
                    {elemento.slides.map((slide, j) => {
                        if (j === 0) return null; //Pula o slide 0, pois se tem múltiplos slides, o slide 0 é o mestre.
                        return (
                            <li className={'item-sublista ' + elemento.tipo + ' fade-estilizado ' +
                                        (this.props.selecionado.elemento === i && sel.slide === j ? 'selecionado' : '') + ' ' +
                                        (eEstiloVazio(slide.estilo) ? '' : 'elemento-slide-estilizado')
                                        }
                                ref={sel.slide === j ? this.props.refSlide : null}
                                onClick={() => this.props.marcarSelecionado(i, j)} key={j}
                                style={this.state.estiloBloco}>
                                {this.getRotuloSlide(elemento, slide)}
                            </li>
                        )
                    })}
                </ol>
            </div>
        );
    }
}

const mapState = function (state) {
    var sP = state.present;
    return {selecionado: sP.selecionado, elementos: sP.elementos}
}
  
export default connect(mapState)(SublistaSlides);