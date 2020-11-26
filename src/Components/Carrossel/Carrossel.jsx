import React, { Component } from 'react';
import './Carrossel.css';
import { connect } from 'react-redux';
import { MdKeyboardArrowUp, MdKeyboardArrowRight, MdKeyboardArrowDown, MdKeyboardArrowLeft } from 'react-icons/md';

function getCoords(elem) {
    var box = elem.getBoundingClientRect();

    var body = document.body;
    var docEl = document.documentElement;

    var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

    var clientTop = docEl.clientTop || body.clientTop || 0;
    var clientLeft = docEl.clientLeft || body.clientLeft || 0;

    var top  = box.top +  scrollTop - clientTop;
    var left = box.left + scrollLeft - clientLeft;

    return { top: Math.round(top), left: Math.round(left) };
}

class Carrossel extends Component {

    constructor (props) {
        super(props);
        this.state = {...props, estilo: {}};
        this.refGaleria = React.createRef();
        this.refCarrossel = React.createRef();
        this.corGradiente = this.props.corGradiente || 'rgba(255, 255, 255, 9)';
        this.percentualBeirada = this.props.percentualBeirada || 0;

        if (this.props.direcao === 'vertical') {
            this.direcao = 'top'
            this.setaUm = MdKeyboardArrowUp;
            this.setaDois = MdKeyboardArrowDown;
            this.estiloSeta = {height: '10%', width: '100%', flexDirection: 'column'};
            this.state.estiloSetaUm = {backgroundImage: 'linear-gradient(to bottom, ' + this.corGradiente + ', rgba(0,0,0,0))', top: '0', opacity: '0'};
            this.state.estiloSetaDois = {backgroundImage: 'linear-gradient(to top, ' + this.corGradiente + ', rgba(0,0,0,0))', bottom: '0', opacity: '0'};
            this.style = {maxHeight: this.props.tamanhoMaximo}
        } else {
            this.direcao = 'left';
            this.setaUm = MdKeyboardArrowLeft;
            this.setaDois = MdKeyboardArrowRight;
            this.estiloSeta = {height: '100%', width: '10%', flexDirection: 'row'}
            this.state.estiloSetaUm = {backgroundImage: 'linear-gradient(to right, ' + this.corGradiente + ', rgba(0,0,0,0))', left: '0', opacity: '0'};
            this.state.estiloSetaDois = {backgroundImage: 'linear-gradient(to left, ' + this.corGradiente + ', rgba(0,0,0,0))', right: '0', opacity: '0'};
            this.style = {maxWidth: this.props.tamanhoMaximo}
        }
        this.style = {...this.style, ...this.props.style};
        this.estiloSeta = {...this.estiloSeta, color: this.props.corSeta || 'gray'}

        this.state.estilo[this.direcao] = '0';
    }

    ativarSetas = (sentido, tamanhoPasso = 10) => {
        var o = Number(this.state.estilo[this.direcao]);
        var passo = - sentido*tamanhoPasso;

        this.setState({estiloSetaUm: {...this.state.estiloSetaUm, display: ''}, estiloSetaDois: {...this.state.estiloSetaDois, display: ''}});
        
        if (sentido < 0 && o + passo < this.state.tamanhoCarrossel*this.percentualBeirada) {
            //TODO: conferir se funciona tudo como display em vez de display e opacity.
            if (this.state.estiloSetaUm.opacity === '0') this.setState({estiloSetaUm: {...this.state.estiloSetaUm, opacity: '1'}});
        } else if (sentido > 0 && o + passo > this.state.tamanhoCarrossel*(1-this.percentualBeirada) - this.state.tamanhoGaleria) {
            if (this.state.estiloSetaDois.opacity === '0') this.setState({estiloSetaDois: {...this.state.estiloSetaDois, opacity: '1'}});
        } else {
            this.setState({estiloSetaUm: {...this.state.estiloSetaUm, opacity: '0'}, estiloSetaDois: {...this.state.estiloSetaDois, opacity: '0'}})
            return;
        }   
    }

    encontrarSelecionado = async elemento => {
        if (!this.state.tamanhoCarrossel || this.state.tamanhoCarrossel > this.state.tamanhoGaleria) return;
        var coordElemento = getCoords(elemento)[this.direcao];
        var carrossel = this.refCarrossel.current;
        var coordCarrossel = getCoords(carrossel)[this.direcao];
        var o = this.state.estilo[this.direcao];
        const espacoExtra = 30;
        var distancia = coordCarrossel > coordElemento
                        ? Math.max(coordCarrossel - coordElemento + espacoExtra, 0)
                        : Math.min(coordCarrossel + carrossel.offsetHeight - (coordElemento + elemento.offsetHeight) - espacoExtra, 0)
        var objEstilo = {transition: this.direcao + ' ' + distancia/300 + 's linear'};
        objEstilo[this.direcao] = o + distancia;
        this.setState({estilo: objEstilo});
    }
    
