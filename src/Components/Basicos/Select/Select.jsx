import React, { Component } from 'react';
import './Select.css';
import ArrowColapsar from '../ArrowColapsar/ArrowColapsar';
import { objetosSaoIguais } from '../../../principais/FuncoesGerais';

class Select extends Component {
  
    constructor (props) {
        super(props);
        this.ref = React.createRef();
        this.refPai = React.createRef();
        let opcoes = this.transformarOpcoesStringEmObjetos(props.opcoes);
        let defaultValue;
        if(props.defaultValue) {
            let listaValor = opcoes.map(o => o.valor);
            defaultValue = opcoes[listaValor.indexOf(props.defaultValue)];
        }
        this.state = {aberto: false, opcoes, opcao: defaultValue || {}};
    }

    abrir = () => this.setState({aberto: true});
    fechar = () => this.setState({aberto: false});

    toggleAberto = () => {
        this.state.aberto
        ? this.fechar()
        : this.abrir()
    }

    onChange = (opcao, permanente = true) => {
        this.setState({opcao});
        if(permanente) {
            this.setState({aberto: false});
            if (this.props.onChange) this.props.onChange(opcao);
        }
    }

    onClick = e => {
        setTimeout(() => this.toggleAberto(), 10);
        if(this.props.onClick) this.props.onClick(e);
    }

    componentDidUpdate = (prevProps) => {
        if(!objetosSaoIguais(prevProps.opcoes, this.props.opcoes))
            this.setState({opcoes: this.transformarOpcoesStringEmObjetos(this.props.opcoes)});
    }

    transformarOpcoesStringEmObjetos = opcoes => {
        if (/string|number/.test(typeof opcoes[0])) {
            opcoes = opcoes.map(o => {
                o.valor = o;
                o.rotulo = o;
                return o;
            }) 
        }
        opcoes = opcoes.map(o => {
            if (o.rotulo === undefined) o.rotulo = o.valor;
            return o;
        })
        return opcoes;
    }

    render() {
        return (
            <div className={'select-personalizado ' + (this.props.className || '')} ref={this.refPai}>
                <div className='base-select'
                     onFocusOut={this.fechar}
                     onClick={this.onClick}
                     tabIndex='0'
                     ref={this.ref}
                     style={this.props.style}>
                     <div className='container-opcao-marcada'>{this.state.opcao.rotulo || this.state.opcao.textoSpan}</div>
                     <ArrowColapsar style={{top: '0.5vh', right: 0, color: '#aaa', position: 'absolute'}} colapsado={!this.state.aberto} tamanhoIcone={window.innerHeight*0.03}/>
                </div>
                <BlocoOpcoes {...this.props} callback={this.onChange} refSelect={this.ref} refPai={this.refPai} aberto={this.state.aberto} opcao={this.state.opcao} opcoes={this.state.opcoes}/>
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

    abrir = () => {
        let alturaBody = document.body.getBoundingClientRect().height;
        let top = this.getTopLeft().top;
        this.setState({maxHeight: alturaBody - top -15 + 'px'})
    }

    fechar = () => this.setState({maxHeight: 0});

    componentDidUpdate = prevProps => {
        if (prevProps.aberto !== this.props.aberto) {
            this.props.aberto
            ? this.abrir()
            : this.fechar()
        }
    }

    onClick = o => {
        clearTimeout(this.timeoutLeave);
        this.valorAnterior = null;
        this.props.callback(o);
        if (o.onClick) o.onClick();
        if (this.props.onClickOpcao) this.props.onClickOpcao(o);
    }

    onMouseEnter = o => {
        clearTimeout(this.timeoutLeave);
        if(!this.valorAnterior) this.valorAnterior = this.props.opcao;
        this.props.callback(o, false);
        if (this.props.onMouseEnterOpcao) this.props.onMouseEnterOpcao(o);
    }

    onMouseLeave = o => {
        this.timeoutLeave = setTimeout(() => {
            if(this.valorAnterior) {
                this.props.callback(this.valorAnterior, false);
                this.valorAnterior = null;
                if (this.props.onMouseLeaveOpcao) this.props.onMouseLeaveOpcao(o);
            }
        }, 10);
    }

    getTopLeft = () => {
        if (!this.props.refSelect.current) return {top: 0, bottom: 0};
        return {
            top: this.props.refSelect.current.getBoundingClientRect().bottom, 
            left: this.props.refPai.current.getBoundingClientRect().left
        };
    }

    render () {
        return (
            <div className='bloco-opcoes' style={{...this.getTopLeft(), maxHeight: this.state.maxHeight, ...this.props.estiloBloco}}>
                {this.props.opcoes.map(o => 
                    <div onClick={() => this.onClick(o)} 
                         onMouseEnter={() => this.onMouseEnter(o)}
                         onMouseLeave={() => this.onMouseLeave(o)}>
                        <span>{o.textoSpan}</span>
                        <div key={o.valor} 
                            className={'opcao-select ' + o.className || ''} 
                            style={{height: (this.tamanhoOpcao || 4) + 'vh', ...(o.style || {}), ...(this.props.estiloOpcao || {})}} 
                            >
                                <span>{o.rotulo}</span>
                        </div>
                    </div>
                )}
            </div>
        )
    }
}
  
export default Select;