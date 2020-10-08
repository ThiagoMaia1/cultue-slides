import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { createStore } from 'redux';
import { Provider } from 'react-redux';


const elementosReducer = function (state = {}, action) {
  
  switch (action.type) {
    case "inserir":
      return state.elementos.push(action.elemento);
    case "deletar":
      return state.elementos.filter(el => (el.id !== action.elemento.id));
    default:
      return state;
  }
};

let store = createStore(elementosReducer);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);