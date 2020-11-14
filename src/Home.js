import React, { Component } from 'react';
import { store } from './index';
import { Provider } from 'react-redux';
import PopupAdicionar from './Components/Popup/PopupAdicionar';
import PopupConfirmacao from './Components/Popup/PopupConfirmacao';
import PaginaLogin from './Components/Login/PaginaLogin';
import App from './App';
import Perfil from './Components/Perfil/Perfil';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";

const paginas = [{nome: 'app', componente: App},
                 {nome: 'login', componente: PaginaLogin},
                 {nome: 'perfil', componente: Perfil},
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
            <Switch>
                {paginas.map(p => (
                    <Route exact path={'/' + p.nome} component={p.componente}/>
                    )    
                )};
            </Switch>
        </Router>
      </Provider>
    );
  }
}

export default Home;
