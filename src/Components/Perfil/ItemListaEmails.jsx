import React from 'react';
import { connect } from 'react-redux';
import { gerarNovoRegistro, atualizarRegistro } from '../../firestore/apiFirestore';
import Checkbox from '../Checkbox/Checkbox';

export const colecaoEmails = 'emails';
  
class ItemListaEmails extends React.Component {
  
    constructor (props) {
        super(props);
        this.state = {
            enderecoEmail: props.enderecoEmail, 
            nomeCompleto: props.nomeCompleto, 
            eProprio: !!props.eProprio, 
            editandoEmail: !props.idEmail, 
            editandoNome: !props.idEmail}
    }   
      
    atualizarEnderecoEmail = e => {
        var enderecoEmail = e.target.value;
        if (!enderecoEmail) return;
        this.setState({enderecoEmail: enderecoEmail});
        this.setState({editandoEmail: false});
        this.atualizarEmailBD();
    }

    atualizarNomeCompleto = e => {
        var nomeCompleto = e.target.value;
        if (!nomeCompleto) return;
        this.setState({nomeCompleto: nomeCompleto});
        this.setState({editandoNome: false});
        this.atualizarEmailBD();
    }

    atualizarEProprio = () => {
        this.setState({eProprio: !this.state.eProprio});
        this.atualizarEmailBD();
    }

    atualizarEmailBD = () => {
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
        this.props.callback();
    }

    gerarNovoEmail = () => {
        gerarNovoRegistro(
            this.props.usuario.uid,
            colecaoEmails,
            {
                enderecoEmail: this.state.enderecoEmail,
                eProprio: this.state.eProprio
            }
        );
    };
    
    render() {
        return (
            <div className='item-lista-perfil'>
                {this.state.editandoNome
                    ? <input type='text' className='combo-popup' placeholder='Nome Completo'
                        onBlur={this.atualizarNomeCompleto} 
                        value={this.state.nomeCompleto}></input>
                    : <div tabIndex='0' onFocus={() => this.setState({editandoNome: true})}>{this.state.nomeCompleto}</div>
                }
                {this.state.editandoEmail
                    ? <input type='text' className='combo-popup' placeholder='Endereço de E-mail'
                             onBlur={this.atualizarEnderecoEmail} 
                             value={this.state.enderecoEmail}></input>
                    : <div tabIndex='0' onFocus={() => this.setState({editandoEmail: true})}>{this.state.enderecoEmail}</div>
                }
                <Checkbox checked={this.state.eProprio} label='E-mail Próprio' onClick={this.atualizarEProprio} />
            </div>
        );
    }
};
  
const mapStateToProps = state => {
    return {usuario: state.usuario};
}

export default connect(mapStateToProps)(ItemListaEmails);
  