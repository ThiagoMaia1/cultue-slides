import React, { Component } from 'react';
import store from '../../index';
import { enviarEmailTemplate } from '../MenuExportacao/ChamadaEnvioEmail';
import { connect } from 'react-redux';
import { msgEmailInvalido } from '../Login/Login';
import { eEmailValido } from '../../principais/FuncoesGerais'; 

class QuadroEnviar extends Component {

    constructor (props) {
        super(props);
        this.refEmail = React.createRef();
        this.state = {email: '', mensagem: '', emailInvalido: false, campoVazio: false};
    }
    
    conferirDados = () => {
        let { usuario, incluirRelatorio } = this.props;
        let { mensagem, email } = this.state;
        let emailInvalido = false;
        if (!usuario.uid) {
            if (eEmailValido(email)) usuario = {email};
            else emailInvalido = true;
        }
        this.setState({emailInvalido, campoVazio: !mensagem});
        if (!mensagem || emailInvalido) return;
        let dados = {
            mensagem,
            usuario
        };
        if (incluirRelatorio) dados.relatorio = store.getState();
        this.enviarEmail(dados);
    }

    enviarEmail = dados => {
        let nome = this.props.titulo + ' ' + new Date().toString();
        this.setState({enviando: true});
        enviarEmailTemplate(
            nome,
            undefined,
            undefined,
            'Arquivo em anexo com comunicação do usuário:\n' + (dados.usuario.nomeCompleto || '') + '\n' + dados.usuario.email + '\n\n' + dados.mensagem,
            undefined,
            {
                filename: nome + '.json',
                content: JSON.stringify(dados)
            },
            fazer => {
                if(fazer) this.props.fechar();
                this.setState({enviando: false});
            }
        )
    }

    render() {
        return(
            <div className='quadro-enviar' style={{pointerEvents: this.state.enviando ? 'none' : ''}}>
                {this.props.usuario.uid ? null :
                    <>
                        <div>
                            <div style={{marginBottom: '1vh'}}>Insira seu e-mail:</div>
                            <input id='username' ref={this.refEmail} className='combo-popup' placeholder='E-mail' type='email' value={this.state.email}
                                onChange={e => this.setState({email: e.target.value})}></input>
                        </div>
                        {!this.state.emailInvalido ? <br></br> :
                            <div className='mensagem-erro'>
                                <div>{msgEmailInvalido}</div>
                            </div>
                        }
                    </>
                }
                <div>{this.props.titulo}</div> 
                <textarea className='combo-popup inserir-lista-express' 
                          value={this.state.mensagem}
                          onChange={e => this.setState({mensagem: e.target.value})}/>
                {!this.state.campoVazio ? null :
                    <div className='mensagem-erro'>
                        Campo Requerido
                    </div>
                }
                <div className='linha-flex'>
                    <button className='botao' onClick={this.conferirDados}>
                        {this.props.textoBotao}
                    </button>
                    <div style={{minWidth: '2vw'}}></div>
                    <button className='botao limpar-input' onClick={() => this.props.fechar()}>✕ Cancelar</button>
                </div>
            </div>
        )
    }
}

const mapState = ({usuario}) => {
    let { nomeCompleto, email, uid } = usuario;
    return {usuario: {nomeCompleto, email, uid}};
}

export default connect(mapState)(QuadroEnviar);
