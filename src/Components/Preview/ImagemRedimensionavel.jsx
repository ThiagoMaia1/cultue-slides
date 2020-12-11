import React, { Component } from 'react';
import { store } from '../../index';
import { getStrPercentual, numeroEntre, limitarMinMax } from '../../FuncoesGerais';

const editarEstilo = valor => {
    store.dispatch({type: 'editar-slide', objeto: 'imagem', valor})
}

const listaDirecoes = ['left', 'right', 'top', 'bottom'];

const estiloVazio = listaDirecoes.reduce((resultado, d) => {
    resultado[d] = 0;
    return resultado;
}, {});

const removerPorcentagem = str => {
    if (typeof str !== 'string') return str;
    return Number(str.replace('%'))/100;
}

class ImagemRedimensionavel extends Component {

    constructor (props) {
        super(props);
        this.state = {cursor: 'initial', estiloImagem: props.estiloImagem};
        if (!props.fixarProporcao) {
            let img = new Image();
            img.onload = () => this.proporcao = img.naturalWidth/img.naturalHeight;
            img.src = props.src;
        }
    }

    getPosicoesMouse = e => {
        const pai = e.currentTarget.parentNode.getBoundingClientRect();
        var filho = e.currentTarget.firstChild.getBoundingClientRect();
        filho = {left: filho.left - pai.left, top: filho.top - pai.top, width: filho.width, height: filho.height}

        return {x: e.nativeEvent.clientX - pai.left, y: e.nativeEvent.clientY - pai.top, pai, filho}
    }

    onMouseMove = e => {
        var pos = this.getPosicoesMouse(e);
        
        this.clicado 
            ? this.resize(pos)
            : this.definirBordas(pos)

    }
    
    definirBordas = (pos) => {
        const tolerancia = 7;        
        [this.bordaEsquerda, this.bordaDireita, this.bordaInferior, this.bordaSuperior] = Array(4).fill(false);

        var [x, y] = [pos.x - pos.filho.left, pos.y - pos.filho.top];
        var [interiorX, interiorY] = [false, false];

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
        this.setState({cursor: cursor});
    }

    resize = pos => {
        console.log(pos)
        const xRelativo = Math.min(pos.x/pos.pai.width, 1);
        const yRelativo = Math.min(pos.y/pos.pai.height, 1);
        var novoEstilo = {...estiloVazio, ...this.state.estiloImagem};
        for (var l of listaDirecoes) {
            novoEstilo[l] = removerPorcentagem(novoEstilo[l]);
        }       
        
        if(this.bordaDireita) {novoEstilo.right = 1 - xRelativo}
        if(this.bordaEsquerda) {novoEstilo.left = xRelativo}
        if(this.bordaInferior) {novoEstilo.bottom = 1 - yRelativo}
        if(this.bordaSuperior) {novoEstilo.top = yRelativo}
        this.setEstilo(novoEstilo);
    }

    setEstilo = novoEstilo => {
        console.log(novoEstilo)
        novoEstilo = this.corrigirProporcao(novoEstilo);
        if (novoEstilo.right < novoEstilo.left)
            [novoEstilo.right, novoEstilo.left] = [novoEstilo.left, novoEstilo.right];
        if (novoEstilo.bottom < novoEstilo.top)
            [novoEstilo.bottom, novoEstilo.top] = [novoEstilo.top, novoEstilo.bottom]
        var objState = {};
        for (var d of listaDirecoes) {
            objState[d] = getStrPercentual(novoEstilo[d]);
        }
        this.setState({estiloImagem: {...this.state.estiloImagem, ...objState}})
    }

    corrigirProporcao = novoEstilo => {
        // if (!this.proporcao) 
        return novoEstilo;
        var [altura, largura] = [novoEstilo.bottom - novoEstilo.top, novoEstilo.right - novoEstilo.left]     
        const nProporcao = largura / altura;
        if (nProporcao > this.proporcao) {
            novoEstilo.bottom = 1 - (largura*this.proporcao - novoEstilo.top);
        } else if(nProporcao < this.proporcao) {
            novoEstilo.right = 1 - (altura*this.proporcao - novoEstilo.left);
        }
        return novoEstilo;
    }

    setClicadoTrue = () => {
        this.clicado = true;
    }

    setClicadoFalse = () => {
        this.clicado = false;
        var [ estiloState, estiloProps ] = [ this.state.estiloImagem, this.props.estiloImagem ]
        for (var l of listaDirecoes) {
            if (estiloState[l] !== estiloProps[l]) {
                editarEstilo(estiloState);
                return;
            }
        }
    }

    componentDidMount = () => {
        window.addEventListener('mousedown', this.setClicadoTrue);
        window.addEventListener('mouseup', this.setClicadoFalse);
    }

    componentWillUnmount = () => {
        window.removeEventListener('mousedown', this.setClicadoTrue);
        window.removeEventListener('mouseup', this.setClicadoFalse);
    }

    render () {
        return (
            <div id='container-quadro-redimensionar' onMouseMove={this.onMouseMove} style={{cursor: this.state.cursor}}>
                {/* <img className='imagem-slide' src={this.props.imagem.src} alt={this.props.imagem.alt}
                style={{...this.state.estiloImagem}}/> */}
                <div id='quadro-redimensionar' className='div-imagem-slide' 
                    style={{...this.props.estiloRealce, ...this.state.estiloImagem, borderRadius: 0,
                            backgroundImage: 'url(' + this.props.imagem.src + ')', outline: this.state.cursor ? 'solid gray 1px' : ''}} 
                    onDragStart={this.onDragStart}>
                </div>
            </div>
        )
    }
};

export default ImagemRedimensionavel;
