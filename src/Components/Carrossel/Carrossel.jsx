import React, { Component } from 'react';
import './Carrossel.css';
import { connect } from 'react-redux';
import { MdKeyboardArrowUp, MdKeyboardArrowRight, MdKeyboardArrowDown, MdKeyboardArrowLeft } from 'react-icons/md';

class Carrossel extends Component {

    constructor (props) {
        super(props);
        this.state = {...props, estilo: {}};
        this.refGaleria = React.createRef();
        this.refCarrossel = React.createRef();
        this.corGradiente = this.props.corGradiente || 'rgba(255, 255, 255, 9)';
        this.percentualBeirada = this.props.percentualBeirada || 0;

        if (this.props.direcao === 'vertical') {
            this.direcao = 'top'
            this.setaUm = MdKeyboardArrowUp;
            this.setaDois = MdKeyboardArrowDown;
            this.estiloSeta = {height: '10%', width: '100%', flexDirection: 'column'};
            this.state.estiloSetaUm = {backgroundImage: 'linear-gradient(to bottom, ' + this.corGradiente + ', rgba(0,0,0,0))', top: '0', opacity: '0'};
            this.state.estiloSetaDois = {backgroundImage: 'linear-gradient(to top, ' + this.corGradiente + ', rgba(0,0,0,0))', bottom: '0', opacity: '0'};
            this.style = {maxHeight: this.props.tamanhoMaximo}
        } else {
            this.direcao = 'left';
            this.setaUm = MdKeyboardArrowLeft;
            this.setaDois = MdKeyboardArrowRight;
            this.estiloSeta = {height: '100%', width: '10%', flexDirection: 'row'}
            this.state.estiloSetaUm = {backgroundImage: 'linear-gradient(to right, ' + this.corGradiente + ', rgba(0,0,0,0))', left: '0', opacity: '0'};
            this.state.estiloSetaDois = {backgroundImage: 'linear-gradient(to left, ' + this.corGradiente + ', rgba(0,0,0,0))', right: '0', opacity: '0'};
            this.style = {maxWidth: this.props.tamanhoMaximo}
        }
        this.style = {...this.style, ...this.props.style};
        this.estiloSeta = {...this.estiloSeta, color: this.props.corSeta || 'gray'}

        this.state.estilo[this.direcao] = '0';
    }

    deslizar = (sentido, tamanhoPasso = 20) => {
        var o = Number(this.state.estilo[this.direcao]);
        var passo = - sentido*tamanhoPasso;

        this.setState({estiloSetaUm: {...this.state.estiloSetaUm, display: ''}, estiloSetaDois: {...this.state.estiloSetaDois, display: ''}});
        
        if (sentido < 0 && o + passo < this.state.tamanhoCarrossel*this.percentualBeirada) {
            if (this.state.estiloSetaUm.opacity === '0') this.setState({estiloSetaUm: {...this.state.estiloSetaUm, opacity: '1'}});
        } else if (sentido > 0 && o + passo > this.state.tamanhoCarrossel*(1-this.percentualBeirada) - this.state.tamanhoGaleria) {
            if (this.state.estiloSetaDois.opacity === '0') this.setState({estiloSetaDois: {...this.state.estiloSetaDois, opacity: '1'}});
        } else {
            this.setState({estiloSetaUm: {...this.state.estiloSetaUm, opacity: '0'}, estiloSetaDois: {...this.state.estiloSetaDois, opacity: '0'}})
            return;
        }        

        clearInterval(this.animacao);
        this.animacao = setInterval(() => {
            var o = Number(this.state.estilo[this.direcao]);
            var passo = - sentido*tamanhoPasso;
            if (o + passo > this.state.tamanhoCarrossel*this.percentualBeirada || o + passo < this.state.tamanhoCarrossel*(1-this.percentualBeirada) - this.state.tamanhoGaleria) {
                if (sentido === -1) {
                    this.setState({estiloSetaUm: {...this.state.estiloSetaUm, display: 'none'}});
                } else {
                    this.setState({estiloSetaDois: {...this.state.estiloSetaDois, display: 'none'}});
                }
                clearInterval(this.animacao);
            } else {
                var objEstilo = {};
                objEstilo[this.direcao] = o + passo;
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
            this.setState({tamanhoCarrossel: this.refCarrossel.current.offsetHeight, tamanhoGaleria: this.refGaleria.current.offsetHeight});
        } else {
            this.setState({tamanhoCarrossel: this.refCarrossel.current.offsetWidth, tamanhoGaleria: this.refGaleria.current.offsetWidth});
        }
        if (this.state.tamanhoCarrossel >= this.state.tamanhoGaleria && this.state.estilo[this.direcao] !== '0') {
            var objEstilo = {};
            objEstilo[this.direcao] = '0';
            this.setState({estilo: objEstilo});
        }
        console.log(this.state);
    }

    render () {
        var SetaUm = this.setaUm;
        var SetaDois = this.setaDois;
        return (
            <div ref={this.refCarrossel} className='carrossel' onMouseOver={this.onMouseOver} style={this.style}>
                {this.state.tamanhoGaleria > this.state.tamanhoCarrossel ? 
                    <>
                        <div className="seta-galeria" 
                             onMouseOver={() => this.deslizar(-1)} 
                             onMouseLeave={this.pararDeslizar}
                             onClick={() => this.saltar(-1)}
                             style={{...this.estiloSeta, ...this.state.estiloSetaUm}}>
                             <SetaUm size={this.props.tamanhoIcone}/></div>
                        <div className="seta-galeria" 
                             onMouseOver={() => this.deslizar(1)} 
                             onMouseLeave={this.pararDeslizar}
                             onClick={() => this.saltar(1)}
                             style={{...this.estiloSeta, ...this.state.estiloSetaDois}}>
                             <SetaDois size={this.props.tamanhoIcone}/></div>
                    </> : null}
                <div className='container-galeria'>
                    <div ref={this.refGaleria} className='movimentador-galeria' style={this.state.estilo}>
                        {this.props.children}
                    </div>                    
                </div>
            </div>
        )
    }
}
 
export default connect()(Carrossel);