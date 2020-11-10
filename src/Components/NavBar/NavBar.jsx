import React from 'react';
import { connect } from 'react-redux';
import './NavBar.css';
import Login from '../Login/Login';
import QuadroAtalhos from './QuadroAtalhos';
import Perfil from '../Perfil/Perfil';

// const botoesNav = [{nome: , onClick: }

// ]

class NavBar extends React.Component {

  constructor (props) {
    super(props);
    this.esperando = false;
    this.state = {quadroLogin: true, fundo: true, quadroAtalhos: false, paginaPerfil: false}
  }

  toggleQuadroLogin = () => {
    this.setState({quadroLogin: !this.state.quadroLogin, fundo: false});
  }
 
  toggleQuadroAtalhos = bool => {
    this.setState({quadroAtalhos: bool});
  }

  togglePerfil = (bool = !this.state.paginaPerfil) => {
    this.setState({paginaPerfil: bool});
  }

  render() {
    var u = this.props.usuario;
    return (
      <>
        {this.state.paginaPerfil ? <Perfil callback={this.togglePerfil}/> : null }
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
              {u.uid
                ? <img className='foto-usuario pequena' src={u.photoURL || require('./Usuário Padrão.png')} alt='Foto Usuário'></img>
                : null
              }   
              <div id='nome-usuario'>{u.uid ? u.nomeCompleto : 'Entre ou Cadastre-se'}</div>
            </div>
            {this.state.quadroLogin 
                ? <>
                    <div style={this.state.fundo ? {position: 'fixed'} : {position: 'absolute', right: '1vw', top: '6vh'}}>
                      <Login fundo={this.state.fundo} ativo={this.state.quadroLogin} callback={this.toggleQuadroLogin} 
                             abrirPerfil={this.togglePerfil}/>
                    </div>
                  </>
                : null
              }
        </div>
      </>
    );
  }
};
  
const mapStateToProps = state => {
  return {usuario: state.usuario};
}

export default connect(mapStateToProps)(NavBar);
  