import React from 'react';
import { connect } from 'react-redux';
import './Login.css';
import { firebaseAuth, googleAuth } from "../../firebase";
import { gerarDocumentoUsuario } from '../../firestore/apiFirestore';
import { definirApresentacaoAtiva, getApresentacoesUsuario } from '../../firestore/apresentacoesBD';
import { ativarPopupConfirmacao } from '../Popup/PopupConfirmacao';

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
        this.ref = React.createRef();
        this.ref1 = React.createRef();
        this.state = {email: '', senha: '', erro: '', nomeCompleto: '', logando: true, cadastrando: false}
    }

    entrar = event => {
        event.preventDefault();
        this.setState({erro: ''});
        if (this.state.cadastrando && this.state.logando) { 
            this.criarUsuarioComEmailSenha();
        } else if(!this.state.logando) { 
            gerarDocumentoUsuario(this.props.usuario, {nomeCompleto: this.state.nomeCompleto, cargo: this.state.cargo});
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
    };

    cadastrando = () => {
        this.setState({cadastrando: true});
    }

    clickFora = e => {
        if (!this.props.callback) return;
        if (!this.ref.current) return;
        if (!this.ref.current.contains(e.target)) {
            this.removerEventListener();
        }
    }

    removerEventListener = () => {
        if (!this.props.callback) return;
        document.removeEventListener("click", this.clickFora, false);
        this.props.callback();
    }

    definirApresentacaoUsuario = user => {
        var z = this.props.apresentacao.zerada;
        if (!user.uid) {
            if (!z)
                definirApresentacaoAtiva(user, {id: 0}, this.props.elementos)
            return
        }
        if (!z) {
            ativarPopupConfirmacao(
                'SimNao', 
                'Apresentação', 
                'Deseja continuar editando a apresentação atual?', 
                fazer => {
                    if(fazer) {
                        this.associarApresentacaoUsuario(user);
                    } else {
                        this.selecionarUltimaApresentacaoUsuario(user);
                    }
                }
            )
        } else {
            this.selecionarUltimaApresentacaoUsuario(user);
        }
    }

    associarApresentacaoUsuario = user => {
        definirApresentacaoAtiva(
            user, 
            this.props.apresentacao,
            this.props.elementos
        )
    }

    selecionarUltimaApresentacaoUsuario = async user => {
        var apresentacoes = await getApresentacoesUsuario(user.uid);
        if (apresentacoes.length !== 0) {
            var oneDay = 24 * 60 * 60 * 1000; // ms
            var tempoDecorrido = (new Date()) - apresentacoes[0].timestamp.toDate();
            if(tempoDecorrido < 7*oneDay)
                definirApresentacaoAtiva(user, apresentacoes[0]);
        }
    }

    componentDidMount = async () => {
        if (this.ref1.current) this.ref1.current.focus();
        if (this.props.callback) document.addEventListener("click", this.clickFora, false);
        firebaseAuth.onAuthStateChanged(async userAuth => {
            if(this.props.desativarSplash) this.props.desativarSplash();
            if ((!userAuth && !this.props.usuario.uid) || (userAuth && userAuth.uid === this.props.usuario.uid)) return;
            if(userAuth) this.props.history.push('/app');
            const user = await gerarDocumentoUsuario(userAuth) || {};
            if (!user.nomeCompleto || !user.cargo) {
                this.setState({cadastrando: true, logando: false});
            }
            this.props.dispatch({type: 'login', usuario: user});
            this.removerEventListener();
            this.definirApresentacaoUsuario(user);
        });
    };

    render() {
        return (
            <div id='quadro-login' className='quadro-navbar' ref={this.ref}>
                {this.props.usuario.uid
                    ? <>
                        <button className='botao-azul botao' onClick={() => this.props.history.push('/perfil')}>Meu Perfil</button>  
                        <button className='botao limpar-input' onClick={() => firebaseAuth.signOut()}>✕ Sair</button>
                    </>
                    :  
                    <>
                        <form className='inputs-login'> 
                            {this.state.logando ?
                                <>
                                    <input ref={this.ref1} id='username' className='combo-popup' placeholder='E-mail' type='email' value={this.state.email}
                                            onChange={e => this.setState({email: e.target.value})}></input>
                                    <input id='password' className='combo-popup' placeholder='Senha' type='password' value={this.state.senha}
                                            onChange={e => this.setState({senha: e.target.value})}></input>
                                </>
                                : null
                            }   
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
        );
    }
};

const mapState = state => {
  return {usuario: state.usuario, apresentacao: state.present.apresentacao, elementos: state.present.elementos};
}

export default connect(mapState)(Login);
  