    deslizar = (sentido, tamanhoPasso = 10, tempo = 20) => {
        this.ativarSetas(sentido, tamanhoPasso)     

        clearInterval(this.animacao);
        this.animacao = setInterval(() => {
            var o = Number(this.state.estilo[this.direcao]);
            var passo = - sentido*tamanhoPasso;
            if (o + passo > this.state.tamanhoCarrossel*this.percentualBeirada || o + passo < this.state.tamanhoCarrossel*(1-this.percentualBeirada) - this.state.tamanhoGaleria) {
                if (sentido === -1) {
                    this.setState({estiloSetaUm: {...this.state.estiloSetaUm, display: 'none'}});
                } else {
                    this.setState({estiloSetaDois: {...this.state.estiloSetaDois, display: 'none'}});
                }
                clearInterval(this.animacao);
            } else {
                var objEstilo = {};
                objEstilo[this.direcao] = o + passo;
                this.setState({estilo: objEstilo});
            }
        }, tempo);
    }

    saltar(sentido) {
        this.deslizar(sentido, 80); 
        setTimeout(() => {
            clearInterval(this.animacao)
            this.deslizar(sentido)
        }, 200);
    }

    pararDeslizar = () => {
        this.setState({estiloSetaUm: {...this.state.estiloSetaUm, opacity: '0'}, estiloSetaDois: {...this.state.estiloSetaDois, opacity: '0'}})
        clearInterval(this.animacao);
    }

    deslizarWheel = e => {
        e.preventDefault();
        var obj = {};
        obj[this.direcao] = Math.min(Math.max(
            this.state.estilo[this.direcao] - e.deltaY, 
            this.state.tamanhoCarrossel*(1-this.percentualBeirada) - this.state.tamanhoGaleria), 
            this.state.tamanhoCarrossel*this.percentualBeirada);
        this.setState({estilo: obj});
        this.ativarSetas(0);
    }

    onMouseOver = () => {
        if (this.direcao === 'top') {
            this.setState({tamanhoCarrossel: this.refCarrossel.current.offsetHeight, tamanhoGaleria: this.refGaleria.current.offsetHeight});
        } else {
            this.setState({tamanhoCarrossel: this.refCarrossel.current.offsetWidth, tamanhoGaleria: this.refGaleria.current.offsetWidth});
        }
        if (this.state.tamanhoCarrossel >= this.state.tamanhoGaleria && this.state.estilo[this.direcao] !== '0') {
            var objEstilo = {};
            objEstilo[this.direcao] = '0';
            this.setState({estilo: objEstilo});
        }
    }

    componentDidUpdate = prevProps => {
        if(!this.props.refElemento || (prevProps.selecionado.elemento === this.props.selecionado.elemento && prevProps.selecionado.slide === this.props.selecionado.slide)) return;
        var elemento = this.props.refElemento.current;
        if(!elemento) return;
        var slide = this.props.refSlide;
        if(elemento.offsetHeight > this.refCarrossel.current.offsetHeight && slide && slide.current)
            elemento = slide.current;
        this.encontrarSelecionado(elemento);
    }

    render () {
        var SetaUm = this.setaUm;
        var SetaDois = this.setaDois;
        return (
            <div ref={this.refCarrossel} className='carrossel' onMouseOver={this.onMouseOver} onWheel={this.deslizarWheel} style={this.style}>
                {this.state.tamanhoGaleria > this.state.tamanhoCarrossel ? 
                    <>
                        <div className="seta-galeria" 
                             onMouseOver={() => this.deslizar(-1)} 
                             onMouseLeave={this.pararDeslizar}
                             onClick={() => this.saltar(-1)}
                             style={{...this.estiloSeta, ...this.state.estiloSetaUm}}>
                             <SetaUm size={this.props.tamanhoIcone}/></div>
                        <div className="seta-galeria" 
                             onMouseOver={() => this.deslizar(1)} 
                             onMouseLeave={this.pararDeslizar}
                             onClick={() => this.saltar(1)}
                             style={{...this.estiloSeta, ...this.state.estiloSetaDois}}>
                             <SetaDois size={this.props.tamanhoIcone}/></div>
                    </> : null}
                <div className='container-galeria'>
                    <div ref={this.refGaleria} className='movimentador-galeria' style={this.state.estilo}>
                        {this.props.children}
                    </div>                    
                </div>
            </div>
        )
    }
}

const mapState = state => (
    {selecionado: state.present.selecionado}
)
 
export default connect(mapState)(Carrossel);