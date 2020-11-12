import React from 'react';
import { connect } from 'react-redux';
import { gerarNovoRegistro, atualizarRegistro, excluirRegistro } from '../../firestore/apiFirestore';
import Checkbox from '../Checkbox/Checkbox';
import PopupConfirmacao from '../Configurar/Popup/PopupConfirmacao';

export const colecaoEmails = 'emails';

export const eEmailValido = enderecoEmail => {
    return /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(enderecoEmail);
}
  
class ItemListaEmails extends React.Component {
  
    constructor (props) {
        super(props);
        this.state = {
            enderecoEmail: props.enderecoEmail || '', 
            nomeCompleto: props.nomeCompleto || '', 
            eProprio: !!props.eProprio, 
            editando: !props.idEmail,
            popupAtivo: false,
            emailInvalido: false
        }
        this.ref = React.createRef();
    }
      
    editar = () => {
        this.setState({editando: true})
        setTimeout(() => this.ref.current.focus(), 100);
    }

    atualizarEnderecoEmail = (e, conferir) => {
        var enderecoEmail = e.target.value;
        if (!conferir || eEmailValido(enderecoEmail)) {
            this.setState({enderecoEmail: enderecoEmail, emailInvalido: false});
        } else {
            this.setState({popupAtivo: true, emailInvalido: true});
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
        if (this.props.idEmail) {
            setTimeout(() => atualizarRegistro(
                {
                    enderecoEmail: this.state.enderecoEmail,
                    nomeCompleto: this.state.nomeCompleto
                },
                colecaoEmails,
                this.props.idEmail
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
        await excluirRegistro(this.props.idEmail, colecaoEmails);
        this.props.callback();
    }

    render() {
        return (
            <>
                {this.state.popupAtivo
                    ? <PopupConfirmacao
                        botoes='OK' 
                        titulo='E-mail Inválido' 
                        pergunta='Insira um endereço de e-mail válido.'
                        callback={() => this.setState({popupAtivo: false})}/>
                    : null
                }
                <div className='item-lista-perfil'>
                    <div className='dados-verticais-item-lista-perfil'>
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
                                           style={this.state.popupAtivo ? {borderColor: 'var(--vermelho-forte)'} : null}
                                           value={this.state.enderecoEmail}
                                           onBlur={e => this.atualizarEnderecoEmail(e, true)}></input>
                                : <div>{this.state.enderecoEmail}</div>
                            }
                        </div>
                    </div>
                    <Checkbox checked={this.state.eProprio} label='E-mail Próprio' onClick={this.atualizarEProprio} />
                    <div className='dados-verticais-item-lista-perfil' style={this.props.idEmail ? null : {visibility: 'hidden'}}>
                        <div><span>Data de Modificação: {this.props.data}</span></div>
                    </div>
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
                                style={this.props.idEmail ? null : {visibility: 'hidden'}}>
                            Excluir
                        </button>
                    </div>
                </div>
            </>
        );
    }
};
  
const mapStateToProps = state => {
    return {usuario: state.usuario};
}

export default connect(mapStateToProps)(ItemListaEmails);