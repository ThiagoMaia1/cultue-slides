import React, { Component } from 'react';
import store from '../../index';
import { getStrPercentual, numeroEntre } from '../../principais/FuncoesGerais';

const editarEstilo = valor => store.dispatch({type: 'editar-slide', objeto: 'imagem', valor})

const listaDirecoes = ['left', 'right', 'top', 'bottom'];

const getInset = (origem = {}) => listaDirecoes.reduce((resultado, d) => {
    resultado[d] = getStrPercentual(origem[d]) || 0;
    return resultado;
}, {});

const estiloVazio = getInset();

const removerPorcentagem = str => {
    if (typeof str === 'string' && /%/.test(str))
        str = Number(str.replace('%',''))/100;
    if (typeof str === 'number' && !isNaN(str))
        return str;
    return 0;
}

class ImagemRedimensionavel extends Component {

    constructor (props) {
        super(props);
        let img = new Image();
        this.relativoAoRatio = {width: 1, height: 1};
        this.state = {cursor: 'initial', estiloImagem: getInset(props.estiloImagem)};
        img.onload = e => {
            this.setProporcaoNatural(e.target);
            this.corrigirEstilo(this.state.estiloImagem);
        }
        img.src = props.imagem.src;
    }

    setProporcaoNatural = img => {
        this.proporcao = img.naturalWidth/img.naturalHeight;
    }

    getPosicoesMouse = e => {
        const pai = e.currentTarget.parentNode.getBoundingClientRect();
        var filho = e.currentTarget.firstChild.getBoundingClientRect();
        filho = {left: filho.left - pai.left, top: filho.top - pai.top, width: filho.width, height: filho.height}
        var proporcaoPai = pai.width/pai.height;
        this.proporcaoRelativa = this.proporcao/proporcaoPai;
        this.relativoAoRatio = this.proporcao > proporcaoPai
                                ? {width: 1, height: 1/this.proporcaoRelativa}
                                : {width: this.proporcaoRelativa, height: 1};
        return {x: e.nativeEvent.clientX - pai.left, y: e.nativeEvent.clientY - pai.top, pai, filho}
    }

    onMouseMove = e => {
        if (!this.props.editavel) return;
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

        this.posicaoInicialQuadrado = this.getEstiloNum();
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
        var novoEstilo = this.getEstiloNum();

        if(this.bordaDireita) {novoEstilo.right = 1 - xRelativo}
        if(this.bordaEsquerda) {novoEstilo.left = xRelativo}
        if(this.bordaInferior) {novoEstilo.bottom = 1 - yRelativo}
        if(this.bordaSuperior) {novoEstilo.top = yRelativo}
        this.corrigirEstilo(novoEstilo);
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
        this.setEstilo(novo);
    }

    getEstiloNum = () => {
        var estilo = {...estiloVazio, ...this.state.estiloImagem};
        var inset = {};
        for (var l of listaDirecoes) {
            inset[l] = removerPorcentagem(estilo[l]);
        }
        return inset; 
    }

    setEstilo = novoEstilo => {
        this.setState({estiloImagem: getInset(novoEstilo)})
    }

    corrigirEstilo = novoEstilo => {
        if (!this.proporcaoLivre) novoEstilo = this.corrigirProporcao(novoEstilo);
        novoEstilo = this.corrigirInversao(novoEstilo);
        this.setEstilo(novoEstilo);
    }

    getDiferenca = (estilo, direcao1, direcao2) => 
        1 - (1 - estilo[direcao1] - estilo[direcao2])/this.proporcaoRelativa;

    corrigirProporcao = novoEstilo => {
        if (!this.proporcao) return novoEstilo;
        var diferenca;
        if (this.bordaDireita || this.bordaEsquerda) {
            diferenca = this.getDiferenca(novoEstilo, 'right', 'left');
            if(this.bordaSuperior) {
                novoEstilo.top = diferenca - novoEstilo.bottom;
            } else {
                novoEstilo.bottom = diferenca - novoEstilo.top;
            }
        } else {
            diferenca = this.getDiferenca(novoEstilo, 'bottom', 'top');
            if(this.bordaEsquerda) {
                novoEstilo.left = diferenca - novoEstilo.right;
            } else {
                novoEstilo.right = diferenca - novoEstilo.left;
            }
        }
        return novoEstilo;
    }

    inverterHorizontal = estilo => {
        [estilo.right, estilo.left, this.bordaEsquerda, this.bordaDireita] = 
            [1 - estilo.left, 1 - estilo.right, this.bordaDireita, this.bordaEsquerda];
        this.setState({espelhadoHorizontal: !this.state.espelhadoHorizontal});
        return estilo;
    }

    inverterVertical = estilo => {
        [estilo.bottom, estilo.top, this.bordaInferior, this.bordaSuperior] = 
            [1 - estilo.top, 1 - estilo.bottom, this.bordaSuperior, this.bordaInferior];
        this.setState({espelhadoVertical: !this.state.espelhadoVertical});
        return estilo;
    }

    corrigirInversao = novoEstilo => {
        if (1 - novoEstilo.right < novoEstilo.left) {
        console.log('antes', novoEstilo)
            novoEstilo = this.inverterHorizontal(novoEstilo);
        console.log('depois', novoEstilo)
    }
        if (1 - novoEstilo.bottom < novoEstilo.top)
            novoEstilo = this.inverterVertical(novoEstilo);
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
                // var estiloNum = this.getEstiloNum();
                // this.proporcao = ((1 - estiloNum.right - estiloNum.left)/(1 - estiloNum.top - estiloNum.bottom));
                editarEstilo(estiloState);
                return;
            }
        }
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
        let { imagem, editavel, estiloRealce, estiloImagem } = this.props;
        return (
            <div id='container-quadro-redimensionar' onMouseMove={this.onMouseMove} style={{cursor}}>
                <div id='quadro-redimensionar' 
                    className={'div-imagem-slide ' + classEspelhado}
                    style={{...estiloRealce, ...estiloImagem, ...this.state.estiloImagem,
                            backgroundImage: 'url(' + imagem.src + ')', outline: (cursor && editavel) ? 'solid gray 1px' : ''}} 
                    onDragStart={this.onDragStart}>
                </div>
            </div>
        )
    }
};

export default ImagemRedimensionavel;
