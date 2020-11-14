import React, { Component } from 'react';
import { store } from './index';
import { Provider } from 'react-redux';
import PopupAdicionar from './Components/Popup/PopupAdicionar';
import PopupConfirmacao from './Components/Popup/PopupConfirmacao';
import PaginaLogin from './Components/Login/PaginaLogin';
import App from './App';
import Perfil from './Components/Perfil/Perfil';
import Notificacoes from './Components/Notificacoes/Notificacoes';
import sobreporSplash from './Components/Splash/SobreporSplash';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { firebaseAuth } from "./firebase";
import { gerarDocumentoUsuario } from './firestore/apiFirestore';

const checarLogin = callback => {
  firebaseAuth.onAuthStateChanged(async userAuth => {
  if (!store.getState().usuario.uid) {
    var user = await gerarDocumentoUsuario(userAuth) || {};
    store.dispatch({type: 'login', usuario: user});
  }
  if (callback) callback();
  });
}

const paginas = [{nome: 'app', componente: App},
                 {nome: 'login', componente: PaginaLogin},
                 {nome: 'perfil', componente: Perfil, exigeLogin: true},
                 {nome: '', componente: () => <Redirect to='/login'/>}
]

class Home extends Component {

  constructor (props) {
    super(props);
    this.state = {loginAtivo: true}
  }

  toggleLogin = () => {
    this.setState({loginAtivo: !this.state.loginAtivo})
  }
  
  render() {
    return (
      <Provider store={store}>
        <Router>     
            <PopupAdicionar/>
            <PopupConfirmacao/>
            <Notificacoes/>
            <Switch>
                {paginas.map(p => (
                    <Route exact path={'/' + p.nome} 
                           component={sobreporSplash(p.componente, p.exigeLogin, checarLogin, true, true, true)}
                    />
                    )    
                )};
                <Route render={() => <Redirect to={'/login'}/>} />
            </Switch>
        </Router>
      </Provider>
    );
  }
}

export default Home;
