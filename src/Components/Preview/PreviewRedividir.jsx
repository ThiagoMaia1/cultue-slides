import React, {Component} from 'react';
import { connect } from 'react-redux'; 
import { getSlidePreview } from '../MenuExportacao/Exportador';
import SlideFormatado from './SlideFormatado';
import { marcarEstrofesRepetidas, textoMestre, newEstilo} from '../../principais/Element';

const getSlideTitulo = estiloMestre => ({
    textoArray: [],
    estilo: {...estiloMestre, titulo: {...estiloMestre.titulo, height: 1, display: null}},
    eTitulo: true
})

class PreviewRedividir extends Component {

    constructor(props) {
        super(props);
        let {elementos, dados} = props;
        this.tempoInicial = new Date().getTime();
        let {nSlide, elemento, texto, estiloMestre, nElemento} = dados;
        this.elemento = elemento;
        this.elementos = elementos;
        this.selecionado = {slide: nSlide};
        this.contador = 0;
        
        estiloMestre = estiloMestre || this.elemento.slides[0].estilo;
        
        if (elemento.slides[this.selecionado.slide].eMestre) this.selecionado.slide++;
        
        this.acrescentarSlide();
        
        if(nElemento === undefined) {
            this.elementos = [...elementos, elemento];
            this.selecionado.elemento = elementos.length-1;
        } else this.selecionado.elemento = nElemento;
        
        this.getPreview();

        let isolarTitulo = this.slidePreview.estilo.titulo.isolar;
        if (isolarTitulo) { 
            this.selecionado.slide = Math.max(2, this.selecionado.slide);
            if (elemento.slides.length === 1 || !elemento.slides[1].eTitulo) 
                elemento.slides.splice(1, 0, getSlideTitulo(estiloMestre));
        } else {
            for (let i = 0; i < elemento.slides.length; i++) {
                if (elemento.slides[i].eTitulo) {
                    elemento.slides.splice(i, 1);
                    this.selecionado.slide = this.selecionado.slide -1;
                    break;
                }
            }
        }

        if (elemento.tipo === 'Música' && this.slidePreview.estilo.paragrafo.omitirRepeticoes) 
            texto = marcarEstrofesRepetidas(texto);
        this.texto = texto;
        
        this.ref1 = React.createRef();
        this.ref2 = React.createRef();
        this.state = {lenTexto: 1};
    }

    medir = () => {
        let {dados, atualizarDados, substituirSlides} = this.props;
        const lenTotal = this.props.dados.texto.length;
        if(this.contador > 2*lenTotal) {
            atualizarDados(null);
            return;
        }
        let {nElemento, elemento, estiloMestre} = dados;
        let {lenTexto} = this.state;
        let texto = this.texto.slice(0, lenTexto);
        let finalizou = lenTexto === this.texto.length;
        let alturaP = this.ref2.current.getBoundingClientRect().height;
        let falta = this.alturaQ - alturaP;
        if((this.falta && Math.sign(falta) !== Math.sign(this.falta)) || (this.falta > 0 && lenTexto === 1))
            this.passou = true;
        this.falta = falta;
        // console.log('alturas', this.ref1.current.getBoundingClientRect().height, this.ref2.current.getBoundingClientRect().height)
        if (this.passou || finalizou) {
            if (!finalizou && !this.alturaConfirmada)
            if (!finalizou && lenTexto > 1 && this.falta < 0) texto.pop();
            elemento.slides[this.selecionado.slide].textoArray = texto;
            if (finalizou) {
                elemento.slides = elemento.slides.slice(0, this.selecionado.slide+1);
                if (elemento.slides.length > 1 && !elemento.slides[0].eMestre) {
                    elemento.slides.unshift({
                        estilo: {...estiloMestre}, 
                        textoArray: [textoMestre], 
                        eMestre: true
                    });
                    elemento.slides[1].estilo = {...newEstilo()};
                } else if (elemento.slides.length === 2 && elemento.slides[0].eMestre) {
                    elemento.slides[1].estilo = {...elemento.slides[0].estilo, ...elemento.slides[1].estilo};
                    elemento.slides.shift();
                }
                if (nElemento !== undefined) 
                    substituirSlides({slides: elemento.slides, nElemento});
                console.log(new Date().getTime() - this.tempoInicial)
                atualizarDados(null);   
            } else {      
                this.selecionado.slide++;
                this.acrescentarSlide();
                this.getPreview();
                this.texto = this.texto.slice(lenTexto + (this.falta > 0 ? 0 : -1));
                this.setLenTexto(this.getLenEstimada());
                this.passou = false;
                this.falta = 0;
            }
        } else {
            let novoLen = lenTexto;
            if (this.falta > 0) novoLen++;
            else novoLen--;
            this.setLenTexto(novoLen);
        }
    }

    getLenEstimada = () => Math.min(Math.floor(this.alturaQ/this.altura1), this.texto.length);

    componentDidMount = () => {
        if (!this.altura1) this.altura1 = this.ref2.current.getBoundingClientRect().height;
        if (!this.alturaQ) this.alturaQ = this.ref1.current.getBoundingClientRect().height;
        this.setLenTexto(this.getLenEstimada());
        this.medir();
    }

    componentDidUpdate = (prevProps, prevState) => {
        if(this.props.dados.nSlide === prevProps.dados.nSlide && prevState.lenTexto === this.state.lenTexto) return;
        this.contador++;
        this.medir();
    }
    
    acrescentarSlide = () => {
        if (this.selecionado.slide === this.elemento.slides.length)
            this.elemento.slides.push({ estilo: { ...newEstilo() }, textoArray: [] });
    }

    setLenTexto = lenTexto => {
        setTimeout(() => this.setState({lenTexto}), 0)
    }

    getPreview = () => {
        let {elementos, selecionado} = this;
        this.slidePreview = getSlidePreview({
            elementos,
            selecionado,
            previewRedividir: true
        });
    }

    render () {
        let slidePreview = {...this.slidePreview, textoArray: this.texto.slice(0, this.state.lenTexto)};
        return ( 
            <div id='container-preview-redividir' className='container-preview-invisivel'> 
                <SlideFormatado 
                    slidePreview={slidePreview}
                    className='preview-fake'
                    editavel={false}
                    proporcao={0.1}
                    ref1={this.ref1}
                    ref2={this.ref2}
                    previewRedividir={true}
                />
            </div>
        )
    }
}

const mapState = state => ({
    dados: state.present.dadosRedividir,
    elementos: state.present.elementos
});

const mapDispatch = dispatch => ({
    atualizarDados: dados => dispatch({type: 'atualizar-dados-redividir', dados}),
    substituirSlides: ({slides, nElemento}) => dispatch({type: 'editar-slide', objeto: 'slides', slides, selecionado: {elemento: nElemento, slide: 0}})
})

export default connect(mapState, mapDispatch)(PreviewRedividir);