// //Falta fazer:
// Básico:
//   ✔️ Corrigir fundo do pop-up nas previews de música e texto bíblico.
//   ✔️ Corrigir reordenamento. 
//   ✔️ Concluir cálculo de linhas do slide.
//   ✔️ Permitir formatação de fontes, margens, estilo de texto.
//   ✔️ Possibilidade de excluir elementos.
//   ✔️ Corrigir problemas no leitor de referência bíblica.
// 
// Errinhos para corrigir:
//   ✔️ Redivisão de slides duplicando versículos quando a letra fica muito grande.
//   ✔️ Realce se mantém no modo de apresentação.
//   ✔️ Marcação de clicados no Negrito e afins.
//   ✔️ Limpar variáveis action no reducer.
//   ✔️ Imagem ficando fixa apenas no hover.
//   ✔️ Rolar a lista lateral igual a galeria. 
//   ✔️ Ícone menor na galeria.
//   ✔️ 'Null' no título do slide quando a referência é como: lc3-5.
//   Zerar sliders ao limpar formatação.
//   Incluir webfonts na combo de fontes disponíveis.
//
// Features:
//   ✔️ Envio de imagens.
//   ✔️ Navegar slides clicando à direita ou esquerda.
//   ✔️ Enviar imagem para fundo.
//   Exportar como HTML.
//   Botão para zerar/começar nova apresentação.
//   Incorporar vídeos do youtube.
//   Exportar como PDF.
//   Exportar como Power Point.
//   Permitir desfazer ações da store (Ctrl + Z).
//   Possibilidade de editar elemento (retornando à tela da query).
//   Editar texto direto no slide.
//   Marcador de repetições de estrofes nos slides de música/slide de refrão repetido.
//   Atalhos em geral.
//   Combo de número de capítulos e versículos da bíblia.
//   Login para salvar preferências.
//   Criar slide a partir de lista com separador.
//   Navegação pelas setas causar rolagem na lista de slides.

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { createStore } from 'redux';
import hotkeys from 'hotkeys-js';
import Element, { estiloPadrao, textoMestre, Estilo } from './Element.js';
import { selecionadoOffset, getSlidePreview } from './ExportadorHTML';

var defaultSemPreview = {elementos: [new Element("Slide-Mestre", "Slide-Mestre", [textoMestre], null, {...estiloPadrao}, true)],
  selecionado: {elemento: 0, slide: 0}, 
  realce: {aba: '', cor: ''}
};

const defaultList = {...defaultSemPreview, slidePreview: getSlidePreview(defaultSemPreview)};

export const reducerElementos = function (state = defaultList, action) {

  const redividirSlides = (elementos, sel) => {
    if (elementos.length !== 1) {
      const redividir = (e, s) => {
        return (e.criarSlides(e.getArrayTexto(s), e.slides[0].estilo, s, elementos[0].slides[0].estilo));
      }
        var [ i, slide, repetir ] = (sel.elemento === 0 ? [ 1, 0, 1 ] : [ sel.elemento, sel.slide, 0]);
      do {
        elementos[i] = (redividir(elementos[i], slide));
        i++;
      } while (repetir && i < elementos.length)
    }
    
    return elementos;
  }

  var nState;
  var el = [...state.elementos];
  var sel = action.selecionado || state.selecionado;
  switch (action.type) {
    case "inserir":
      nState = {elementos: [...state.elementos, action.elemento], selecionado: {elemento: state.elementos.length, slide: 0}};
      return {...nState, slidePreview: getSlidePreview(nState), realce: state.realce};
    case "deletar":
      el.splice(Number(action.elemento), 1);
      var novaSelecao = {elemento: state.selecionado.elemento, slide: 0};
      if (state.selecionado.elemento >= el.length) novaSelecao.elemento = state.selecionado.elemento-1 
      nState = {elementos: el, selecionado: {...novaSelecao}};
      return {...nState, slidePreview: getSlidePreview(nState), realce: state.realce};
    case "reordenar":
      nState = {elementos: action.novaOrdemElementos, selecionado: sel};
      return {...nState, slidePreview: getSlidePreview(nState), realce: state.realce};  
    case "atualizar-estilo": {
      var e = el[sel.elemento];
      var s = {...e.slides[sel.slide]};
      var est;
      if (action.objeto === 'estilo') {
        est = {...action.valor};
      } else {
        est = {...s.estilo};
        est[action.objeto] = {...est[action.objeto], ...action.valor};
      }
      s.estilo = {...est};
      e.slides[sel.slide] = {...s};
      el[sel.elemento] = {...e}; 
      
      if (action.redividir) el = redividirSlides(el, sel);
      nState = {elementos: [...el], selecionado: sel}; //Para que o getSlidePreview use os valores já atualizados.
      return {...nState, slidePreview: getSlidePreview(nState), realce: state.realce}; 
    }
    case "limpar-estilo": {
      if (sel.elemento === 0 && sel.slide === 0) {
        if (action.objeto) {
          el[0].slides[0].estilo[action.objeto] = estiloPadrao[action.objeto];  
        } else {
          el[0].slides[0].estilo = {...estiloPadrao};
        }
      } else if (action.objeto) {
        el[sel.elemento].slides[sel.slide].estilo[action.objeto] = {};
      } else {
        el[sel.elemento].slides[sel.slide].estilo = new Estilo();
      }
      if (action.redividir) el = redividirSlides(el, sel);
      nState = {elementos: [...el], selecionado: action.selecionado};
      return {...nState, slidePreview: getSlidePreview(nState), realce: state.realce};
    }
    case "ativar-realce": {
      return {...state, realce: action.realce}
    }
    case "definir-selecao":
      nState = {elementos: state.elementos, selecionado: sel};
      return {...nState, slidePreview: getSlidePreview(nState), realce: state.realce};
    case "offset-selecao":
      nState = {elementos: state.elementos, selecionado: {...selecionadoOffset(state.elementos, state.selecionado, action.offset)}};
      return {...nState, slidePreview: getSlidePreview(nState), realce: state.realce};
    default:
      return state;
  }
};

