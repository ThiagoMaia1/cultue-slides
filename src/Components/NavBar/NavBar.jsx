import React from 'react';
import { connect } from 'react-redux';
import './NavBar.css';
import Login from '../Login/Login'

// const botoesNav = [{nome: , onClick: }

// ]

class NavBar extends React.Component {

  constructor (props) {
    super(props);
    this.state = {quadroLogin: true, fundo: true}
  }

  toggleQuadroLogin = () => {
    this.setState({quadroLogin: !this.state.quadroLogin, fundo: false});
  }

  render() {
    var u = this.props.usuario;
    return (
        <div id="navbar">
            <div id='botoes-navbar'></div>
            <div id='info-usuario' onClick={this.toggleQuadroLogin}>
              {u
                ? <img id='foto-usuario' src={u.photoURL || require('./Usuário Padrão.png')} alt='Foto Usuário'></img>
                : null
              }   
              <div id='nome-usuario'>{u ? u.nomeCompleto : 'Entre ou Cadastre-se'}</div>
            </div>
            {this.state.quadroLogin 
                ? <div style={this.state.fundo ? {position: 'fixed'} : {position: 'absolute', right: '1vw', top: '5vh'}}>
                    <Login fundo={this.state.fundo} ativo={this.state.quadroLogin} callback={this.toggleQuadroLogin}/>
                  </div>
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
  