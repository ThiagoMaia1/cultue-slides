import React, { Component } from 'react';
import './slider.css';
import { connect } from 'react-redux'

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
        this.ref = React.createRef();
        this.state = {valor: props.defaultValue, selecionado: props.selecionado, ref: this.ref};
    }

    setValor = e => {
        clearTimeout(this.timeoutCallback);
        var valor = e.target.value;
        this.setState({valor: valor});
        this.timeoutCallback = setTimeout(this.props.callbackFunction, 100, valor);
    }
    
    static getDerivedStateFromProps(props, state) {
        if (props.selecionado.elemento !== state.selecionado.elemento || props.selecionado.slide || state.selecionado.slide) {
            state.ref.current.value = props.defaultValue;
            return {valor: props.defaultValue, selecionado: props.selecionado};
        }
        return null;
    }

    getCoordenada() {
        var valor = this.state.valor;
        var distancia = this.max - this.min;
        if (!valor) valor = this.min + distancia/2;
        var posicao = (valor - this.min)/distancia;
        var coordenada = (1.10 - posicao)*58 + "%";
        return coordenada;
    }

    getValorUnidade() {
        var valor = this.state.valor;
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

    dispatchUndoRedo = e => {
        if (e.ctrlKey) {
            if (!e.shiftKey && e.key === 'z') {
                this.props.dispatch({type: 'UNDO'});
            } else if (e.key === 'y' || e.shiftKey && e.key === 'z') {
                this.props.dispatch({type: 'REDO'});
            } 
        }
    }

    
    render() {
        return (
            <div className='container-range' style={this.props.style}>
                <div className='rotulo-range'>{this.props.rotulo}</div>
                <div className='frame-range'>
                    <input type="range"
                        ref={this.ref} 
                        min={this.min}
                        step={this.props.step} 
                        max={this.max} 
                        defaultValue={this.state.valor}
                        className="slider"
                        onInput={this.setValor}
                        onKeyDown={this.dispatchUndoRedo}
                        style={{transform: 'rotate(' + (this.virar*90) + 'deg)'}}></input>
                    <div style={{top: this.getCoordenada()}} className='valor-flutuante'>
                        {this.getValorUnidade()}
                    </div>
                </div>
            </div>
        );
    }
}

export default connect()(Slider);