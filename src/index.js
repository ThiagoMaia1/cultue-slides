import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { createStore } from 'redux';
import hotkeys from 'hotkeys-js';

const estiloPadrao = {
  texto: {color: 'black', fontFamily: 'Helvetica'}, 
  titulo: {fontSize: '3'}, 
  paragrafo: {fontSize: '1.5', padding: '0.1', lineHeight: '1.7'}, 
  fundo: './Galeria/Fundos/Aquarela.jpg', 
  tampao: {backgroundColor: '#000', opacity: '0.2'}
};

export class Element {
  constructor(tipo, titulo, texto = [], estilo = {}) {
    this.tipo = tipo;
    this.titulo = titulo;
    
    var estiloNull = {texto: {}, titulo: {}, paragrafo: {}, fundo: null, tampao: {}};
    var est = {...estiloNull, ...estilo};

    var divisoes = divisoesTexto(texto, tipo, est.paragrafo);
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

function divisoesTexto(texto, tipo, est) {
  est = {...estiloPadrao.paragrafo, ...est};
  var pad = Number(est.padding)
  var tamanhoLinha = window.screen.width*(1-pad*2)*0.5;
  var alturaLinha = Number(est.lineHeight)*Number(est.fontSize)*16;
  var nLinhas = window.screen.height*(0.8-pad*1.5)*0.5/alturaLinha;
  var fontSize = est.fontSize;
  var textoDividido = [];
  var j = -1;
  var divisor = '\n\n';
  if (tipo === 'Bíblia') divisor = ' ';
  for (var i = 0; i < texto.length; i++) {
    if (j === -1 || getTextWidth(textoDividido[j], fontSize) >= tamanhoLinha*(nLinhas-1)) {
      textoDividido.push('');
      j++;
    }    
    textoDividido[j] = textoDividido[j] + divisor + texto[i];
  }
  return textoDividido;
}

function getTextWidth(texto, fontSize) {
  var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
  var context = canvas.getContext("2d");
  context.font = fontSize;
  var metrics = context.measureText(texto);
  console.log(metrics.width);
  return metrics.width;
}

const textoPadrao = [
  'João 1:1-3 1 No princípio era o Verbo, e o Verbo estava com Deus, e o Verbo era Deus.',
  '2 Ele estava no princípio com Deus.', 
  '3 Todas as coisas foram feitas por intermédio dele, e sem ele nada do que foi feito se fez.'
]

const defaultList = {elementos: [
  new Element("Configurações Globais", 'Título', textoPadrao, estiloPadrao),
  new Element("Título","Exemplo",["Esta é uma apresentação de exemplo."]),
  new Element("Bíblia","João 1:1-3", textoPadrao),
  new Element("Música","Jesus em Tua Presença",["Jesus em tua presença..."]),
  new Element("Imagem","Aquarela",["./Fundos/Aquarela.jpg"])],
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
    case "offset-selecao":
      var elem = state.elementos.flatMap((e, i) => { 
        return e.slides.map((s, j) => ({elemento: i, slide: j})); //Gera um array ordenado com todos os slides que existem representados por objetos do tipo "selecionado".
      })
      for (var i = 0; i < elem.length; i++) { //Acha o selecionado atual.
        if (elem[i].elemento === state.selecionado.elemento && elem[i].slide === state.selecionado.slide) {
          var novoIndex = i + action.offset;
          if (novoIndex < 0) {
            novoIndex = 0;
          } else if (novoIndex >= elem.length) { 
            novoIndex = elem.length-1;
          }
          break;
        }
      }
      nState = {elementos: state.elementos, selecionado: {...elem[novoIndex]}};
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
  //Pra dividir o padding-top.
  var estiloParagrafo = {...estiloTexto, ...global.estilo.paragrafo, ...elemento.estilo.paragrafo, ...slide.estilo.paragrafo}

  return {texto: slide.texto === 'slide-mestre' ? state.elementos[sel.elemento].slides[1].texto : slide.texto, 
    titulo: state.elementos[sel.elemento].titulo,
    estilo: {
      titulo: {...estiloTexto, ...global.estilo.titulo, ...elemento.estilo.titulo, ...slide.estilo.titulo}, 
      paragrafo: {...estiloParagrafo, paddingTop: String(Number(estiloParagrafo.padding/2))}, 
      fundo: slide.estilo.fundo || elemento.estilo.fundo || global.estilo.fundo, 
      tampao: {...global.estilo.tampao, ...elemento.estilo.tampao, ...slide.estilo.tampao},
      texto: {...estiloTexto}
    }
  };
}

export let store = createStore(reducerElementos);

hotkeys('right,left,up,down', function(event, handler){
  event.preventDefault();
  var offset = 0;
  switch (handler.key) {
      case 'right':
      case 'down':
          offset = 1;
          break;
      case 'left':
      case 'up':
          offset = -1;
          break;
      default:
          offset = 0;
  }
  store.dispatch({type: 'offset-selecao', offset: offset})
});

ReactDOM.render(
  <App />,
  document.getElementById('root')
);