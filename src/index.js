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
//   ✔️ Zerar sliders ao limpar formatação.
//   ✔️ Reduzir logo PowerPoint.
//   ✔️ Redividir slides não está funcionando.
//   ✔️ Dividir slides calculando errado \n\n nos textos bíblicos.
//   ✔️ Combobox fonte letra não atualiza direito seu estilo.
//   ✔️ Atualizar apenas preview nos sliders, atualizar store apenas ao perder foco.
//   ✔️ TextoMestre nos slides de imagem.
//   ✔️ Alterar nome do tipo de slide de "Título" para "Texto Livre".
//   ✔️ Dividir slides chegando na borda.
//   ✔️ Alinhamento de texto não funciona desde que mudei as divs dos paragrafos.
//   Incluir webfonts na combo de fontes disponíveis.
//   Carrossel do Input Imagem não vai até o final.
//   Carrossel da lista de slides.
//   Fontes que não suportam números superscritos.
//   Exportação de slides de imagem como html.
//   Redividir quando o texto de um slide é todo deletado.
//   Duas colunas
//   Botões novos do menu configurações.
//
// Features:
//   ✔️ Envio de imagens.
//   ✔️ Navegar slides clicando à direita ou esquerda.
//   ✔️ Enviar imagem para fundo.
//   ✔️ Editar texto direto no slide.
//   ✔️ Permitir desfazer ações da store (Ctrl + Z).
//   ✔️ Botão para zerar/começar nova apresentação.
//   ✔️ Popup de confirmação.
//   ✔️ Exportar como HTML.
//   ✔️ Marcador de repetições de estrofes nos slides de música/slide de refrão repetido.
//   ✔️ Dividir música em colunas.
//   Calcular resolução do datashow.
//   Exportar como Power Point.
//   Incorporar vídeos do youtube.
//   Gerar link compartilhável.
//   Enviar por e-mail.
//   Exportar como PDF.
//   Atalhos em geral.
//   Possibilidade de editar elemento (retornando à tela da query).
//   Criar slides a partir de lista com separador.
//   Editar tamanho da imagem direto no preview.
//   Combo de número de capítulos e versículos da bíblia.
//   Navegação pelas setas causar rolagem na lista de slides.
//   ColorPicker personalizado.
//   Login para salvar preferências.

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { createStore } from 'redux';
import hotkeys from 'hotkeys-js';
import Element, { getEstiloPadrao, textoMestre, Estilo, getPadding } from './Element.js';
import { selecionadoOffset, getSlidePreview } from './Components/MenuExportacao/Exportador'

const criarNovaApresentacao = () => {
  return [new Element("Slide-Mestre", "Slide-Mestre", [textoMestre], null, {...getEstiloPadrao()}, true)];
}

var defaultList = {elementos: criarNovaApresentacao(),
  selecionado: {elemento: 0, slide: 0}, 
  abaAtiva: 'texto'
};

const redividirSlides = (elementos, sel) => {
  if (elementos.length !== 1) {
      var [ i, slide, repetir ] = (sel.elemento === 0 ? [ 1, 0, 1 ] : [ sel.elemento, sel.slide, 0]);
    do {
      var e = elementos[i];
      e.criarSlides(e.getArrayTexto(slide, e), e.slides[0].estilo, slide, elementos[0].slides[0].estilo, e);
      i++;
    } while (repetir && i < elementos.length)
  }
  
  return elementos;
}

export const reducerElementos = function (state = defaultList, action) {

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
    case "criar-nova-apresentacao":
      return {elementos: criarNovaApresentacao(), selecionado: {elemento: 0, slide: 0}, abaAtiva: state.abaAtiva};
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
      } else if (Object.keys(action.valor)[0] === 'paddingRight') {
        est[action.objeto].paddingRight = action.valor.paddingRight;
        est[action.objeto] = getPadding(est, action.objeto);
      } else {
        est[action.objeto] = {...est[action.objeto], ...action.valor};
      }
      el[sel.elemento] = e;
      if (action.redividir) el = redividirSlides(el, sel);
      return {elementos: [...el], selecionado: sel, abaAtiva: state.abaAtiva};
    }
    case "limpar-estilo": {
      if (sel.elemento === 0 && sel.slide === 0) {
        if (action.objeto) {
          el[0].slides[0].estilo[action.objeto] = getEstiloPadrao([action.objeto]);  
        } else {
          el[0].slides[0].estilo = {...getEstiloPadrao()};
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

  return function (state = initialState, action) {
    var { past, present, future, previousTemp } = state;
    var newPresent;
    switch (action.type) {
      case 'UNDO':
        if (past.length === 0) return state;
        const previous = past[past.length - 1]
        const newPast = past.slice(Math.max(0, past.length-50), past.length - 1)
        return {
          past: newPast,
          present: previous,
          future: [present, ...future],
          previousTemp: null,
          slidePreview: getSlidePreview(previous)
        }
      case 'REDO':
        if (future.length === 0) return state;
        const next = future[0]
        const newFuture = future.slice(1)
        return {
          past: [...past, present],
          present: next,
          future: newFuture,
          previousTemp: null,
          slidePreview: getSlidePreview(next)          
        }
      case 'editar-slide-temporariamente':
        newPresent = reducer(deepSpreadPresente(present), {...action, type: 'editar-slide'})
        return {...state, 
          present: newPresent, 
          previousTemp: previousTemp || deepSpreadPresente(present), 
          slidePreview: getSlidePreview(newPresent)};
      default:
        newPresent = reducer(deepSpreadPresente(present), action);
        if (previousTemp) present = previousTemp;
        if (houveMudanca(present, newPresent)) {
          return {
            past: [...past],
            present: newPresent,
            future: [],
            previousTemp: null,
            slidePreview: getSlidePreview(newPresent)  
          }
        }
        return {
          past: [...past, present],
          present: newPresent,
          future: [],
          previousTemp: null,
          slidePreview: getSlidePreview(newPresent)  
        }
    }
  }
}

function houveMudanca(estado1, estado2) {
  return JSON.stringify(estado1.elementos) === JSON.stringify(estado2.elementos);
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
  return {...present, elementos: elementos, selecionado: selecionado, abaAtiva: present.abaAtiva};
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