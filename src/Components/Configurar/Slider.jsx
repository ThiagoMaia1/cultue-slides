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
        this.state = {ref: this.ref};
    }

    setValor = () => {
        clearTimeout(this.timeoutCallback);
        this.props.callback(this.ref.current.value, true);
        this.timeoutCallback = setTimeout(this.mudancaPermanente, 300);
    }
    
    static getDerivedStateFromProps(props, state) {
        if (state.ref.current && state.ref.current.value !== props.valorAplicado) {
            state.ref.current.value = props.valorAplicado;
        }
        return null;
    }

    getCoordenada() {
        var valor = this.props.valorAplicado;
        var distancia = this.max - this.min;
        if (!valor) valor = this.props.valorAplicado;
        var posicao = (valor - this.min)/distancia;
        var coordenada = (1.10 - posicao)*58 + "%";
        return coordenada;
    }

    getValorUnidade() {
        var valor = this.props.valorAplicado;
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
                clearTimeout(this.timeoutCallback);
                this.mudancaPermanente();
                this.props.dispatch({type: 'UNDO'});
            } else if (e.key === 'y' || (e.shiftKey && e.key === 'z')) {
                this.props.dispatch({type: 'REDO'});
            } 
        }
    }

    mudancaPermanente = () => {
        if (this.props.previous)
            this.props.callback(this.ref.current.value, false);
    }

    render() {
        return (
            <div className='container-range' style={this.props.style}>
                <div className='container-rotulo-range'><div className='rotulo-range'>{this.props.rotulo}</div></div>
                <div className='frame-range'>
                    <input type="range"
                        ref={this.ref} 
                        min={this.min}
                        step={this.props.step} 
                        max={this.max} 
                        defaultValue={this.props.valorAplicado}
                        className="slider"
                        onInput={this.setValor}
                        onKeyDown={this.dispatchUndoRedo}
                        style={{transform: 'rotate(' + (this.virar*90) + 'deg)'}}
                        onBlur={this.mudancaPermanente}></input>
                    <div style={{top: this.getCoordenada()}} className='valor-flutuante'>
                        {this.getValorUnidade()}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {previous: !!state.previousTemp}
}

export default connect(mapStateToProps)(Slider);