import React, { Component } from 'react';
import { store } from './index';
import { Provider } from 'react-redux';
import PopupConfirmacao from './Components/Popup/PopupConfirmacao';
import PaginaLogin from './Components/Login/PaginaLogin';
import App from './App';
import Perfil from './Components/Perfil/Perfil';
import Notificacoes from './Components/Notificacoes/Notificacoes';
import sobreporSplash from './Components/Splash/SobreporSplash';
import { Router, Switch, Route, Redirect } from "react-router-dom";
import { checarLogin } from './Components/Login/ModulosLogin';
import Splash from './Components/Splash/Splash';
import Propaganda from './Components/Propaganda/Propaganda';
import history from './history';

const paginas = [{nome: 'app', componente: App},
                 {nome: 'login', componente: PaginaLogin},
                 {nome: 'perfil', componente: Perfil, exigeLogin: true},
                 {nome: 'splash', componente: Splash},
                 {nome: '', componente: props => {
                    if (props.location.hash) {return <App/>}
                    else {return <Redirect to='/login'/>}
                 }}
]

class Home extends Component {

  render() {
    return (
      <Provider store={store}>
        <Router history={history}>     
            <PopupConfirmacao/>
            <Notificacoes/>
            <Switch>
                {paginas.map((p, i) => (
                    <Route exact path={'/' + p.nome} key={i}
                           component={sobreporSplash(p.componente, p.exigeLogin, checarLogin, true, true, true)}
                    />
                    )    
                )};
                <Route render={() => <Redirect to='/login'/>} />
            </Switch>
        </Router>
        <Propaganda/>
      </Provider>
    );
  }
}

export default Home;

// copiarLinkAreaDeTransferencia = idPermissao => {
//   var inputTemporario = document.createElement('input');
//   inputTemporario.type = 'text';
//   inputTemporario.value =  this.getLinkPermissao(idPermissao);
//   document.body.appendChild(inputTemporario);
//   inputTemporario.select();
//   document.execCommand('Copy');
//   document.body.removeChild(inputTemporario);
//   this.props.dispatch({type: 'inserir-notificacao', conteudo: 'Link copiado para a área de transferência'});
// }
