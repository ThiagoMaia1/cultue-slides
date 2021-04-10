import React from 'react';
import { connect } from 'react-redux';
import './NavBar.css';
import QuadroNovaApresentacao from './QuadroNovaApresentacao';
import QuadroDefinirPadrao from './QuadroDefinirPadrao';
import QuadroAjuda from './QuadroAjuda';
// import QuadroExpress from './QuadroExpress';
import Login from '../Login/Login';
import { sairDoIframe } from '../FrontPage/IframeAplicacao';

const listaBotoesQuadros = [
  {nome: 'Nova Apresentação', componente: QuadroNovaApresentacao},
  {nome: 'Definir Padrão', componente: QuadroDefinirPadrao, exigeNaoDownload: true},
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
      this.props.history.push('/main');
    }
  }

  render() {
    var u = this.props.usuario;
    let { apresentacao } = this.props; 
    let { autorizacao } = apresentacao;
    var ePadrao = this.props.usuario.idApresentacaoPadrao === apresentacao.id;
    var eDownload = autorizacao === 'baixar';
    var eLeitura = autorizacao === 'ver';
    return (
      <div id="navbar">
          <div id='botoes-navbar'>
            {listaBotoesQuadros.map(b => {
                const ComponenteQuadro = b.componente;
                if (eDownload && b.exigeNaoDownload) return null;
                return (
                  <div className='div-botao-navbar' key={b.nome}>
                    <button onClick={() => this.toggleQuadro(getNomeVariavelEstado(b), true)}>
                      {b.nome}
                    </button>
                    {this.state[getNomeVariavelEstado(b)]
                      ? <ComponenteQuadro usuario={u} apresentacao={apresentacao} callback={bool => this.toggleQuadro(getNomeVariavelEstado(b), bool)}
                                          style={{left: 0, position: 'absolute', width: '20vw'}}/>
                      : null
                    }
                  </div>
                )  
              })}
          </div>
          <div id='mensagem-autorizacao' style={ePadrao ? {color: 'var(--azul-forte)'} : null}>
            {!window.navigator.onLine 
              ? 'Sem Conexão com a Internet'
              : eLeitura 
                ? 'Somente Leitura' 
                : ePadrao 
                  ? 'Apresentação Padrão'
                  : ''
            }
          </div>
          <div id='info-usuario' 
            onClick={() => {
              sairDoIframe();
              this.toggleQuadroLogin(true)
            }}>
            {u.uid
              ? <img className='foto-usuario pequena' src={u.photoURL || require('./Usuário Padrão.png').default} alt='Foto Usuário'></img>
              : null
            }   
            <div id='nome-usuario' style={u.uid ? null : {userSelect: 'none'}}>
              {u.uid ? u.nomeCompleto : 'Entre ou Cadastre-se'}
            </div>
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
    ratio: state.present.ratio,
    popupConfirmacao: state.popupConfirmacao
  };
}

function getNomeVariavelEstado(b) {
  return 'quadro' + b.nome.replace(' ', '');
}

export default connect(mapState)(NavBar);
  