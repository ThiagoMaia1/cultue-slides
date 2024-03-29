import React from 'react';
import './Splash.css';
import { multiplicarArray, inteiroAleatorio } from '../../../principais/FuncoesGerais';
import Background from './QuadradoC.svg';

const coresQuadrados = ['azul-forte', Array(2).fill('azul-claro'), Array(2).fill('cinza')].flat();
const coresFundo = ['branco', 'azul-forte', 'azul-claro'];
const proporcaoWidth = 1.2614;
const larguraBaseVw = 10;
const numeroQuadrados = 60;
const taxaShadow = 6000;
const forcaInterpolacao = 0.02;
const taxaSkew = -0.005;
const numeroGrandes = 6;
const maxTamanhoPequenos = 0.2;
const posicaoLogo = 0.75;
const tamanhoLogo = 1.2;
const estiloGrande = {backgroundImage: 'url(' + Background + ')', zIndex: 100, transform: 'none'}; 
const direcao = ['X', 'Y'];

class Quadrado {
    constructor (cor, tamanho, coordenadas) {
        Object.assign(this, {cor, tamanho, coordenadas});
        var width = tamanho*larguraBaseVw;
        var posNeg = [1, 1]
        var taxaInterpolacao = multiplicarArray(posNeg, (tamanho)*forcaInterpolacao);
        var shadow = multiplicarArray(taxaInterpolacao, taxaShadow*(tamanho**2));
        shadow = [Math.ceil(shadow[0]), Math.ceil(shadow[1])];
        const strShadow = Math.min(shadow[0], 20) + 'px ' + Math.min(shadow[1], 20) + 'px ' + Math.max(Math.min(shadow[0] / 2, 8), 3) + 'px rgba(0,0,0,0.5)';
        
        this.Componente = ({coordenadasMouse}) => {
            const getSkew = i => 'skew' + direcao[i] + '(' + (taxaSkew*coordenadasMouse[i]) + 'deg) ';
            return (
                <div className={'quadrado-logo ' + coresQuadrados[cor]}
                    style={{
                        width: width + 'vw',
                        height: width/proporcaoWidth + 'vw',
                        left: coordenadas[0]*100 + coordenadasMouse[0]*taxaInterpolacao[0] + 'vw',
                        top: coordenadas[1]*100 + coordenadasMouse[1]*taxaInterpolacao[1] + 'vh',
                        borderRadius: Math.max(width*0.0685, 0.2) + 'vw',
                        boxShadow: strShadow,
                        transform: getSkew(0) + getSkew(1),
                        transition: 'none',
                        zIndex: Math.round(tamanho*20),
                        ...(tamanho === tamanhoLogo ? estiloGrande : {})
                    }}>
                </div>
            )
        }
    }
}

class Fundo3D extends React.Component {

    constructor (props) {
        super(props);
        this.state = this.gerarQuadrados();
    }

    gerarQuadrados = () => {
        var quadrados = [];
        for (var i = 0; i < numeroQuadrados; i++) {
            quadrados.push(new Quadrado(
                i % coresQuadrados.length,
                this.getTamanhoAleatorio(i),
                [inteiroAleatorio(-20, 110)/100, inteiroAleatorio(-20, 110)/100]
            ).Componente);
        }
        return {quadrados};
    }

    getTamanhoAleatorio = i => {
        if(i === Math.floor(numeroQuadrados*(1-posicaoLogo))) return tamanhoLogo;
        var [tamanhoMinimo, tamanhoMaximo] = [0, 0.9];
        var tamanhoPequenos = maxTamanhoPequenos+0.1;
        if (i < (numeroQuadrados - numeroGrandes)) {
            tamanhoMaximo = tamanhoPequenos;
        } else {
            tamanhoMinimo = tamanhoPequenos;
        }
        return 0.05 + inteiroAleatorio(tamanhoMinimo*100, tamanhoMaximo*100)/100;
    }

    mudarFundo = () => {
        this.setState({iCorFundo: ((this.state.iCorFundo || 0) + 1) % 3})
        this.setState({coordenadasMouseLoucas: multiplicarArray(this.props.coordenadas, 0.05)})
        this.animacaoLouca = setInterval(() => {
            this.setState({coordenadasMouseLoucas: multiplicarArray(this.state.coordenadasMouseLoucas, 1.8)});
        }, 20);
        setTimeout(() => {
            clearInterval(this.animacaoLouca)
            this.setState({...this.gerarQuadrados(), coordenadasMouseLoucas: multiplicarArray(this.state.coordenadasMouseLoucas, -1)})
            this.animacaoLouca = setInterval(() => {
                this.setState({coordenadasMouseLoucas: multiplicarArray(this.state.coordenadasMouseLoucas, 1/1.8)});
            }, 20);
            setTimeout(() => {
                clearInterval(this.animacaoLouca)
                this.setState({coordenadasMouseLoucas: false})
            }, 300);
        }, 300);
    }

    render() {
        return (
            <div id='fundo-animacao-3d' className={'animacao-3d ' + coresFundo[this.state.iCorFundo || 0]} onClick={this.mudarFundo}>
                {this.state.quadrados.map((q, i) => {
                    var Componente = q;
                    return <Componente key={i} coordenadasMouse={this.state.coordenadasMouseLoucas || this.props.coordenadas}/>;
                })}
            </div>
        );
    }
};
  
export default Fundo3D;