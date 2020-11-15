import React from 'react';
import { connect } from 'react-redux';
import './NavBar.css';
import Login from '../Login/Login';
import QuadroAtalhos from './QuadroAtalhos';
import { definirApresentacaoPadrao, zerarApresentacao } from '../../firestore/apresentacoesBD';

class NavBar extends React.Component {

  constructor (props) {
    super(props);
    this.esperando = false;
    this.state = {quadroLogin: false, quadroAtalhos: false, paginaPerfil: false}
  }

  toggleQuadroLogin = () => {
    this.setState({quadroLogin: !this.state.quadroLogin});
  }
 
  toggleQuadroAtalhos = bool => {
    this.setState({quadroAtalhos: bool});
  }

  togglePerfil = (bool) => {
    console.log(bool)
    if (bool) {
      this.props.history.push('/perfil');
    } else {
      this.props.history.push('/app');
    }
  }

  render() {
    var u = this.props.usuario;
    return (
      <div id="navbar">
          <div id='botoes-navbar'>
            <button onClick={() => zerarApresentacao(this.props.usuario)}>Nova Apresentação</button>
            <button onClick={() => definirApresentacaoPadrao(u.uid, this.props.elementos)}>Definir Padrão</button>
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
            {u.uid
              ? <img className='foto-usuario pequena' src={u.photoURL || require('./Usuário Padrão.png')} alt='Foto Usuário'></img>
              : null
            }   
            <div id='nome-usuario'>{u.uid ? u.nomeCompleto : 'Entre ou Cadastre-se'}</div>
          </div>
          {this.state.quadroLogin 
              ? <div className='container-quadro-login'>
                  <Login history={this.props.history} callback={this.toggleQuadroLogin}/>
                </div>
              : null
            }
      </div>
    );
  }
};
  
const mapState = state => {
  return {usuario: state.usuario, elementos: state.present.elementos};
}

export default connect(mapState)(NavBar);
  