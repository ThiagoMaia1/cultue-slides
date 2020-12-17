import React from 'react';
import { connect } from 'react-redux';
import './SelecionarRatio.css';
import { BsAspectRatio } from 'react-icons/bs';
import { ratioTela } from '../../principais/firestore/apresentacoesBD';

let opcoesRatioDesordenadas = [
    {width: 1024, height: 768}
   ,{width: 1280, height: 800}
   ,{width: 1400, height: 1050}
   ,{width: 1920, height: 1080}
   ,{width: 1920, height: 1200}
];

opcoesRatioDesordenadas = opcoesRatioDesordenadas.filter(o => o.width !== ratioTela.width || o.height !== ratioTela.height);

const opcoesRatio = [...opcoesRatioDesordenadas, ratioTela].sort((a, b) => a.height - b.height || a.width - b.width);

const getEstiloAnimacao = (maxHeight = '0', maxWidth = '0', color = 'white', transform = 'none') => (
    {maxHeight: maxHeight + 'vh', maxWidth: maxWidth + 'vw', color: color, transform: transform}
)

const estiloInvisivel = getEstiloAnimacao();
const estiloIntermediario = getEstiloAnimacao(3.4, 2.8, 'white', 'skewX(-5deg)');
const estiloAberto = getEstiloAnimacao(40, 10);

class SelecionarRatio extends React.Component {

    constructor (props) {
        super(props);
        this.ref = React.createRef();
        this.state = {estiloFundo: estiloInvisivel, opcoesVisiveis: false};
    }

    sair = () => this.setState({estiloFundo: estiloInvisivel, opcoesVisiveis: false})

    onMouseLeave = e => {
        var novoAlvo = e.toElement || e.relatedTarget;
        if (this.ref.current.contains(novoAlvo)) return; 
        this.esperaLeave = setTimeout(
            this.sair,
            300
        );
    }

    onMouseEnter = () => {
        clearTimeout(this.esperaLeave);
        if (!this.state.opcoesVisiveis) {
            this.setState({estiloFundo: estiloIntermediario});
        }
    }

    onClick = () => {
        this.setState({estiloFundo: estiloAberto, opcoesVisiveis: true});
    }

    selecionarRatio = ratio => {
        this.props.dispatch({type: 'selecionar-ratio-apresentacao', ratio})
        this.sair();
    }

    getDimensoesAtuais = () => {
        if (this.ref.current)
            return {width: this.ref.current.offsetWidth + 'px', height: this.ref.current.offsetHeight + 'px'}
        return {width: 0, height: 0};
    }

    static getDerivedStateFromProps = (props, state) => {
        if (!props.eMestre && state.opcoesVisiveis) {
            return {opcoesVisiveis: false, estiloFundo: estiloInvisivel};
        }
        return null;
    }

    render() {
        if (!this.props.eMestre) return null;
        var estiloFundo = (this.props.tutorial && this.state.estiloFundo === estiloInvisivel) ? estiloIntermediario : this.state.estiloFundo;
        var ratio = this.props.ratio;
        return (
            <>
                <div id='selecionar-aspect-ratio' onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}></div>
                <div id='fundo-selecionar-aspect-ratio' style={{...estiloFundo}} ref={this.ref} onMouseLeave={this.onMouseLeave}>
                        {this.state.opcoesVisiveis 
                            ? opcoesRatio.map((o, i) => 
                                    <div className='opcao-ratio' onClick={() => this.selecionarRatio(o)} key={i} 
                                        style={{borderRadius: (i === 0 ? '1vh 0 0 0' : ''),
                                        backgroundColor: (o.width === ratio.width && o.height === ratio.height ? 'var(--preto-fraco)' : '' )}}>
                                        {o.width + 'x' + o.height}
                                    </div>
                                )
                            : (estiloFundo.maxHeight !== estiloInvisivel.maxHeight 
                                ? <button id='botao-selecionar-ratio' onClick={this.onClick}>
                                    <BsAspectRatio size={20}/>
                                </button> 
                                : <div style={this.getDimensoesAtuais()}></div>
                            )
                        }
                </div>
            </>
        );
    }
};

const mapState = state => {
    var sel = state.present.selecionado;
    return {
        elementos: state.present.elementos, 
        eMestre: state.present.elementos[sel.elemento].slides[sel.slide].eMestre,
        searchAtivo: state.searchAtivo, 
        tutorial: state.itensTutorial.includes('slides'), 
        ratio: state.present.ratio
    }
}
  
export default connect(mapState)(SelecionarRatio);
  