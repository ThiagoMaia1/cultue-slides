import React, { Component } from 'react';
import './Carrossel.css';
import { connect } from 'react-redux';
import { MdKeyboardArrowUp, MdKeyboardArrowRight, MdKeyboardArrowDown, MdKeyboardArrowLeft } from 'react-icons/md';

class Carrossel extends Component {

    constructor (props) {
        super(props);
        this.state = {...props, estilo: {}};
        this.refCarrossel = React.createRef();
        
        if (this.props.direcao === 'vertical') {
            this.direcao = 'top'
            this.setaUm = MdKeyboardArrowUp;
            this.setaDois = MdKeyboardArrowDown;
            this.estiloSeta = {height: '10%', width: '100%'};
            this.state.estiloSetaUm = {backgroundImage: 'linear-gradient(to bottom, rgba(255,255, 255, 0.9), rgba(0,0,0,0))', top: '0', opacity: '0'};
            this.state.estiloSetaDois = {backgroundImage: 'linear-gradient(to top, rgba(255,255, 255, 0.9), rgba(0,0,0,0))', bottom: '0', opacity: '0'};
            this.style = {maxHeight: this.props.tamanhoMaximo}
        } else {
            this.direcao = 'left';
            this.setaUm = MdKeyboardArrowLeft;
            this.setaDois = MdKeyboardArrowRight;
            this.estiloSeta = {height: '100%', width: '10%'}
            this.state.estiloSetaUm = {backgroundImage: 'linear-gradient(to right, rgba(255,255, 255, 0.9), rgba(0,0,0,0))', left: '0', opacity: '0'};
            this.state.estiloSetaDois = {backgroundImage: 'linear-gradient(to left, rgba(255,255, 255, 0.9), rgba(0,0,0,0))', right: '0', opacity: '0'};
            this.style = {maxWidth: this.props.tamanhoMaximo}
        }
        this.style = {...this.style, ...this.props.style}
        
        this.state.estilo[this.direcao] = '0px';
    }

    deslizar = (sentido, tamanhoPasso = 20) => {
        var o = Number(this.state.estilo[this.direcao].replace('px',''));
        var passo = - sentido*tamanhoPasso;
        
        if (sentido < 0 && o + passo < this.state.tamanhoCarrossel*0.1) {
            if (this.state.estiloSetaUm.opacity === '0') this.setState({estiloSetaUm: {...this.state.estiloSetaUm, opacity: '1'}});
        } else if (sentido > 0 && o + passo > this.state.tamanhoCarrossel*0.9 - this.state.tamanhoGaleria*1) {
            if (this.state.estiloSetaDois.opacity === '0') this.setState({estiloSetaDois: {...this.state.estiloSetaDois, opacity: '1'}});
        } else {
            this.setState({estiloSetaUm: {...this.state.estiloSetaUm, opacity: '0'}, estiloSetaDois: {...this.state.estiloSetaDois, opacity: '0'}})
            return;
        }        

        clearInterval(this.animacao);
        this.animacao = setInterval(() => {
            var o = Number(this.state.estilo[this.direcao].replace('px',''));
            var passo = - sentido*tamanhoPasso;
            if (o + passo > this.state.tamanhoCarrossel*0.1 || o + passo < this.state.tamanhoCarrossel*0.9 - this.state.tamanhoGaleria*1) {
                clearInterval(this.animacao);
            } else {
                var objEstilo = {};
                objEstilo[this.direcao] = o + passo + 'px';
                this.setState({estilo: objEstilo});
            }
        }, 40);
    }

    saltar(sentido) {
        this.deslizar(sentido, 120); 
        setTimeout(() => {
            clearInterval(this.animacao)
            this.deslizar(sentido)
        }, 200);
    }

    pararDeslizar = () => {
        this.setState({estiloSetaUm: {...this.state.estiloSetaUm, opacity: '0'}, estiloSetaDois: {...this.state.estiloSetaDois, opacity: '0'}})
        clearInterval(this.animacao);
    }

    onMouseOver = () => {
        if (this.direcao === 'top') {
            this.setState({tamanhoCarrossel: this.refCarrossel.current.offsetHeight, tamanhoGaleria: this.state.refGaleria.current.offsetHeight});
        } else {
            this.setState({tamanhoCarrossel: this.refCarrossel.current.offsetWidth, tamanhoGaleria: this.state.refGaleria.current.offsetWidth});
        }
    }

    render () {
        var SetaUm = this.setaUm;
        var SetaDois = this.setaDois;
        return (
            <div ref={this.refCarrossel} className='carrossel' onMouseOver={this.onMouseOver} style={this.style}>
                {this.state.tamanhoGaleria > this.state.tamanhoCarrossel ? <><SetaUm size={this.props.tamanhoIcone} 
                                     className="seta-galeria esquerda" 
                                     onMouseOver={() => this.deslizar(-1)} 
                                     onMouseLeave={this.pararDeslizar}
                                     onClick={() => this.saltar(-1)}
                                     style={{...this.estiloSeta, ...this.state.estiloSetaUm}}/>
                <SetaDois size={this.props.tamanhoIcone} 
                                      className="seta-galeria direita" 
                                      onMouseOver={() => this.deslizar(1)} 
                                      onMouseLeave={this.pararDeslizar}
                                      onClick={() => this.saltar(1)}
                                      style={{...this.estiloSeta, ...this.state.estiloSetaDois}}/></> : null}
                <div className='container-galeria'>
                    <div className='movimentador-galeria' style={this.state.estilo}>
                        {this.props.children}
                    </div>                    
                </div>
            </div>
        )
    }
}
 
export default connect()(Carrossel);