function undoable(reducer) {

  const initialState = {
    past: [],
    present: reducer(undefined, {}),
    future: []
  }
  
  const getSelecionadoValido = (selecionado, elementos) => {
    var [selE, selS] = [ selecionado.elemento, selecionado.slide ];
    while ((selE + 1) > elementos.length) {
      selE--;
    }
    while (!elementos[selE].slides[selS]) {
      selS--;
    }
    return {elemento: selE, slide: selS};
  }

  return function (state = initialState, action) {
    const { past, present, future } = state
    console.log(state.present);
    console.log(deepSpreadPresente(state.present))
    switch (action.type) {
      case 'UNDO':
        if (past.length === 0) return state;
        const previous = past[past.length - 1]
        const newPast = past.slice(0, past.length - 1)
        return {
          past: newPast,
          present: {...present, elementos: [...previous.elementos], selecionado: getSelecionadoValido(previous.selecionado, previous.elementos)},
          future: [present, ...future]
        }
      case 'REDO':
        if (future.length === 0) return state;
        const next = future[0]
        const newFuture = future.slice(1)
        return {
          past: [...past, present],
          present: {...present, elementos: [...next.elementos], selecionado: getSelecionadoValido(next.selecionado, next.elementos)},
          future: newFuture
        }
      default:
        const newPresent = reducer(present, action);
        var a = action.type;
        if (a === 'definir-selecao' || a === 'offset-selecao' || a === 'ativar-realce') {
          return {
            past: [...past],
            present: deepSpreadPresente(newPresent),
            future: []
          }
        }
        return {
          past: [...past, deepSpreadPresente(present)],
          present: deepSpreadPresente(newPresent),
          future: []
        }
    }
  }
}

function deepSpreadPresente(present) {
  var elementos = [];
  var selecionado = {...present.selecionado};
  var slidePreview = {...present.slidePreview};
  var realce = {...present.realce};

  for (var e of present.elementos) {
    var slides = [];
    for (var s of e.slides) {
      var estilo = {};
      for (var est in s.estilo) {
        estilo[est] = {...s.estilo[est]};
      }
      slides.push({...s, estilo: estilo});
    }
    elementos.push({...e, slides: slides});
  }
  var nState = {...present, elementos: elementos, selecionado: selecionado, slidePreview: slidePreview, realce: realce};
  return {...nState, slidePreview: getSlidePreview(nState, nState.selecionado)};
}

export let store = createStore(undoable(reducerElementos), /* preloadedState, */
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

hotkeys('right,left,up,down,ctrl+z,ctrl+shift+z,ctrl+y', function(event, handler){
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
      case 'ctrl+z':
        store.dispatch({type: 'UNDO'});
        break;
      case 'ctrl+y':
      case 'ctrl+shift+z':
        store.dispatch({type: 'REDO'});
        break;
      default:
        offset = 0;
  }
  if (offset !== 0) store.dispatch({type: 'offset-selecao', offset: offset})
});

ReactDOM.render(
  <App />,
  document.getElementById('root')
);