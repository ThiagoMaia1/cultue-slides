import React, { Component } from 'react';
import './Carrossel.css';
import { connect } from 'react-redux';
import { MdKeyboardArrowUp, MdKeyboardArrowRight, MdKeyboardArrowDown, MdKeyboardArrowLeft } from 'react-icons/md';
import { getCoords, capitalize } from '../../FuncoesGerais';

const estilosSeta = ['estiloSetaUm', 'estiloSetaDois'];

class Carrossel extends Component {

    constructor (props) {
        super(props);
        this.state = {...props, estiloGaleria: {}};
        this.refGaleria = React.createRef();
        this.refCarrossel = React.createRef();
        this.corGradiente = this.props.corGradiente || 'rgba(255, 255, 255, 9)';
        this.percentualBeirada = this.props.percentualBeirada || 0;
        var dimensoes = ['height', 'width'];

        if (this.props.direcao === 'vertical') {
            this.direcao = ['top', 'bottom'];
            this.dimensoes = {principal: dimensoes[0], secundaria: dimensoes[1]};
            this.setaUm = MdKeyboardArrowUp;
            this.setaDois = MdKeyboardArrowDown;
            this.estiloSeta = {flexDirection: 'column'};
        } else {
            this.direcao = ['left', 'right'];
            this.dimensoes = {principal: dimensoes[1], secundaria: dimensoes[0]};
            this.setaUm = MdKeyboardArrowLeft;
            this.setaDois = MdKeyboardArrowRight;
            this.estiloSeta = {flexDirection: 'row'}
        }
        
        this.style = {...this.props.style};
        this.style['max' + capitalize(this.dimensoes.principal, 'Primeira Maiúscula')] = this.props.tamanhoMaximo
        this.estiloSeta[this.dimensoes.principal] = '10%';
        this.estiloSeta[this.dimensoes.secundaria] = '100%';
        for (var i = 0; i < this.direcao.length; i++) {
            this.state[estilosSeta[i]] = {backgroundImage: 'linear-gradient(to ' + this.direcao[i] + ', rgba(0,0,0,0), ' + this.corGradiente + ')', 
            opacity: '0'};
            this.state[estilosSeta[i]][this.direcao[i]] = 0;
        }
        this.estiloSeta.color = this.props.corSeta || 'gray';
        this.state.estiloGaleria[this.direcao[0]] = '0';
    }

    getLimiteInicial = () => Math.round(this.state.tamanhoCarrossel*this.percentualBeirada);
    getLimiteFinal = () => Math.round(this.state.tamanhoCarrossel*(1-this.percentualBeirada) - this.state.tamanhoGaleria) - (this.props.beiradaFinal || 0);
    getOffsetAtual = () => Number(this.state.estiloGaleria[this.direcao[0]]);
    getPasso = (sentido, tamanhoPasso) => - (sentido ? 1 : -1)*tamanhoPasso;
    eSetaInvisivel = iSeta => this.state[estilosSeta[iSeta]].opacity === '0';
    getDimensaoCamel = palavra => palavra + capitalize(this.dimensoes.principal, 'Primeira Maiúscula');
    setTimeoutSetas = (intervalo = 100) => this.timeoutSetas = setTimeout(() => this.ativarSetas(0), intervalo);
    
    definirEstiloSeta = (iSeta = 2, opacidade, display) => {
        if (display !== undefined) display = display ? '' : 'none';
        var nomeEstiloSeta = estilosSeta[iSeta];
        if (nomeEstiloSeta) {
            var objState = {};
            objState[nomeEstiloSeta] = {...this.state[nomeEstiloSeta]};
            if (opacidade !== undefined) objState[nomeEstiloSeta].opacity = opacidade;
            if (display !== undefined) objState[nomeEstiloSeta].display = display;
            this.setState(objState);
        } else {
            this.definirEstiloSeta(0, opacidade, display);
            this.definirEstiloSeta(1, opacidade, display);
        }
    }

    definirOffset(passo, opacidadeSetas = true) {
        if (opacidadeSetas) this.ativarSetas(passo);
        var objEstilo = {...this.state.estiloGaleria};
        objEstilo[this.direcao[0]] = 
            Math.min(
                Math.max(
                    this.getOffsetAtual() + passo, 
                    this.getLimiteFinal()
                ), 
                this.getLimiteInicial()
            );
        this.setState({estiloGaleria: objEstilo});
        this.definirDisplaySetas();
        return objEstilo[this.direcao[0]];
    }

    limparTransition = () => {
        var objState = {...this.state.estiloGaleria};
        objState.transition = '';
        this.setState({estiloGaleria: objState});
    }

    ativarSetas = (passo) => {
        clearTimeout(this.timeoutSetas);
        this.definirEstiloSeta(2, 0);
        var seta = passo > 0 ? 0 : passo < 0 ? 1 : 2;
        var opacidade = seta === 2 ? 0 : 1;
        this.definirEstiloSeta(seta, opacidade);
    }

    encontrarSelecionado = elemento => {
        var dimensao = this.getDimensaoCamel('offset');
        if (!this.state.tamanhoCarrossel || this.state.tamanhoCarrossel > this.state.tamanhoGaleria) return;
        var coordElemento = getCoords(elemento)[this.direcao[0]];
        var carrossel = this.refCarrossel.current;
        var coordCarrossel = getCoords(carrossel)[this.direcao[0]];
        const espacoExtra = 30;
        var distancia = coordCarrossel > coordElemento
                        ? Math.max(coordCarrossel - coordElemento + espacoExtra, 0)
                        : Math.min(coordCarrossel + carrossel[dimensao] - (coordElemento + elemento[dimensao]) - espacoExtra, 0);
        this.offsetComTransition(distancia);
    }
    
