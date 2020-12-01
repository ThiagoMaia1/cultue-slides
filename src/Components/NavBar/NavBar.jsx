import React from 'react';
import { connect } from 'react-redux';
import './NavBar.css';
import Login from '../Login/Login';
import QuadroAtalhos from './QuadroAtalhos';
import QuadroExpress from './QuadroExpress';
import { definirApresentacaoPadrao, zerarApresentacao } from '../../firestore/apresentacoesBD';

const listaBotoesQuadros = [{nome: 'Atalhos', componente: QuadroAtalhos},
                            {nome: 'Express', componente: QuadroExpress}
]

class NavBar extends React.Component {

  constructor (props) {
    super(props);
    this.esperando = false;
    this.state = {quadroLogin: false, quadroAtalhos: false, quadroExpress: false, paginaPerfil: false}
  }

  toggleQuadroLogin = () => {
    this.setState({quadroLogin: !this.state.quadroLogin});
  }
 
  toggleQuadro = (quadro, bool) => {
    var obj = {};
    obj[quadro] = bool;
    this.setState(obj);
  }

  togglePerfil = (bool) => {
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
            {this.props.autorizacao !== 'baixar'
              ? <>
                  <button onClick={() => definirApresentacaoPadrao(u.uid, this.props.elementos, 'atual')}>Definir Padrão</button>
                    {listaBotoesQuadros.map(b => {
                        const ComponenteQuadro = b.componente;
                        return (
                          <div className='div-botao-navbar' key={b.nome}>
                            <button onClick={() => this.toggleQuadro(getNomeVariavelEstado(b), true)} 
                                    style={this.state[getNomeVariavelEstado(b)] ? {pointerEvents: 'none', cursor: 'pointer'} : null}>
                              {b.nome}
                            </button>
                            {this.state[getNomeVariavelEstado(b)]
                              ? <ComponenteQuadro callback={bool => this.toggleQuadro(getNomeVariavelEstado(b), bool)}/>
                              : null
                            }
                          </div>
                        )  
                      }
                    )}
                </>
              : null
            }
          </div>
          <div id='mensagem-autorizacao'>{this.props.autorizacao === 'ver' ? 'Somente Leitura' : ''}</div>
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
  return {usuario: state.usuario, elementos: state.present.elementos, autorizacao: state.present.apresentacao.autorizacao};
}

function getNomeVariavelEstado(b) {
  return 'quadro' + b.nome;
}

export default connect(mapState)(NavBar);
  