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
//   Zerar sliders ao limpar formatação.
//   Incluir webfonts na combo de fontes disponíveis.
//   'Null' no título do slide quando a referência é como: lc3-5.
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
import Element, { estiloPadrao, proporcaoPadTop, textoMestre, Estilo, capitalize } from './Element.js';


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

function selecionadoOffset (elementos, selecionado, offset) {
  var elem = elementos.flatMap((e, i) => { 
    return e.slides.map((s, j) => ({elemento: i, slide: j, texto: s.texto})); //Gera um array ordenado com todos os slides que existem representados por objetos do tipo "selecionado".
  })
  for (var i = 0; i < elem.length; i++) { //Acha o selecionado atual.
    if (elem[i].elemento === selecionado.elemento && elem[i].slide === selecionado.slide) {
      var novoIndex = i + offset;
      if (novoIndex < 0) {
        novoIndex = 0;
      } else if (novoIndex >= elem.length) { 
        novoIndex = elem.length-1;
      }
      if (document.fullscreenElement) { //Se for slide mestre, pula um a mais pra frente ou pra trás com base no offset informado.
        while (elem[novoIndex].eMestre) {
          offset = offset > 0 ? 1 : -1;
          novoIndex += offset;
          if (novoIndex >= elem.length || novoIndex <= 0) {
            novoIndex = i;
            offset = -offset; 
          }
        }
      }         
      break;
    }
  }
  return {elemento: elem[novoIndex].elemento, slide: elem[novoIndex].slide};
}

function getSlidePreview (state) {
  const sel = state.selecionado;
  const global = state.elementos[0].slides[0];
  const elemento = state.elementos[sel.elemento].slides[0];
  const slide = state.elementos[sel.elemento].slides[sel.slide];

  var estiloTexto = {...global.estilo.texto, ...elemento.estilo.texto, ...slide.estilo.texto};
  //Pra dividir o padding-top.
  var estiloParagrafo = {...estiloTexto, ...global.estilo.paragrafo, ...elemento.estilo.paragrafo, ...slide.estilo.paragrafo};
  var estiloTitulo = {...estiloTexto, ...global.estilo.titulo, ...elemento.estilo.titulo, ...slide.estilo.titulo};
  var tipo = state.elementos[sel.elemento].tipo;
  var titulo = capitalize(state.elementos[sel.elemento].titulo, estiloTitulo.caseTexto);

  return {tipo: tipo,
    nomeLongoElemento: tipo.replace('-', ' ') + ': ' + ((tipo === 'Imagem' && !state.elementos[sel.elemento].titulo) ? state.elementos[sel.elemento].imagens[0].alt : state.elementos[sel.elemento].titulo),
    nomeLongoSlide: '',
    selecionado: {...sel},
    texto: capitalize(slide.texto, estiloParagrafo.caseTexto),
    titulo: titulo,
    eMestre: slide.eMestre,
    imagem: slide.imagem,
    estilo: {
      titulo: {...estiloTitulo, ...getEstiloPad(estiloTitulo, 'titulo'), fontSize: estiloTitulo.fontSize*100 + '%', height: estiloTitulo.height*100 + '%'},
      paragrafo: {...getEstiloPad(estiloParagrafo, 'paragrafo'), fontSize: estiloParagrafo.fontSize*100 + '%'},
      fundo: {...global.estilo.fundo, ...elemento.estilo.fundo, ...slide.estilo.fundo}, 
      tampao: {...global.estilo.tampao, ...elemento.estilo.tampao, ...slide.estilo.tampao},
      texto: {...estiloTexto},
      imagem: {...global.estilo.imagem, ...elemento.estilo.imagem, ...slide.estilo.imagem}
    }
  };
}

function getEstiloPad (estilo, objeto) {
  var pad = estilo.padding*100; //Separa o padding para o padding-top ser diferente, proporcional à constante proporcaoPadTop.
  var rep;
  var padTop;
  if (objeto === 'titulo') {
    [ rep, padTop ] = [ 1, 0 ];
  } else {
    rep = 3;
    padTop = pad*proporcaoPadTop || '0.5';
  }
  return {...estilo, padding: String(padTop).substr(0, 5) + ('% ' + pad).repeat(rep) + '%'};
}

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