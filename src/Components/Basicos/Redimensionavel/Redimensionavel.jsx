import React, { Component } from 'react';
import store from '../../../index';
import './Redimensionavel.css';
import { numeroEntre, getInset, getInsetNum } from '../../../principais/FuncoesGerais';
import { listaDirecoes } from '../../../principais/Constantes';

class Redimensionavel extends Component {

    constructor (props) {
        super(props);
        this.relativoAoRatio = {width: 1, height: 1};
        this.state = {cursor: 'initial', insetImagem: getInset(props.insetInicial)};
    }

    getPosicoesMouse = e => {
        const pai = e.currentTarget.parentNode.getBoundingClientRect();
        var filho = e.currentTarget.firstChild.getBoundingClientRect();
        filho = {left: filho.left - pai.left, top: filho.top - pai.top, width: filho.width, height: filho.height}
        var proporcaoPai = pai.width/pai.height;
        this.proporcaoRelativa = this.props.proporcao/proporcaoPai;
        this.relativoAoRatio = this.props.proporcao > proporcaoPai
                                ? {width: 1, height: 1/this.proporcaoRelativa}
                                : {width: this.proporcaoRelativa, height: 1};
        return {x: e.nativeEvent.clientX - pai.left, y: e.nativeEvent.clientY - pai.top, pai, filho}
    }

    onMouseMove = e => {
        if (!this.props.redimensionamentoAtivo) return;
        var pos = this.getPosicoesMouse(e);
        
        if (this.clicado) {
            if (store.getState().present.abaAtiva !== 'imagem') 
                store.dispatch({type: 'ativar-realce', abaAtiva: 'imagem'})
            if (this.interior) {
                this.move(pos) 
            } else {
                this.resize(pos)
            }
        } else {
            this.definirBordas(pos)
        }
    }
    
    definirBordas = (pos) => {
        const tolerancia = 7;        
        [this.bordaEsquerda, this.bordaDireita, this.bordaInferior, this.bordaSuperior] = Array(4).fill(false);

        this.posicaoInicialQuadrado = getInsetNum(this.state.insetImagem);
        this.posicaoInicialMouse = [pos.x, pos.y];

        var [x, y] = [pos.x - pos.filho.left, pos.y - pos.filho.top];
        var [interiorX, interiorY] = [false, false];
        this.interior = false;

        if(Math.abs(x) < tolerancia) {this.bordaEsquerda = true}
        else if (numeroEntre(pos.filho.width - tolerancia, x, pos.filho.width + tolerancia)) {this.bordaDireita = true}
        else if (numeroEntre(tolerancia, x, pos.filho.width - tolerancia)) {interiorX = true}
        if (Math.abs(y) < tolerancia) {this.bordaSuperior = true}
        else if (numeroEntre(pos.filho.height - tolerancia, y, pos.filho.height + tolerancia)) {this.bordaInferior = true}
        else if (numeroEntre(tolerancia, y, pos.filho.height - tolerancia)) {interiorY = true}

        var cursor = '';
        if ((this.bordaDireita && this.bordaSuperior) || (this.bordaEsquerda && this.bordaInferior)) {cursor = 'nesw-resize'}
        else if ((this.bordaEsquerda && this.bordaSuperior) || (this.bordaDireita && this.bordaInferior)) {cursor = 'nwse-resize'}
        else if (this.bordaEsquerda || this.bordaDireita) {cursor = 'ew-resize'}
        else if (this.bordaSuperior || this.bordaInferior) {cursor = 'ns-resize'}
        else if (interiorX && interiorY) {
            this.interior = true;
            cursor = 'move';
        }
        this.setCursor(cursor);
    }

    onDragStart = e => {
        e.dataTransfer.effectAllowed = 'move';
    }

    setCursor = (cursor = null) => {
        this.setState({cursor});
    }

    resize = pos => {
        const xRelativo = Math.min(pos.x/pos.pai.width, this.relativoAoRatio.width);
        const yRelativo = Math.min(pos.y/pos.pai.height, this.relativoAoRatio.height);
        var novoInset = getInsetNum(this.state.insetImagem);

        if(this.bordaDireita) {novoInset.right = 1 - xRelativo}
        if(this.bordaEsquerda) {novoInset.left = xRelativo}
        if(this.bordaInferior) {novoInset.bottom = 1 - yRelativo}
        if(this.bordaSuperior) {novoInset.top = yRelativo}
        this.corrigirInset(novoInset);
    }

    move = pos => {
        var antigo = this.posicaoInicialQuadrado;
        var novo = {};
        var diferencaX = (pos.x - this.posicaoInicialMouse[0])/pos.pai.width;
        var diferencaY = (pos.y - this.posicaoInicialMouse[1])/pos.pai.height;
        novo.left = antigo.left + diferencaX;
        novo.right = antigo.right - diferencaX;
        novo.top = antigo.top + diferencaY;
        novo.bottom = antigo.bottom - diferencaY;
        this.setInset(novo);
    }

