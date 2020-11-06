import React from 'react';
import { connect } from 'react-redux';
import './Login.css';
import { firebaseAuth, googleAuth } from "../../firebase";
import { gerarDocumentoUsuario } from './UsuarioBD';

function getMensagemErro(error) {
    var codigo = error.code.replace('auth/', '');
    switch (codigo) {
        case 'user-not-found':
            return 'Usuário não cadastrado.';
        case 'wrong-password':
            return 'Senha incorreta.';
        case 'user-disabled':
            return 'Usuário desabilitado.';
        case 'invalid-email':
            return 'Endereço de e-mail inválido.';
        case 'email-already-in-use':
            return 'Já existe uma conta cadastrada para esse e-mail.';
        case 'operation-not-allowed':
            return 'Operação não autorizada.';
        case 'weak-password':
            return 'Defina uma senha mais forte.';
        default:
            return '';
    }
}

const listaCargos = ['Pastor', 'Presbítero', 'Diácono', 'Líder de Jovens', 'Líder de Ministério de Mulheres',
                     'Líder de Ministério de Homens', 'Secretário(a)', 'Funcionário da Igreja', 'Membro Voluntário', 'Outro'
]

class Login extends React.Component {

    constructor (props) {
        super(props);
        this.state = {email: '', senha: '', erro: '', nomeCompleto: '', cadastrando: false}
    }

    entrar = event => {
        event.preventDefault();
        this.setState({erro: ''});
        if (this.state.cadastrando) { 
            this.criarUsuarioComEmailSenha();
        } else {
            firebaseAuth.signInWithEmailAndPassword(this.state.email, this.state.senha).catch(error => {
                this.setState({erro: getMensagemErro(error)});
                console.error(error);
            });
        }
    };

    criarUsuarioComEmailSenha = async () => {
        try{
            const { user } = await firebaseAuth.createUserWithEmailAndPassword(this.state.email, this.state.senha);
            gerarDocumentoUsuario(user, {nomeCompleto: this.state.nomeCompleto, cargo: this.state.cargo});
        }
        catch(error){
            this.setState({erro: getMensagemErro(error)});
        }

        // setEmail("");
        // setPassword("");
        // setDisplayName("");
    };

    cadastrando = () => {
        this.setState({cadastrando: true});
    }

    componentDidMount = async () => {
        firebaseAuth.onAuthStateChanged(async userAuth => {
            console.log(this.props.usuario, userAuth);
          if (!(userAuth || this.props.usuario) || (this.props.usuario && userAuth && userAuth.id === this.props.usuario.id)) return;
          const user = await gerarDocumentoUsuario(userAuth);
          this.props.dispatch({type: 'login', usuario: user});
          this.props.callback();
        });
      };

    acessarPerfilUsuario = () => {
        //todo
    }

    render() {
        if (!this.props.ativo) return null;
        return (
        <div id='container-login' className={this.props.fundo ? 'fundo-login' : ''}>
            <div className='wraper-login'>
                <div id='quadro-login' className={this.props.fundo ? 'quadro-centralizado' : ''}>
                    {this.props.usuario 
                        ? <>
                            <button className='botao-azul botao' onClik={this.acessarPerfilUsuario}>Meu Perfil</button>  
                            <button className='botao limpar-input' onClick={() => firebaseAuth.signOut()}>✕ Sair</button>
                          </>
                        :  
                        <>
                            <form className='inputs-login'> 
                                <input id='username' className='combo-popup' placeholder='E-mail' type='email' value={this.state.email}
                                        onChange={e => this.setState({email: e.target.value})}></input>
                                <input id='password' className='combo-popup' placeholder='Senha' type='password' value={this.state.senha}
                                        onChange={e => this.setState({senha: e.target.value})}></input>
                                {this.state.cadastrando ?
                                    <>
                                        <input id='nome-completo' className='combo-popup' placeholder='Nome Completo' type='text' 
                                            value={this.state.nomeCompleto} onChange={e => this.setState({nomeCompleto: e.target.value})}></input>
                                        <select id='cargo-usuario' className='combo-popup' placeholder='Cargo' type='select' value={this.state.cargo}
                                            onChange={e => this.setState({cargo: e.target.value})}>
                                                {listaCargos.map((c, i) => <option key={i} value={c}>{c}</option>)}
                                        </select>
                                    </> 
                                    : null 
                                    
                                }
                                <div className='mensagem-erro'>
                                    <div>{this.state.erro}</div>
                                </div>
                                <button className='botao-azul botao' onClick={this.entrar}>Entrar</button>
                            </form>
                            {this.state.cadastrando ? null :
                                <>
                                    <hr></hr>
                                    <button id='login-google' className='botao limpar-input' 
                                            onClick={() => firebaseAuth.signInWithPopup(googleAuth)}>Entrar com Google</button>
                                    <button id='cadastre-se' className='itens' onClick={this.cadastrando}>
                                        Cadastre-se
                                    </button>
                                    <button id='esqueceu-senha'>Esqueceu sua senha?</button>
                                </>
                            }
                        </>
                    }
                </div>
                {this.props.fundo 
                    ? <div id='comece-usar' className='botao-azul' onClick={this.props.callback}>
                          <div>Comece a Usar</div></div>
                    : null}
            </div>
        </div>
        );
    }
};

const mapStateToProps = state => {
  return {usuario: state.usuario};
}

export default connect(mapStateToProps)(Login);
  