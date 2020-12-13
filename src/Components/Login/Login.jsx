import React from 'react';
import { connect } from 'react-redux';
import './Login.css';
import { firebaseAuth, googleAuth } from "../../principais/firebase";
import { gerarDocumentoUsuario } from '../../principais/firestore/apiFirestore';
import SelectCargo from './SelectCargo';
import QuadroNavbar from '../NavBar/QuadroNavbar';
import { eEmailValido } from '../../principais/FuncoesGerais';
import SetaVoltar from '../Perfil/SetaVoltar';
import { CgEye } from 'react-icons/cg';

const msgEmailInvalido = 'Endereço de e-mail inválido.';

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
            return msgEmailInvalido;
        case 'email-already-in-use':
            return 'Já existe uma conta cadastrada para esse e-mail.';
        case 'operation-not-allowed':
            return 'Operação não autorizada.';
        case 'weak-password':
            return 'Defina uma senha mais forte.';
        case 'too-many-requests':
            return 'Pedido bloqueado devido a número elevado de solicitações. Tente novamente mais tarde.'
        case 'network-request-failed':
            return 'Verifique sua conexão de internet.'
        default:
            return codigo;
    }
}

class MenuLogado extends React.Component {
    
    render() {
        return (
            <>
                <button className='botao-azul botao' onClick={() => this.props.history.push('/perfil')}>Meu Perfil</button>  
                <button className='botao limpar-input' onClick={() => firebaseAuth.signOut()}>✕ Sair</button>
            </>
        )
    }
}

class Login extends React.Component {

    constructor (props) {
        super(props);
        this.refUsername = React.createRef();
        this.refPassword = React.createRef();
        this.state = {
            email: '', 
            senha: '', 
            erro: '', 
            nomeCompleto: '', 
            logando: true, 
            cadastrando: false, 
            esqueceuSenha: false, 
            redefinicaoDeSenhaEnviado: false, 
            senhaVisivel: false,
            senhaBolinhas: true,
            classeSenha: false
        }
    }