    setInset = novoInset => {
        this.setState({insetImagem: getInset(novoInset)})
    }

    corrigirInset = novoInset => {
        if (!this.proporcaoLivre) novoInset = this.corrigirProporcao(novoInset);
        novoInset = this.corrigirInversao(novoInset);
        this.setInset(novoInset);
    }

    getDiferenca = (inset, direcao1, direcao2) => {
        let valor = 1 - (1 - inset[direcao1] - inset[direcao2]);
        if (direcao1 === 'right') return valor*this.proporcaoRelativa;
        return valor/this.proporcaoRelativa;
    }

    corrigirProporcao = novoInset => {
        if (!this.props.proporcao) return novoInset;
        var diferenca;
        if (this.bordaDireita || this.bordaEsquerda) {
            diferenca = this.getDiferenca(novoInset, 'right', 'left');
            if(this.bordaSuperior) {
                novoInset.top = diferenca - novoInset.bottom;
            } else {
                novoInset.bottom = diferenca - novoInset.top;
            }
        } else {
            diferenca = this.getDiferenca(novoInset, 'bottom', 'top');
            if(this.bordaEsquerda) {
                novoInset.left = diferenca - novoInset.right;
            } else {
                novoInset.right = diferenca - novoInset.left;
            }
        }
        return novoInset;
    }

    inverterHorizontal = inset => {
        [inset.right, inset.left, this.bordaEsquerda, this.bordaDireita] = 
            [1 - inset.left, 1 - inset.right, this.bordaDireita, this.bordaEsquerda];
        this.setState({espelhadoHorizontal: !this.state.espelhadoHorizontal});
        return inset;
    }

    inverterVertical = inset => {
        [inset.bottom, inset.top, this.bordaInferior, this.bordaSuperior] = 
            [1 - inset.top, 1 - inset.bottom, this.bordaSuperior, this.bordaInferior];
        this.setState({espelhadoVertical: !this.state.espelhadoVertical});
        return inset;
    }

    corrigirInversao = novoInset => {
        if (1 - novoInset.right < novoInset.left)
            novoInset = this.inverterHorizontal(novoInset);
        if (1 - novoInset.bottom < novoInset.top)
            novoInset = this.inverterVertical(novoInset);
        return novoInset;
    }

    setClicadoTrue = () => {
        this.clicado = true;
    }

    setClicadoFalse = () => {
        this.clicado = false;
        this.props.callback(this.state.insetImagem);
    }

    setProporcaoLivreTrue = e => {
        if(/Shift/.test(e.code)) this.proporcaoLivre = true;
    }

    setProporcaoLivreFalse = e => {
        if(/Shift/.test(e.code)) this.proporcaoLivre = false;
    }

    componentDidMount = () => {
        window.addEventListener('mousedown', this.setClicadoTrue);
        window.addEventListener('mouseup', this.setClicadoFalse);
        window.addEventListener('keydown', this.setProporcaoLivreTrue);
        window.addEventListener('keyup', this.setProporcaoLivreFalse);
    }

    componentDidUpdate = prevProps => {
        let { insetImagem } = this.state;
        let insetProps = getInset(this.props.insetInicial); 
        let insetPrevProps = getInset(prevProps.insetInicial);
        for (let d of listaDirecoes) {
            if (insetPrevProps[d] !== insetProps[d])
                if (insetProps[d] !== insetImagem[d]) {
                    this.setState({insetImagem: insetProps});
                    return;
                }
        }
    }

    componentWillUnmount = () => {
        window.removeEventListener('mousedown', this.setClicadoTrue);
        window.removeEventListener('mouseup', this.setClicadoFalse);
        window.removeEventListener('keydown', this.setProporcaoLivreTrue);
        window.removeEventListener('keyup', this.setProporcaoLivreFalse);
    }

    render () {
        var classEspelhado = this.state.espelhadoVertical && this.state.espelhadoHorizontal
                             ? 'ambos'
                             : this.state.espelhadoHorizontal
                                ? 'horizontal'
                                : this.state.espelhadoVertical 
                                    ? 'vertical'
                                    : ''; 
        let { cursor } = this.state;
        let { redimensionamentoAtivo, estilo, proporcao } = this.props;
        return (
            <div id='container-quadro-redimensionar' onMouseMove={this.onMouseMove} style={{cursor}}>
                <div id='quadro-redimensionar' 
                    className={classEspelhado}
                    style={{...estilo, ...this.state.insetImagem, outline: (cursor && redimensionamentoAtivo) ? 'solid gray 1px' : ''}} 
                    onDragStart={this.onDragStart}>
                        {this.props.children}
                </div>
                {listaDirecoes.map(l => l + ': ' + this.state.insetImagem[l]).join(', ')}
                
                Proporcao: {proporcao}
            </div>
        )
    }
};

export default Redimensionavel;
