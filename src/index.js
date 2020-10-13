import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { createStore } from 'redux';

const estiloPadrao = {
  texto: {color: 'black', fontFamily: 'Helvetica'}, 
  titulo: {fontSize: '400%'}, 
  paragrafo: {fontSize: '200%', padding: '10%'}, 
  fundo: './Galeria/Fundos/Aquarela.jpg', 
  tampao: {backgroundColor: '#000', opacity: '20%'}
};

export class Element {
  constructor(tipo, titulo, texto = [], estilo = {}) {
    this.tipo = tipo;
    this.titulo = titulo;
    
    var estiloNull = {texto: {}, titulo: {}, paragrafo: {}, fundo: null, tampao: {}};
    var est = {...estiloNull, ...estilo};

    var divisoes = divisoesTexto(texto);
    if (divisoes.length === 1) {
      this.slides = [{estilo: {...est}, texto: texto}];
    } else { //Se tiver texto para mais de um slide, cria um slide mestre.
      this.slides = [{estilo: {...est}, texto: 'slide-mestre'}];
      for (var i = 0; i < divisoes.length; i++) {
        this.slides.push({estilo: {...estiloNull}, texto: divisoes[i]});
      }  
    }
  }
}

function divisoesTexto(texto) {
  var tamanho = 50;
  var textoDividido = [''];
  var j = 0;
  for (var i = 0; i < texto.length; i++) {
    textoDividido[j] = textoDividido[j] + texto[i];
    if (textoDividido[j].length >= tamanho && i+1 < texto.length) {
      textoDividido.push('');
      j++;
    }
  }
  return textoDividido;
}

const textoPadrao = [
  'João 1:1-3 1 No princípio era o Verbo, e o Verbo estava com Deus, e o Verbo era Deus.',
  '2 Ele estava no princípio com Deus.', 
  '3 Todas as coisas foram feitas por intermédio dele, e sem ele nada do que foi feito se fez.'
]

const defaultList = {elementos: [
  new Element("Configurações Globais", 'Título', textoPadrao, estiloPadrao),
  new Element("Título","Exemplo","Esta é uma apresentação de exemplo."),
  new Element("Bíblia","João 1:1-3",textoPadrao),
  new Element("Música","Jesus em Tua Presença","Jesus em tua presença..."),
  new Element("Imagem","Aquarela","./Fundos/Aquarela.jpg")],
  selecionado: {elemento: 0, slide: 0}, 
  slidePreview: {texto: textoPadrao, titulo: 'Título', estilo: estiloPadrao}
}

export const reducerElementos = function (state = defaultList, action) {

  var nState;
  switch (action.type) {
    case "inserir":
      nState = {elementos: [...state.elementos, action.elemento], selecionado: {elemento: state.elementos.length, slide: 0}};
      return {...nState, slidePreview: getSlidePreview(nState)};
    case "deletar":
      return {elementos: state.elementos.filter(el => (el.id !== action.elemento.id)), selecionado: state.selecionado, slidePreview: state.slidePreview};
    case "reordenar":
      return {elementos: action.novaOrdemElementos, selecionado: state.selecionado, slidePreview: state.slidePreview};
    case "atualizar-estilo": {
      var el = [...state.elementos];
      var obj = el[state.selecionado.elemento].slides[state.selecionado.slide].estilo;
      if (('subitem' in action) && (action.subitem in obj[action.objeto])) { //Se existir subitem
        obj[action.objeto][action.subitem] = action.valor;
      } else {
        obj[action.objeto] = action.valor;
      }
      nState = {elementos: el, selecionado: state.selecionado}; //Para que o getSlidePreview use os valores já atualizados.
      return {...nState, slidePreview: getSlidePreview(nState)};
    }
    case "definir-selecao":
      nState = {elementos: state.elementos, selecionado: action.novaSelecao};
      return {...nState, slidePreview: getSlidePreview(nState)};
    default:
      return state;
  }
};

function getSlidePreview (state, selecionado = null) {
  const sel = selecionado || state.selecionado;
  const global = state.elementos[0].slides[0];
  const elemento = state.elementos[sel.elemento].slides[0];
  const slide = state.elementos[sel.elemento].slides[sel.slide];

  var estiloTexto = {...global.estilo.texto, ...elemento.estilo.texto, ...slide.estilo.texto}

  return {texto: slide.texto === 'slide-mestre' ? state.elementos[sel.elemento].slides[1].texto : slide.texto, 
    titulo: state.elementos[sel.elemento].titulo,
    estilo: {
      titulo: {...estiloTexto, ...global.estilo.titulo, ...elemento.estilo.titulo, ...slide.estilo.titulo}, 
      paragrafo: {...estiloTexto, ...global.estilo.paragrafo, ...elemento.estilo.paragrafo, ...slide.estilo.paragrafo}, 
      fundo: slide.estilo.fundo || elemento.estilo.fundo || global.estilo.fundo, 
      tampao: {...global.estilo.tampao, ...elemento.estilo.tampao, ...slide.estilo.tampao}
    }
  };
}

export let store = createStore(reducerElementos);

ReactDOM.render(
  <App />,
  document.getElementById('root')
);