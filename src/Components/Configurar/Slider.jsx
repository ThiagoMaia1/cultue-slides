import React, { Component } from 'react';
import './slider.css';

class Slider extends Component {

    constructor (props) {
        super(props);
        if (this.props.max < this.props.min) {
            this.min = Number(props.max);
            this.max = Number(this.props.min);
            this.virar = 1;
        } else {
            this.max = Number(props.max);
            this.min = Number(this.props.min);
            this.virar = -1;
        }
        this.state = {...props, 
            coordenadaX: this.valorFlutuante(this.props.defaultValue), 
            valor: this.getValorUnidade(this.props.defaultValue)};
    }

    valorFlutuante(valor) {
        var distancia = this.max - this.min;
        var setar = true;
        if (!valor) {
            valor = this.min + distancia/2;
            setar = false;
        }
        var posicao = (valor - this.min)/distancia;
        if (setar) {
            this.props.callbackFunction(valor);
            this.setState({valor: this.getValorUnidade(valor)});
        }
        var coordenadaX = (1.10 - posicao)*58 + "%";
        this.setState({coordenadaX: coordenadaX});
        return coordenadaX;
    }

    getValorUnidade(valor) {
        if (isNaN(valor)) return '-';
        if (this.props.unidade) {
            if (this.props.unidade === '%') {
                return Math.round(valor*100) + '%';
            } else {
                return valor + this.props.unidade; 
            }
        }
        return valor;
    }

    render() {
        return (
            <div className='container-range' style={this.props.style}>
                <div className='rotulo-range'>{this.props.rotulo}</div>
                <div className='frame-range'>
                    <input type="range" 
                        min={this.min}
                        step={this.props.step} 
                        max={this.max} 
                        className="slider"
                        defaultValue={this.state.defaultValue} 
                        onInput={e => this.valorFlutuante(e.target.value)}
                        style={{transform: 'rotate(' + (this.virar*90) + 'deg)'}}></input>
                    <div style={{top: this.state.coordenadaX}} className='valor-flutuante'>{this.state.valor}</div>
                </div>
            </div>
        );
    }
}

export default Slider;