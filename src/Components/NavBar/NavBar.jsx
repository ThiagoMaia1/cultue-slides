import React from 'react';
import { connect } from 'react-redux';
import './NavBar.css';
import Login from '../Login/Login';
import QuadroAtalhos from './QuadroAtalhos';

// const botoesNav = [{nome: , onClick: }

// ]

class NavBar extends React.Component {

  constructor (props) {
    super(props);
    this.esperando = false;
    this.state = {quadroLogin: true, fundo: true, quadroAtalhos: false}
  }

  toggleQuadroLogin = () => {
    this.setState({quadroLogin: !this.state.quadroLogin, fundo: false});
  }
 
  toggleQuadroAtalhos = bool => {
    this.setState({quadroAtalhos: bool});
  }

  render() {
    var u = this.props.usuario;
    return (
        <div id="navbar">
            <div id='botoes-navbar'>
              <button>Nova Apresentação</button>
              <button>Salvar Padrão</button>
              <div className='div-botao-navbar'>
                <button onClick={() => this.toggleQuadroAtalhos(true)} style={this.state.quadroAtalhos ? {pointerEvents: 'none', cursor: 'pointer'} : null}>Atalhos</button>
                {this.state.quadroAtalhos
                  ? <QuadroAtalhos callback={this.toggleQuadroAtalhos}/>
                  : null
                }
              </div>
              <button>Express</button>
            </div>
            <div id='info-usuario' onClick={this.toggleQuadroLogin}>
              {u
                ? <img id='foto-usuario' src={u.photoURL || require('./Usuário Padrão.png')} alt='Foto Usuário'></img>
                : null
              }   
              <div id='nome-usuario'>{u ? u.nomeCompleto : 'Entre ou Cadastre-se'}</div>
            </div>
            {this.state.quadroLogin 
                ? <>
                    <div style={this.state.fundo ? {position: 'fixed'} : {position: 'absolute', right: '1vw', top: '6vh'}}>
                      <Login fundo={this.state.fundo} ativo={this.state.quadroLogin} callback={this.toggleQuadroLogin}/>
                    </div>
                  </>
                : null
              }
        </div>
    );
  }
};
  
const mapStateToProps = state => {
  return {usuario: state.usuario};
}

export default connect(mapStateToProps)(NavBar);
  