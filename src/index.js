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
//   Reduzir logo PowerPoint.
//
// Features:
//   ✔️ Envio de imagens.
//   ✔️ Navegar slides clicando à direita ou esquerda.
//   ✔️ Enviar imagem para fundo.
//   ✔️ Editar texto direto no slide.
//   ✔️ Permitir desfazer ações da store (Ctrl + Z).
//   Exportar como HTML.
//   Botão para zerar/começar nova apresentação.
//   Popup mais bonito.
//   Incorporar vídeos do youtube.
//   Exportar como PDF.
//   Exportar como Power Point.

//   Possibilidade de editar elemento (retornando à tela da query).
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

var defaultList = {elementos: [new Element("Slide-Mestre", "Slide-Mestre", [textoMestre], null, {...estiloPadrao}, true)],
  selecionado: {elemento: 0, slide: 0}, 
  abaAtiva: 'texto'
};

export const reducerElementos = function (state = defaultList, action) {

  const redividirSlides = (elementos, sel) => {
    if (elementos.length !== 1) {
        var [ i, slide, repetir ] = (sel.elemento === 0 ? [ 1, 0, 1 ] : [ sel.elemento, sel.slide, 0]);
      do {
        elementos[i].criarSlides(elementos[i].getArrayTexto(slide), elementos[i].slides[0].estilo, slide, elementos[0].slides[0].estilo);
        i++;
      } while (repetir && i < elementos.length)
    }
    
    return elementos;
  }

  var el = [...state.elementos];
  var sel = action.selecionado || state.selecionado;
  switch (action.type) {
    case "inserir":
      return {elementos: [...state.elementos, action.elemento], selecionado: {elemento: state.elementos.length, slide: 0}, abaAtiva: state.abaAtiva};
    case "deletar":
      el.splice(Number(action.elemento), 1);
      var novaSelecao = {elemento: state.selecionado.elemento, slide: 0};
      if (state.selecionado.elemento >= el.length) novaSelecao.elemento = state.selecionado.elemento-1 
      return {elementos: el, selecionado: {...novaSelecao}, abaAtiva: state.abaAtiva};
    case "reordenar":
      return {elementos: action.novaOrdemElementos, selecionado: sel, abaAtiva: state.abaAtiva};
    case "editar-slide": {
      var e = {...el[sel.elemento]};
      var s = e.slides[sel.slide];
      var est = s.estilo;
      if (action.objeto === 'estilo') {
        s.estilo = {...action.valor};
      } else if (action.objeto === 'textoArray') {
        if (action.valor === '') {
          s.textoArray.splice(action.numero, 1);
        } else {
          var quebra = action.valor.split(/(?<=\n\n)/);
          if (quebra.length > 1) {
            s.textoArray.splice(action.numero, 1, quebra.filter(q => /\S/.test(q)));
            s.textoArray = s.textoArray.flat();
          } else {
            s.textoArray[action.numero] = action.valor;
          }
        }
      } else if(action.objeto === 'textoTitulo') {
        s.titulo = action.valor;
      } else {
        est[action.objeto] = {...est[action.objeto], ...action.valor};
      }
      el[sel.elemento] = e;
      if (action.redividir) var el = redividirSlides(el, sel);
      return {elementos: [...el], selecionado: sel, abaAtiva: state.abaAtiva};
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
      return {elementos: [...el], selecionado: action.selecionado, abaAtiva: state.abaAtiva};
    }
    case "ativar-realce": {
      return {...state, abaAtiva: action.abaAtiva};
    }
    case "definir-selecao":
      return {elementos: state.elementos, selecionado: sel, abaAtiva: state.abaAtiva};
    case "offset-selecao":
      return {elementos: state.elementos, selecionado: {...selecionadoOffset(state.elementos, state.selecionado, action.offset)}, abaAtiva: state.abaAtiva};
    default:
      return state;
  }
};

function undoable(reducer) {

  var presenteInicial = reducer(undefined, {})
  const initialState = {
    past: [],
    present: presenteInicial,
    future: [],
    slidePreview: getSlidePreview(presenteInicial)
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
    const { past, present, future } = state;
    var presenteRetorno;
    switch (action.type) {
      case 'UNDO':
        if (past.length === 0) return state;
        const previous = past[past.length - 1]
        const newPast = past.slice(Math.max(0, past.length-50), past.length - 1)
        presenteRetorno = {...present, elementos: [...previous.elementos], selecionado: getSelecionadoValido(previous.selecionado, previous.elementos)}
        return {
          past: newPast,
          present: presenteRetorno,
          future: [present, ...future],
          slidePreview: getSlidePreview(presenteRetorno)
        }
      case 'REDO':
        if (future.length === 0) return state;
        const next = future[0]
        const newFuture = future.slice(1)
        presenteRetorno = {...present, elementos: [...next.elementos], selecionado: getSelecionadoValido(next.selecionado, next.elementos)}
        return {
          past: [...past, present],
          present: presenteRetorno,
          future: newFuture,
          slidePreview: getSlidePreview(presenteRetorno)          
        }
      default:
        presenteRetorno = deepSpreadPresente(present);
        const newPresent = reducer(presenteRetorno, action);
        var a = action.type;
        if (a === 'definir-selecao' || a === 'offset-selecao' || a === 'ativar-realce') {
          return {
            past: [...past],
            present: newPresent,
            future: [],
            slidePreview: getSlidePreview(newPresent)  
          }
        }
        return {
          past: [...past, present],
          present: newPresent,
          future: [],
          slidePreview: getSlidePreview(newPresent)  
        }
    }
  }
}

function deepSpreadPresente(present) {
  var elementos = [];
  var selecionado = {...present.selecionado};

  for (var e of present.elementos) {
    var slides = [];
    for (var s of e.slides) {
      var estilo = {};
      for (var est in s.estilo) {
        estilo[est] = {...s.estilo[est]};
      }
      slides.push({...s, estilo: estilo, textoArray: [...s.textoArray]});
    }
    elementos.push({...e, slides: slides});
  }
  var nState = {...present, elementos: elementos, selecionado: selecionado, abaAtiva: present.abaAtiva};
  return {...nState, slidePreview: getSlidePreview(nState)};
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