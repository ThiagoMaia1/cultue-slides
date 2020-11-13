import React, { Component } from 'react';
import { store } from './index';
import { Provider } from 'react-redux';
import PopupAdicionar from './Components/Popup/PopupAdicionar';
import PopupConfirmacao from './Components/Popup/PopupConfirmacao';
import NavBar from './Components/NavBar/NavBar';
import Login from './Components/Login/Login';
import App from './App';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

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
          <Login/>
          <NavBar/>
          <PopupAdicionar/>
          <PopupConfirmacao/>
          <App/>
        </Router>
      </Provider>
    );
  }
}

export default Home;