    entrar = () => {
        if(!this.state.email) this.refUsername.current.focus();
        if(!this.state.senha) this.refPassword.current.focus();
        this.setState({erro: ''});
        if (this.state.cadastrando && this.state.logando) { 
            this.criarUsuarioComEmailSenha();
        } else if(!this.state.logando) { 
            gerarDocumentoUsuario(this.props.usuario, {nomeCompleto: this.state.nomeCompleto, cargo: this.state.cargo});
        } else {
            firebaseAuth.signInWithEmailAndPassword(this.state.email, this.state.senha)
                .catch(error => {
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
        this.setState({cadastrando: true, erro: ''});
    }

    removerEventListener = () => {
        if (!this.props.callback) return;
        document.removeEventListener("click", this.clickFora, false);
        this.props.callback();
    }

    recuperarSenha = () => {
        firebaseAuth.sendPasswordResetEmail(this.state.email)
            .then(() =>
                this.setState({redefinicaoDeSenhaEnviado: true})
            )
            .catch(erro => {
                this.setState({erro: getMensagemErro(erro)});
                console.log(erro);
            });
    }

    handleSubmit = e => {
        e.preventDefault();
        if (!eEmailValido(this.state.email)) {
            this.setState({erro: msgEmailInvalido}); 
        } else {
            this.state.esqueceuSenha
                ? this.recuperarSenha()
                : this.entrar(e)
        }
    }

    callbackLogin = user => {
        if (user.uid && (!user.nomeCompleto || !user.cargo)) {
            this.setState({cadastrando: true, logando: false});
        }
        this.removerEventListener();
    }

    componentDidMount = async () => {
        if (this.refUsername.current) this.refUsername.current.focus();
        if (this.props.callback) document.addEventListener("click", this.clickFora, false);
    };

    componentWillUnmount = () => {
        this.removerEventListener();
    }

    mostrarSenha = () => {
        clearTimeout(this.timeoutSenha);
        var senhaVisivel = !this.state.senhaVisivel;
        this.setState({ senhaVisivel, classeSenha: true });
        var tempo = senhaVisivel ? 10 : 180; 
        this.timeoutSenha = setTimeout(() => this.setState({senhaBolinhas: !senhaVisivel, classeSenha: false}), tempo);
    }

    render() {
        const esqueceu = this.state.esqueceuSenha;
        const cadastrando = this.state.cadastrando;
        const senhaVisivel = this.state.senhaVisivel;
        var tamanhoOlho = window.innerHeight*0.03;

        var interiorLogin = (
            <>
                {!esqueceu && !cadastrando ? null
                    : <SetaVoltar title='Voltar' callback={() => this.setState({esqueceuSenha: false, redefinicaoDeSenhaEnviado: false, cadastrando: false, erro: ''})}
                        tamanhoIcone={window.innerHeight*0.025} style={{position: 'absolute', left: '3vh', top: '3vh'}}/> }
                <div id='quadro-login' className={cadastrando ? 'cadastrando' : ''}>
                    {this.props.usuario.uid
                        ? <MenuLogado history={this.props.history}/>
                        : (this.state.redefinicaoDeSenhaEnviado 
                            ? <div id='mensagem-redefinicao-senha'>
                                Um e-mail foi enviado para <span style={{wordBreak: 'break-all'}}>{this.state.email}</span> com instruções para redefinição da senha.
                              </div>
                            : <>
                                <form onSubmit={this.handleSubmit}>
                                    {!this.state.logando ? null
                                        : <>
                                            {cadastrando ? <div style={{marginTop: '4vh'}}></div> : null}
                                            <input ref={this.refUsername} id='username' className='combo-popup' placeholder='E-mail' type='email' value={this.state.email}
                                                    onChange={e => this.setState({email: e.target.value})}></input>
                                            {esqueceu ? null
                                                : <div className={'container-senha ' + (senhaVisivel ? 'visivel' : '')}>
                                                    <button type='button' className='botao-olho' 
                                                            onClick={this.mostrarSenha}>
                                                        <div className='risco-olho' style={{width: senhaVisivel ? 0 : tamanhoOlho}}></div>
                                                        <CgEye size={tamanhoOlho}/>
                                                    </button>
                                                    <input ref={this.refPassword} id='password' placeholder='Senha'
                                                           className={'combo-popup ' + (this.state.classeSenha ? 'senha-pequena' : '')}  
                                                           type={this.state.senhaBolinhas ? 'password' : 'text'} value={this.state.senha}
                                                           onChange={e => this.setState({senha: e.target.value})}
                                                           style={this.state.senhaBolinhas ? {transition: 'none'} : null}></input>
                                                 </div>
                                            }
                                        </>
                                    }   
                                    {!cadastrando ? null 
                                        : <>
                                            <input id='nome-completo' className='combo-popup' placeholder='Nome Completo' type='text' 
                                                value={this.state.nomeCompleto} onChange={e => this.setState({nomeCompleto: e.target.value})}></input>
                                            <SelectCargo value={this.state.cargo} onChange={e => this.setState({cargo: e.target.value})}/>
                                        </> 
                                    }
                                    <div className='mensagem-erro'>
                                        <div>{this.state.erro}</div>
                                    </div>
                                    <button className='botao-azul botao'>
                                        {esqueceu ? 'Recuperar Senha' : cadastrando ? 'Cadastrar' : 'Entrar'}
                                    </button>
                                </form>
                                {cadastrando || esqueceu ? null :
                                    <>
                                        <hr></hr>
                                        <button id='login-google' className='botao limpar-input' 
                                                onClick={() => firebaseAuth.signInWithPopup(googleAuth)}>Entrar com Google</button>
                                        <button id='cadastre-se' className='itens' onClick={this.cadastrando}>
                                            Cadastre-se
                                        </button>
                                        <button id='esqueceu-senha' onClick={() => this.setState({esqueceuSenha: true, erro: ''})}>Esqueceu sua senha?</button>
                                    </>
                                }
                            </>
                        )  
                    }
                </div>
            </>
        )
        var minHeightQuadro = this.props.usuario.uid ? 0 : '40vh';
        return (
            <>
                {this.props.callback
                    ? <QuadroNavbar callback={this.removerEventListener} esquerda={true} style={{minHeight: minHeightQuadro}}>
                        {interiorLogin}
                      </QuadroNavbar>                       
                    : interiorLogin
                }
            </> 
        );
    }
};

const mapState = state => {
  return {usuario: state.usuario, apresentacao: state.present.apresentacao, elementos: state.present.elementos};
}

export default connect(mapState)(Login);
  