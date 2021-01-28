import React, { Component, useEffect, useState, useRef } from 'react';
import './slider.css';
import { connect } from 'react-redux'
import { arredondarStep } from '../../../principais/FuncoesGerais';

const prevent = e => e.preventDefault();

const InputTexto = ({valorAplicado, max, min, step, unidade, setValor, valorUnidade, setErro, setArrastando}) => {
    let posicaoCaret = useRef(0);
    let timeoutBlurTexto = useRef();
    let refCaret = useRef();
    const getValor = valorMultiplicado => {
        if (valorMultiplicado === '' || isNaN(valorMultiplicado)) return null;    
        if (unidade === '%')
            return valorMultiplicado/100;
        return valorMultiplicado;
    }
    
    const setValorTexto = e => {
        let valor = getValor(e.target.innerText);
        let erro = e.target.innerText !== '' && (valor === null || valor > max || valor < min);
        setErro(erro);
        if (valor === null || erro) valor = valorAplicado;
        setValor(valor, 0);
        if(e.target !== document.activeElement) 
            e.target.innerHTML = unidade === '%' ? arredondarStep(valor*100, step) : valor; 
        e.target.addEventListener('keypress', prevent);
    }

    const onInputTexto = e => {
        clearTimeout(timeoutBlurTexto.current);
        if(!e.target.innerText.length) return;
        posicaoCaret.current = window.getSelection().getRangeAt(0).startOffset;
        let valor = getValor(e.target.innerText);
        let timeout = 300;
        if (valor < min) timeout = 1000;
        e.persist();
        timeoutBlurTexto.current = setTimeout(
            () => {
                e.target.style.caretColor = 'white';          
                setValorTexto(e)
            }, 
            timeout
        );
    }

    const setCaret = el => {
        if (el !== document.activeElement) return;
        let textNode = el.firstChild;
        if(textNode) {
            let pos = Math.min(textNode.length, posicaoCaret.current);
            window.getSelection().setPosition(textNode, pos);
        }
        el.style.caretColor = null;
        el.removeEventListener('keypress', prevent);
    }

    let {current} = refCaret;
    if(current) {
        setTimeout(() => setCaret(current), 0);
    }

    return (
        <span ref={refCaret} 
             className='input-texto-slider'
             contentEditable={true} 
             suppressContentEditableWarning='true'
             onMouseDown={e => {
                e.stopPropagation();
                setArrastando(false); 
            }}
             onKeyPress={e => {
                if(!/[0-9]/.test(e.key)) e.preventDefault();
                if(e.key === 'Enter' || e.key === 'Tab')
                    e.target.blur();
             }}
             onBlur={e => {
                e.persist();
                setErro(false);
                setValorTexto(e);
             }}
             onInput={onInputTexto}>
            {valorUnidade}
        </span>
    )
}

const ValorFlutuante = (props) => {

    let [erro, setErro] = useState(false);
    let {valorAplicado, max, min, distancia, setValor, step, refPai, unidade} = props;
    let [arrastando, setArrastando] = useState(false);
    
    const getCoordenada = () => {
        let posicao = (valorAplicado - min)/distancia;
        return (1.1 - posicao)*58 + "%";
    }

    const getValorDaCoordenada = coordenada => {
        let valor = Math.max(min, 
                    Math.min(max,
                        coordenada*distancia + min
                    )
                );
        return arredondarStep(valor, step);
    }

    useEffect(() => {
        
        const mouseUp = () => {
            setArrastando(false);
        }
        const mouseMove = e => {
            if (!arrastando) return;
            let rect = refPai.current.getBoundingClientRect();
            let posicao = (rect.bottom - e.clientY)/rect.height;
            let valor = getValorDaCoordenada(posicao);
            setValor(valor, 300);
        }
        window.addEventListener('mouseup', mouseUp);
        window.addEventListener('mousemove', mouseMove);
        return () => {
            window.removeEventListener('mouseup', mouseUp);
            window.removeEventListener('mousemove', mouseMove);
        }
    })

    return (
        <div style={{top: getCoordenada()}} 
            className={'valor-flutuante' + (erro ? ' erro' : '')}
            onMouseDown={() => setArrastando(true)}
        >
            <InputTexto {...props} setErro={setErro} setArrastando={setArrastando}/>
            <span>
                {unidade}
            </span>
        </div>
    )
}

class Slider extends Component {

    constructor (props) {
        super(props);
        if (props.max < props.min) {
            this.min = Number(props.max);
            this.max = Number(props.min);
            this.virar = 1;
        } else {
            this.max = Number(props.max);
            this.min = Number(props.min);
            this.virar = -1;
        }
        this.distancia = this.max - this.min;
        this.ref = React.createRef();
        this.state = {ref: this.ref};
    }

    setValor = (valor, timeout = 300) => {
        clearTimeout(this.timeoutCallback);
        this.props.callback(valor, true);
        this.timeoutCallback = setTimeout(this.mudancaPermanente(valor), timeout);
    }
    
    static getDerivedStateFromProps(props, state) {
        if (state.ref.current && state.ref.current.value !== props.valorAplicado) {
            state.ref.current.value = props.valorAplicado;
        }
        return null;
    }    

    getValorUnidade() {
        let {valorAplicado, unidade} = this.props;
        let valor = valorAplicado;
        if (unidade === '%')
                valor = Math.round(valor*100);
        return valor;
    }

    mudancaPermanente = valor => {
        if (this.props.previous)
            this.props.callback(valor, false);
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

    render() {
        let {style, rotulo, step, valorAplicado} = this.props;
        return (
            <div className='container-range' 
                 style={style}>
                <div className='container-rotulo-range'><div className='rotulo-range'>{rotulo}</div></div>
                <div className='frame-range'>
                    <input type='range'
                        ref={this.ref}
                        min={this.min}
                        step={step} 
                        max={this.max} 
                        defaultValue={valorAplicado}
                        className='slider'
                        onInput={e => this.setValor(e.target.value)}
                        onKeyDown={this.dispatchUndoRedo}
                        style={{transform: 'rotate(' + (this.virar*90) + 'deg)'}}
                        onBlur={e => this.setValor(e.target.value, 0)}>    
                    </input>
                    <ValorFlutuante {...this.props} setValor={this.setValor} mudancaPermanente={this.mudancaPermanente} 
                                    max={this.max} min={this.min} distancia={this.distancia} valorUnidade={this.getValorUnidade()} 
                                    refPai={this.ref}
                    />
                </div>
            </div>
        );
    }
}

const mapState = state => {
    return {previous: !!state.previousTemp}
}

export default connect(mapState)(Slider);