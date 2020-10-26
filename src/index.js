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
//   Incorporar vídeos do youtube.
//   Exportar como power point, pdf e html.
//   Botão para zerar/começar nova apresentação.
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

var defaultSemPreview = {elementos: [new Element("Slide-Mestre", "Slide-Mestre", [textoMestre], null, estiloPadrao, true)],
  selecionado: {elemento: 0, slide: 0}, 
  realce: {aba: '', cor: ''}
};

const defaultList = {...defaultSemPreview, slidePreview: getSlidePreview(defaultSemPreview)};

export const reducerElementos = function (state = defaultList, action) {

  var nState;
  var el = [...state.elementos];
  var sel = action.selecionado || state.selecionado;;
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
      var e = el[sel.elemento]
      if (action.objeto === 'estilo') {
        e.slides[sel.slide].estilo = action.valor;
      } else {
        var obj = e.slides[sel.slide].estilo;
        obj[action.objeto] = action.valor instanceof Object ? {...obj[action.objeto], ...action.valor} : action.valor;
      }
      // e.higienizarEstilo(sel.slide);
      nState = {elementos: el, selecionado: sel}; //Para que o getSlidePreview use os valores já atualizados.
      return {...nState, slidePreview: getSlidePreview(nState), realce: state.realce};
    }
    case "redividir-slides": {
      if (state.elementos.length === 1) return state;
      const redividir = (e, s) => e.criarSlides(e.getArrayTexto(s), e.slides[0].estilo, s, state.elementos[0].slides[0].estilo);
      var [ i, slide, repetir ] = (action.selecionado.elemento === 0 ? [ 1, 0, 1 ] : [ action.selecionado.elemento, action.selecionado.slide, 0]);
      do {
        redividir(state.elementos[i], slide)
        i++;
      } while (repetir && i < state.elementos.length)
      nState = {elementos: state.elementos, selecionado: {...action.selecionado}};
      return {...nState, slidePreview: getSlidePreview(nState), realce: state.realce};  
    }
    case "limpar-estilo": {
      if (sel.elemento === 0 && sel.slide === 0) {
        el[0].slides[0].estilo[action.objeto] = estiloPadrao[action.objeto];  
      } else {
        if (action.objeto) {
          el[sel.elemento].slides[sel.slide].estilo[action.objeto] = {};
        } else {
          el[sel.elemento].slides[sel.slide].estilo = new Estilo();
        }
      }
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

export let store = createStore(reducerElementos, /* preloadedState, */
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

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