import React, { useEffect } from 'react';
import store, { persistor } from './index';
import { Provider } from 'react-redux';
import PopupConfirmacao from './Components/Popup/PopupConfirmacao';
import PaginaLogin from './Components/Login/PaginaLogin';
import App from './Components/App/App';
import Perfil from './Components/Perfil/Perfil';
import Notificacoes from './Components/Notificacoes/Notificacoes';
import sobreporSplash from './Components/Basicos/Splash/SobreporSplash';
import { Router, Switch, Route, Redirect } from "react-router-dom";
import { checarLogin } from './Components/Login/ModulosLogin';
import Splash from './Components/Basicos/Splash/Splash';
import Propaganda from './Components/Propaganda/Propaganda';
import history from './principais/history';
import { PersistGate } from 'redux-persist/integration/react';
import OnlineGate from './Components/Basicos/OnlineGate/OnlineGate';
import { adicionarFontesPagina } from './Components/MenuExportacao/ModulosFontes';
import FrontPage from './Components/FrontPage/FrontPage';

const paginas = [{nome: 'main', componente: App},
                 {nome: 'home', componente: FrontPage},
                 {nome: 'login', componente: PaginaLogin},
                 {nome: 'perfil', componente: Perfil, exigeLogin: true},
                 {nome: 'splash', componente: Splash, semSplash: true},
                 {nome: 'logout', componente: props => {
                    window.history.replaceState(undefined, undefined, '/login');
                    store.dispatch({type: 'resetar'});
                    return <PaginaLogin {...props}/>
                  }, semSplash: true
                 },
                 {nome: '', componente: props => {
                    if (props.location.hash) {return <App history={history}/>}
                    else {return <Redirect to='/login'/>}
                 }}
]

const Home = () => {

  useEffect(()=> {
    adicionarFontesPagina();
  }, [])

  return (
    <Provider store={store}>
      <PersistGate loading={<Splash/>} persistor={persistor}>
        <OnlineGate>
          <Router history={history}>     
              <Notificacoes/>
              <Switch>
                  {paginas.map(p => (
                      <Route path={'/' + p.nome} key={p.nome}
                            component={
                              p.semSplash
                                ? p.componente
                                : sobreporSplash(p.nome, p.componente, p.exigeLogin, checarLogin, true, true, true)
                              }
                      />
                      )    
                  )};
                  <Route render={() => <Redirect to='/login'/>} />
              </Switch>
          </Router>
          <PopupConfirmacao/>
          <Propaganda/>
        </OnlineGate>
      </PersistGate>
    </Provider>
  );
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
