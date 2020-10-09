import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { createStore } from 'redux';

export class Element {
  constructor(id, apiKey, tipo, título, texto, ordem) {
    this.id = id;
    this.apiKey = apiKey;
    this.tipo = tipo;
    this.título = título;
    this.texto = texto; 
    this.ordem = ordem;
  }
}

const defaultList = {elementos: [new Element(1,null,"Título","Exemplo","Esta é uma apresentação de exemplo.", 1),
  new Element(2,null,"Bíblia","João 1:1-3","João 1:1-3 1 No princípio era o Verbo, e o Verbo estava com Deus, e o Verbo era Deus. 2 Ele estava no princípio com Deus. 3 Todas as coisas foram feitas por intermédio dele, e sem ele nada do que foi feito se fez.", 2),
  new Element(3,null,"Música","Jesus em Tua Presença","Jesus em tua presença...", 3),
  new Element(4,null,"Imagem","Aquarela","./Fundos/Aquarela.jpg", 4)], 
  apresentacao: {imagemPreview: null, fundoPadrao: './Galeria/Fundos/Aquarela.jpg', texto: 'João 1:1-3 1 No princípio era o Verbo, e o Verbo era Deus. 2 Ele estava no princípio com Deus. 3 Todas as coisas foram feitas por intermédio dele, e sem ele nada do que foi feito se fez.', estilo: {}},
  selecionado: 1};

export const reducerElementos = function (state = defaultList, action) {

  switch (action.type) {
    case "inserir":
      return {elementos: [...state.elementos, action.elemento], apresentacao: state.apresentacao};
    case "deletar":
      return {elementos: state.elementos.filter(el => (el.id !== action.elemento.id)), apresentacao: state.imagemPreview};
    case "atualizar-prévia-imagem":
      return {elementos: state.elementos, apresentacao: {...state.apresentacao, imagemPreview: action.pathImagem}}
    case "definir-fundo-padrao":
      return {elementos: state.elementos, apresentacao: {...state.apresentacao, fundoPadrao: action.pathImagem}}
    default:
      return state;
  }
};

export let store = createStore(reducerElementos);

ReactDOM.render(
  <App />,
  document.getElementById('root')
);