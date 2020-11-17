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
import { Router, Switch, Route, Redirect } from "react-router-dom";
import { checarLogin } from './Components/Login/ModulosLogin';
import Splash from './Components/Splash/Splash';
import history from './history';

const paginas = [{nome: 'app', componente: App},
                 {nome: 'login', componente: PaginaLogin},
                 {nome: 'perfil', componente: Perfil, exigeLogin: true},
                 {nome: 'splash', componente: Splash},
                 {nome: '', componente: () => <Redirect to='/login'/>}
]

class Home extends Component {

  render() {
    return (
      <Provider store={store}>
        <Router history={history}>     
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
                <Route render={() => <Redirect to='/login'/>} />
            </Switch>
        </Router>
      </Provider>
    );
  }
}

export default Home;
