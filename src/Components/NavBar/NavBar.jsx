import React from 'react';
import { connect } from 'react-redux';
import './NavBar.css';
import Login from '../Login/Login';
import QuadroAjuda from './QuadroAjuda';
// import QuadroExpress from './QuadroExpress';
import { definirApresentacaoPadrao, zerarApresentacao } from '../../principais/firestore/apresentacoesBD';

const listaBotoesQuadros = [
  {nome: 'Ajuda', componente: QuadroAjuda}
  // {nome: 'Express', componente: QuadroExpress}
]

class NavBar extends React.Component {

  constructor (props) {
    super(props);
    this.esperando = false;
    this.state = {quadroLogin: false, quadroAtalhos: false, quadroExpress: false, paginaPerfil: false}
  }

  toggleQuadroLogin = (bool = !this.state.quadroLogin) => {
    this.setState({quadroLogin: bool});
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
    var eDownload = this.props.apresentacao.autorizacao !== 'baixar';
    var ePadrao = this.props.usuario.idApresentacaoPadrao === this.props.apresentacao.id;
    var eLeitura = this.props.apresentacao.autorizacao === 'ver';
    var padraoEstilo = this.props.usuario.tipoApresentacaoPadrao === 'estilo';
    return (
      <div id="navbar">
          <div id='botoes-navbar'>
            <button onClick={() => zerarApresentacao(this.props.usuario, this.props.apresentacao)}>Nova Apresentação</button>
            {eDownload
              ? <>
                  <button onClick={() => definirApresentacaoPadrao(u.uid, this.props.apresentacao.id, 'atual')}>Definir Padrão</button>
                    {listaBotoesQuadros.map(b => {
                        const ComponenteQuadro = b.componente;
                        return (
                          <div className='div-botao-navbar' key={b.nome}>
                            <button onClick={() => this.toggleQuadro(getNomeVariavelEstado(b), true)}>
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
          <div id='mensagem-autorizacao' style={ePadrao ? {color: 'var(--azul-forte)'} : null}>
            {!window.navigator.onLine 
              ? 'Sem Conexão com a Internet'
              : eLeitura 
                ? 'Somente Leitura' 
                : ePadrao 
                  ? 'Apresentação Padrão' + (padraoEstilo ? ' (Estilo)' : '')
                  : ''
            }
          </div>
          <div id='info-usuario' onClick={() => this.toggleQuadroLogin(true)}>
            {u.uid
              ? <img className='foto-usuario pequena' src={u.photoURL || require('./Usuário Padrão.png')} alt='Foto Usuário'></img>
              : null
            }   
            <div id='nome-usuario'>{u.uid ? u.nomeCompleto : 'Entre ou Cadastre-se'}</div>
          </div>
          {this.state.quadroLogin 
              ? <div className='container-quadro-login'>
                  <Login history={this.props.history} callback={() => this.toggleQuadroLogin(false)}/>
                </div>
              : null
            }
      </div>
    );
  }
};
  
const mapState = state => {
  return {
    usuario: state.usuario, 
    elementos: state.present.elementos, 
    apresentacao: state.present.apresentacao, 
    ratio: state.present.ratio
  };
}

function getNomeVariavelEstado(b) {
  return 'quadro' + b.nome;
}

export default connect(mapState)(NavBar);
  