    deslizar = (sentido, tamanhoPasso = 10, tempo = 20) => {
        clearInterval(this.animacao);
        this.animacao = setInterval(() => {
            var offsetAtual = this.getOffsetAtual();
            var passo = this.getPasso(sentido, tamanhoPasso);
            if(this.definirOffset(passo) === offsetAtual) this.pararDeslizar();
        }, tempo);
    }

    definirDisplaySetas = () => {
        this.timeoutDisplaySetas = setTimeout(() => {
            var galeria = this.refGaleria.current;
            var tamanho = galeria ? galeria['offset' + capitalize(this.direcao[0], 'Primeira Maiúscula')] : 0;
            var posicao = tamanho;
            this.definirEstiloSeta(0, undefined, posicao < this.getLimiteInicial() -2);
            this.definirEstiloSeta(1, undefined, posicao > this.getLimiteFinal() +2);
        }, 10);
    }

    offsetComTransition(distancia, taxaTransition = 300, opacidadeSetas = true) {
        clearTimeout(this.timeoutTransition);
        const tempoTransition = Math.abs(distancia) / taxaTransition;
        this.setState({
            estiloGaleria: {
                ...this.state.estiloGaleria,
                transition: distancia !== 0
                    ? this.direcao[0] + ' ' + tempoTransition + 's ease-in-out'
                    : this.state.estiloGaleria.transition
            }
        });
        this.timeoutLimpar = setTimeout(() => {
            this.definirOffset(distancia, opacidadeSetas);
            if (opacidadeSetas) this.setTimeoutSetas(tempoTransition*1000);
            this.definirDisplaySetas();
        }, 10);
        this.timeoutTransition = setTimeout(() => this.limparTransition(), tempoTransition*1000 + 100);
    }

    saltar(sentido) {
        this.deslizar(sentido, 80); 
        this.timeoutSalto = setTimeout(() => {
            clearInterval(this.animacao)
            this.deslizar(sentido)
        }, 200);
    }

    pararDeslizar = () => {
        clearInterval(this.animacao)
        this.setTimeoutSetas(5);
    };

    clickSeta = (e, i) => {
        e.stopPropagation();
        this.saltar(i);
    }

    deslizarWheel = e => {
        if (this.props.wheelDesativada) return;
        e.stopPropagation();
        this.offsetComTransition(-e.deltaY, 600);
    }

    detectarTamanho = () => {
        this.setState({tamanhoCarrossel: this.getDimensaoRef(this.refCarrossel), tamanhoGaleria: this.getDimensaoRef(this.refGaleria)});
        if (this.state.tamanhoCarrossel >= this.state.tamanhoGaleria && this.state.estiloGaleria[this.direcao[0]] !== '0') {
            var objEstilo = {};
            objEstilo[this.direcao[0]] = '0';
            this.setState({estiloGaleria: objEstilo});
        }
        this.offsetComTransition(0.1, undefined, false);
    }

    getDimensaoRef = (ref, palavra = 'offset') => {
        if (!ref.current) return 0;
        var dimensao = this.getDimensaoCamel(palavra);
        return ref.current[dimensao];
    }

    componentDidUpdate = prevProps => {
        this.rO.observe(this.refCarrossel.current);
        var dimensao = this.getDimensaoCamel('offset');
        if(!this.props.refElemento || (prevProps.selecionado.elemento === this.props.selecionado.elemento && prevProps.selecionado.slide === this.props.selecionado.slide)) return;
        var elemento = this.props.refElemento.current;
        if(!elemento) return;
        var slide = this.props.refSlide;
        if(elemento[dimensao] > this.refCarrossel.current[dimensao] && slide && slide.current)
            elemento = slide.current;
        this.encontrarSelecionado(elemento);
    }

    componentDidMount = () => {
        this.rO = new ResizeObserver (this.detectarTamanho);
        this.rO.observe(this.refGaleria.current);
        this.detectarTamanho();
    }

    componentWillUnmount = () => {
        clearTimeout(this.timeoutSetas);
        clearTimeout(this.timeoutTransition);
        clearTimeout(this.timeoutDisplaySetas);
        clearTimeout(this.timeoutLimpar);
        clearTimeout(this.timeoutSalto);
        clearInterval(this.animacao);
        this.rO.disconnect();
        delete this.rO;
    }

    render () {
        var setas = [this.setaUm, this.setaDois];
        return (
            <div ref={this.refCarrossel} className='carrossel' onWheel={this.deslizarWheel} style={this.style}>
                {this.state.tamanhoGaleria > this.state.tamanhoCarrossel 
                    ? setas.map((s, i) => {
                        const Seta = s;
                        return (
                            <div className="seta-galeria" 
                                onMouseOver={() => this.deslizar(i)} 
                                onMouseOut={this.pararDeslizar}
                                onClick={e => this.clickSeta(e, i)}
                                style={{...this.estiloSeta, ...this.state[estilosSeta[i]]}}
                                key={i}>
                                    <Seta size={this.props.tamanhoIcone}/>
                            </div>
                        )
                    })
                    : null}
                <div className='container-galeria'>
                    <div ref={this.refGaleria} className='movimentador-galeria' style={this.state.estiloGaleria}>
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