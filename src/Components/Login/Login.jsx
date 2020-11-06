import React from 'react';
import './Login.css';

class Login extends React.Component {

    render() {
        if (!this.props.ativo) return null;
        return (
        <div id='container-login' className={this.props.fundo ? 'fundo-login' : ''}>
            <div className='wraper-login'>
                <div id='quadro-login' className={this.props.fundo ? 'quadro-centralizado' : ''}>
                    <div className='inputs-login'> 
                        <input id='username' className='combo-popup' placeholder='E-mail' type='email'></input>
                        <input id='password' className='combo-popup' placeholder='Senha' type='password'></input>
                    </div>
                    <button className='botao-azul botao'>Entrar</button>
                    <hr></hr>
                    <button id='login-google' className='botao limpar-input'>Entrar com Google</button>
                    <button id='cadastre-se' className='itens'>Cadastre-se</button>
                    <a>Esqueceu sua senha?</a>
                </div>
                <div id='comece-usar' className='botao-azul' onClick={this.props.callback}>
                    <div>Comece a Usar</div>
                </div>
            </div>
        </div>
        );
    }
};
  
export default Login;
  