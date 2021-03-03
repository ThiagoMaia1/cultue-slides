import React, { Component, useRef, useState, useEffect } from 'react';
import './Select.css';
import ArrowColapsar from '../ArrowColapsar/ArrowColapsar';
import useOutsideClick from '../../../principais/Hooks/useOutsideClick';
import useFilter from '../../../principais/Hooks/useFilter';

const Select = props => {
    
    let [opcoes, setOpcoes] = useState([]);
    let [aberto, setAberto] = useState(!!props.iniciaAberto);
    let [opcaoMarcada, setOpcaoMarcada] = useState();
    let ref = useOutsideClick(() => setAberto(false));
    let refPai = useRef();
    let [termo] = useFilter(aberto, ref);

    const onChange = (opcao, permanente = true) => {
        setOpcaoMarcada(opcao);
        if(permanente) {
            setAberto(false);
            if (props.onChange) props.onChange(opcao);
        }
    }

    const onClick = e => {
        setTimeout(() => setAberto(!aberto), 10);
        if(props.onClick) props.onClick(e);
    }

    useEffect(() => {
        const transformarOpcoesStringEmObjetos = opcoes => {
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

        setOpcoes(transformarOpcoesStringEmObjetos(props.opcoes));
        if (!opcaoMarcada) {
            let defaultValue;
            if(props.defaultValue) {
                let listaValor = props.opcoes.map(o => o.valor);
                defaultValue = props.opcoes[listaValor.indexOf(props.defaultValue)];
            }
            setOpcaoMarcada(defaultValue);
        }
    }, [props.opcoes, opcaoMarcada, props.defaultValue]);

    useEffect(() => {        
        setAberto(props.iniciaAberto);
    }, [props.iniciaAberto]);

    let regTermo = new RegExp(termo.toLowerCase());
    let { rotulo, textoSpan } = opcaoMarcada || {};
    return (
        <div id={props.id} className={'select-personalizado ' + (props.className || '')} ref={refPai}>
            <div className='base-select'
                    onClick={onClick}
                    tabIndex='0'
                    ref={ref}
                    style={props.style}>
                    <div className='container-opcao-marcada'>{termo || rotulo || textoSpan}</div>
                    <ArrowColapsar style={{top: '0.5vh', right: 0, color: '#aaa', position: 'absolute'}} colapsado={!aberto} tamanhoIcone={window.innerHeight*0.03}/>
            </div>
            <BlocoOpcoes {...props} callback={onChange} refSelect={ref} refPai={refPai} aberto={aberto} opcao={opcaoMarcada} 
                         opcoes={opcoes.filter(o => {
                            let nome = (o.rotulo || o.textoSpan || o.valor || ''); 
                            return regTermo.test(typeof nome === 'string' ? nome.toLowerCase() : nome);
                         })}/>
        </div>
    )
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
        if (o.eSeparador) return;
        clearTimeout(this.timeoutLeave);
        this.valorAnterior = null;
        this.props.callback(o);
        if (o.onClick) o.onClick();
        if (this.props.onClickOpcao) this.props.onClickOpcao(o);
    }

    onMouseEnter = o => {
        if (o.eSeparador) return;
        clearTimeout(this.timeoutLeave);
        if(!this.valorAnterior) this.valorAnterior = this.props.opcao;
        this.props.callback(o, false);
        if (this.props.onMouseEnterOpcao) this.props.onMouseEnterOpcao(o);
    }

    onMouseLeave = o => {
        if (o.eSeparador) return;
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
                         onMouseLeave={() => this.onMouseLeave(o)}
                         key={o.valor}>
                        <span>{o.textoSpan}</span>
                        <div key={o.valor} 
                             className={'opcao-select ' + (o.className || '')} 
                             style={{height: (this.tamanhoOpcao || 4) + 'vh', ...(o.style || {}), ...(this.props.estiloOpcao || {})}}>
                                <span>{o.rotulo}</span>
                        </div>
                    </div>
                )}
            </div>
        )
    }
}
  
export default Select;