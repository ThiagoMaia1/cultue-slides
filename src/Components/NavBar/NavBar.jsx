import React from 'react';
import { connect } from 'react-redux';
import './NavBar.css';

// const botoesNav = [{nome: , onClick: }

// ]

class NavBar extends React.Component {

  render() {
    if (Object.keys(this.props.usuario).length === 0) return null;
    return (
        <div id="navbar">
            <div id='botoes-navbar'></div>
            <div id='info-usuario'>
                <img id='foto-usuario' src={this.props.usuario.photoURL || require('./Usuário Padrão.png')} alt='Foto Usuário'></img>
                <div id='nome-usuario'>{this.props.usuario.nomeCompleto || ''}</div>
            </div>
        </div>
    );
  }
};
  
const mapStateToProps = state => {
    return {usuario: state.usuario};
}

export default connect(mapStateToProps)(NavBar);
  