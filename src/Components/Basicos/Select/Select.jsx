import React, { Component } from 'react';
import './Select.css';

class Select extends Component {
  
    constructor (props) {
        super(props);
        this.ref = React.createRef();
        this.state = {aberto: false, opcao: {valor: this.props.defaultValue}};
    }

    abrir = () => this.setState({aberto: true});
    fechar = () => this.setState({aberto: false});

    toggleAberto = () => {
        this.state.aberto
        ? this.fechar()
        : this.abrir()
    }

    onChange = opcao => {
        this.setState({opcao, aberto: false});
        if (this.props.onChange) this.props.onChange(opcao);
    }

    onClick = e => {
        setTimeout(() => this.toggleAberto(), 10);
        if(this.props.onClick) this.props.onClick(e);
    }

    render() {
        return (
            <div>
                <div className={'select-personalizado ' + (this.props.className || '')} 
                     onFocus={this.abrir} 
                    //  onBlur={this.fechar}
                     onClick={this.onClick}
                     tabIndex='0'
                     ref={this.ref}>
                     {this.state.opcao.valor}
                </div>     
                {!this.state.aberto ? null :
                    <BlocoOpcoes {...this.props} callback={this.onChange} refSelect={this.ref}/>}
            </div>
        )
    }
};

class BlocoOpcoes extends Component {
    
    constructor (props) {
        super(props);
        this.state = {maxHeight: 0};
        this.tamanhoOpcao = props.tamanhoOpcao || 4;
    }

    componentDidMount = () => {
        setTimeout(() => this.setState({maxHeight: Math.min(this.props.opcoes.length*this.tamanhoOpcao, 80) + 'vh'}), 0);
    }

    onClick = o => {
        this.props.callback(o);
        if (o.onClick) o.onClick();
        if(this.props.onClickOpcao) this.props.onClickOpcao(o);
    }

    onMouseOver = o => {
        if (this.props.onMouseOverOpcao) this.props.onMouseOverOpcao(o);
    }

    onMouseOut = o => {
        if (this.props.onMouseOutOpcao) this.props.onMouseOutOpcao(o);
    }

    getTopLeft = () => {
        let pos = this.props.refSelect.current.getBoundingClientRect();
        return {top: pos.bottom, left: pos.left};
    }

    render () {
        return (
            <div className='bloco-opcoes' style={{...this.getTopLeft(), maxHeight: this.state.maxHeight, ...this.props.estiloBloco}}>
                {this.props.opcoes.map(op => {
                        let o = {};
                        if (typeof op === 'string') {
                            o.rotulo = op; 
                            o.valor = op;
                        } else if (typeof op === 'object') {
                            o = op;
                        }
                        if (o.rotulo === undefined) o.rotulo = o.valor;
                        return (
                            <div key={o.valor} 
                                className={'opcao-select ' + o.className || ''} 
                                style={{height: (this.tamanhoOpcao || 4) + 'vh', ...(o.style || {}), ...(this.props.estiloOpcao || {})}} 
                                onClick={() => this.onClick(o)} 
                                onMouseOver={() => this.onMouseOver(o)}
                                onMouseOut={() => this.onMouseOut(o)}>
                                    {o.rotulo}
                            </div>
                        )
                })}
            </div>
        )
    }
}
  
export default Select;