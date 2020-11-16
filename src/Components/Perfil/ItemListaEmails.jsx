import React from 'react';
import { connect } from 'react-redux';
import { gerarNovoRegistro, atualizarRegistro, excluirRegistro } from '../../firestore/apiFirestore';
import Checkbox from '../Checkbox/Checkbox';
import { ativarPopupConfirmacao } from '../Popup/PopupConfirmacao';

export const colecaoEmails = 'emails';

export const eEmailValido = enderecoEmail => {
    return /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(enderecoEmail);
}
  
class ItemListaEmails extends React.Component {
  
    constructor (props) {
        super(props);
        var e = props.objEmail;
        this.idEmail = e.id;
        this.data = e.data;
        this.state = {
            enderecoEmail: e.enderecoEmail || '', 
            nomeCompleto: e.nomeCompleto || '', 
            eProprio: !!e.eProprio, 
            editando: !e.id,
            emailValido: false,
            emailSelecionado: false
        }
        this.ref = React.createRef();
        this.selecionarEmail = () => {
            if(this.props.selecionarEmail) {
                var novoStatus = !this.state.emailSelecionado;
                this.props.selecionarEmail(this.props.objEmail, novoStatus);
                this.setState({emailSelecionado: novoStatus})
            } 
        }
    }
      
    editar = () => {
        this.setState({editando: true})
        setTimeout(() => this.ref.current.focus(), 100);
    }

    atualizarEnderecoEmail = (e, conferir) => {
        var enderecoEmail = e.target.value;
        var valido = eEmailValido(enderecoEmail);
        this.setState({enderecoEmail: enderecoEmail, emailValido: valido});
        if (!valido && conferir) {
            ativarPopupConfirmacao('OK', 'E-mail Inválido', 'Insira um endereço de e-mail válido.');
        }
    }

    atualizarNomeCompleto = e => {
        this.setState({nomeCompleto: e.target.value});
    }

    atualizarEProprio = () => {
        this.setState({eProprio: !this.state.eProprio});
    }

    atualizarEmailBD = () => {
        if (!this.state.enderecoEmail || !this.state.nomeCompleto) return;
        if (this.idEmail) {
            setTimeout(() => atualizarRegistro(
                {
                    enderecoEmail: this.state.enderecoEmail,
                    nomeCompleto: this.state.nomeCompleto
                },
                colecaoEmails,
                this.idEmail
            ), 10);
        } else if (this.state.nomeCompleto && this.state.enderecoEmail) {
            this.gerarNovoEmail();
        }
        this.setState({editando: false})
        this.props.callback();
    }

    gerarNovoEmail = () => {
        gerarNovoRegistro(
            this.props.usuario.uid,
            colecaoEmails,
            {
                enderecoEmail: this.state.enderecoEmail,
                nomeCompleto: this.state.nomeCompleto,
                eProprio: this.state.eProprio
            }
        );
    };

    excluirEmail = async () => {
        await excluirRegistro(this.idEmail, colecaoEmails);
        this.props.callback();
    }

    render() {
        var selecao = !!this.props.selecionarEmail;
        return (
            <div className='item-lista-perfil email' style={selecao ? {background: 'var(--platinum-forte)'} : null}>
                {selecao
                    ? <Checkbox checked={this.state.emailSelecionado} label='' onClick={this.selecionarEmail} size='2.4vh' style={{flex: 'none'}}/>
                    : null
                }
                <div className='container-email'>
                    <div className='dados-verticais-item-lista-perfil dados'>
                        <div><span>Nome: </span>
                            {this.state.editando
                                ?  <input type='text' className='combo-popup' 
                                            placeholder='Nome Completo'
                                            onChange={this.atualizarNomeCompleto} 
                                            value={this.state.nomeCompleto}
                                            ref={this.ref}></input>
                                : <div>{this.state.nomeCompleto}</div>
                            }
                        </div>
                        <div><span>E-mail: </span>
                            {this.state.editando
                                ?   <input type='text' className='combo-popup' 
                                            placeholder='Endereço de E-mail'
                                            onChange={this.atualizarEnderecoEmail} 
                                            value={this.state.enderecoEmail}
                                            onBlur={e => this.atualizarEnderecoEmail(e, true)}></input>
                                : <div>{this.state.enderecoEmail}</div>
                            }
                        </div>
                    </div>
                </div>
                {selecao
                    ? null
                    : <><Checkbox checked={this.state.eProprio} label='E-mail Próprio' onClick={this.atualizarEProprio}/>
                        <div className='dados-verticais-item-lista-perfil data' style={this.idEmail ? null : {visibility: 'hidden'}}>
                            <div><span>Data de Modificação: {this.data}</span></div>
                        </div></>
                }
                <div className='container-botoes-item-lista-perfil'>
                    {this.state.editando
                        ? <button className='botao-azul botao' 
                                    onClick={this.atualizarEmailBD}
                                    style={eEmailValido(this.state.enderecoEmail) && this.state.nomeCompleto ? null : {visibility: 'hidden'}}>
                            Salvar
                            </button>
                        : <button className='botao-azul botao' onClick={this.editar}>Editar</button>
                    }
                    <button className='botao limpar-input' 
                            onClick={this.excluirEmail}
                            style={this.idEmail ? null : {visibility: 'hidden'}}>
                        Excluir
                    </button>
                </div>
            </div>
        );
    }
};
  
const mapState = state => {
    return {usuario: state.usuario};
}

export default connect(mapState)(ItemListaEmails);