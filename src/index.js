/*// //Falta fazer:
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
//   ✔️ Botões novos do menu configurações.
//   ✔️ Carrossel da lista de slides.
//   ✔️ Slide-mestre aparecendo na apresentação.
//   ✔️ Carrossel do Input Imagem não vai até o final.*/
// Errinhos:
//   Incluir webfonts na combo de fontes disponíveis.
//   Fontes que não suportam números superscritos.
//   Redividir quando o texto de um slide é todo deletado.
//   Duas colunas
//   Indicar que há estilização nos slides/elementos.
//   Pesquisa de letra de música não funciona na produção.
//
/*// Features:
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
//   ✔️ Possibilidade de editar elemento (retornando à tela da query).
//   ✔️ Atalhos em geral.
//   ✔️ Login para salvar preferências.
//   ✔️ Navbar no topo.
//   ✔️ Exportar como Power Point.*/
//   Tela perfil do usuário: informações básicas, apresentações passadas, predefinições, e-mails salvos. 
//   Atalho para nova apresentação.
//   Exportar como PDF.
//   Enviar por e-mail.
//   Calcular resolução do datashow.
//   Editar tamanho da imagem direto no preview.
//   Exportação de slides de imagem
//   Incorporar vídeos do youtube.
//   Gerar link compartilhável.
//   Criar slides a partir de lista com separador.
//   Combo de número de capítulos e versículos da bíblia.
//   Navegação pelas setas causar rolagem na lista de slides.
//   Pesquisa no conteúdo dos slides.
//   ColorPicker personalizado.
//   Tela de propagandas
//   Adicionar logo da igreja (upload ou a partir de lista de logos famosas de denominações).
//   Melhorar pesquisa de letra de música usando google.
//   Favoritar músicas, fundos...
//
// Negócio:
//   Cadastrar google ads.
//   Criar logo.
//   Buscar parceria com ultimato.
//   Comprar domínio.
//   Configurar site para ser encontrado pelo google.
//   Pedir amigos para compartilharem.

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { createStore } from 'redux';
import hotkeys from 'hotkeys-js';
import { getEstiloPadrao, Estilo, getPadding, tiposElemento } from './Element.js';
import { selecionadoOffset, getSlidePreview } from './Components/MenuExportacao/Exportador';
import { atualizarApresentacao, apresentacaoDefault } from './Components/Login/UsuarioBD';

const tipos = Object.keys(tiposElemento);

var defaultList = {...apresentacaoDefault, 
  abaAtiva: 'texto',
  popupAdicionar: {}
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
  var e;
  switch (action.type) {
    case "inserir":
      var elNovo = action.elemento;
      elNovo.input1 = action.popupAdicionar.input1;
      elNovo.input2 = action.popupAdicionar.input2;
      var elSub;
      if (action.elementoASubstituir) {
        elSub = el[action.elementoASubstituir];
        for (var i = 0; (i < elSub.slides.length) && i < (elNovo.slides.length) ; i++) {
          elNovo.slides[i].estilo = elSub.slides[i].estilo;
        }
        el.splice(action.elementoASubstituir, 1, elNovo);
        el = redividirSlides(el, {elemento: action.elementoASubstituir, slide: 0});
      } else {
        el.push(elNovo);
      }
      return {elementos: [...el], selecionado: {elemento: el.length-1, slide: 0}, abaAtiva: state.abaAtiva, popupAdicionar: {}};
    case "deletar":
      el.splice(Number(action.elemento), 1);
      var novaSelecao = {elemento: state.selecionado.elemento, slide: 0};
      if (state.selecionado.elemento >= el.length) novaSelecao.elemento = state.selecionado.elemento-1 
      return {elementos: el, selecionado: {...novaSelecao}, abaAtiva: state.abaAtiva, popupAdicionar: state.popupAdicionar};
    case "reordenar":
      return {elementos: action.novaOrdemElementos, selecionado: sel, abaAtiva: state.abaAtiva, popupAdicionar: state.popupAdicionar};
    case "criar-nova-apresentacao":
      return {...apresentacaoDefault, abaAtiva: state.abaAtiva, popupAdicionar: state.popupAdicionar};
    case "editar-slide": {
      e = {...el[sel.elemento]};
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
      return {elementos: [...el], selecionado: sel, abaAtiva: state.abaAtiva, popupAdicionar: state.popupAdicionar};
    }
    case "limpar-estilo": {
      const limparEstiloSlide = s => s.estilo = new Estilo();
      const limparEstiloElemento = e => {
        for (var s of e.slides) {
          limparEstiloSlide(s);
        }
      }
      if (sel.elemento === 0) {
        el[0].slides[0].estilo = getEstiloPadrao();
        for (e of el.slice(1)) {
          limparEstiloElemento(e);  
        }
      } else if (sel.slide === 0) {
        limparEstiloElemento(el[sel.elemento]);
      } else {
        limparEstiloSlide(el[sel.elemento].slides[sel.slide]);
      }
      el = redividirSlides(el, sel);
      return {elementos: [...el], selecionado: action.selecionado, abaAtiva: 'texto', popupAdicionar: state.popupAdicionar};
    }
    case "ativar-popup-adicionar": {
      return {...state, popupAdicionar: {...action.popupAdicionar}};
    }
    case "ativar-realce": {
      return {...state, abaAtiva: action.abaAtiva};
    }
    case "definir-selecao":
      return {...state, selecionado: sel};
    case "offset-selecao":
      sel = {...selecionadoOffset(state.elementos, state.selecionado, action.offset)};
      return {...state, selecionado: sel};
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
    slidePreview: getSlidePreview(presenteInicial),
    usuario: {},
    apresentacao: null
  }

  const limiteUndo = 50;

  return function (state = initialState, action) {
    var { past, present, future, previousTemp, apresentacao } = state;
    var newPresent;
    switch (action.type) {
      case 'login':
        return {...state, usuario: action.usuario};
      case 'definir-apresentacao':
        newPresent = {...presenteInicial};
        if (action.elementos) {
          newPresent.elementos = action.elementos;
          newPresent.selecionado = apresentacaoDefault.selecionado;
        }
        return {...state, apresentacao: action.apresentacao, present: newPresent, slidePreview: getSlidePreview(newPresent)};
      case 'UNDO':
        if (past.length === 0) return state;
        const previous = past[past.length - 1]
        const newPast = past.slice(Math.max(0, past.length-limiteUndo), past.length - 1)
        return {
          ...state,
          past: newPast,
          present: previous,
          future: [present, ...future],
          slidePreview: getSlidePreview(previous),
          previousTemp: null
        }
      case 'REDO':
        if (future.length === 0) return state;
        const next = future[0]
        const newFuture = future.slice(1)
        return {
          ...state,
          past: [...past, present],
          present: next,
          future: newFuture,
          slidePreview: getSlidePreview(next),
          previousTemp: null
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
        var mudanca = houveMudanca(present, newPresent);
        if (mudanca) {
          past = [...past, present];
          if(apresentacao && mudanca.find(m => m === 'elementos'))
            atualizarApresentacao(newPresent.elementos, apresentacao.idApresentacao);
          if (action.type === 'inserir')
            present.popupAdicionar = {...action.popupAdicionar, tipo: action.elemento.tipo};
        } 
        return {
          ...state,
          past: [...past],
          present: newPresent,
          future: [],
          slidePreview: getSlidePreview(newPresent),
          previousTemp: null,
        }
    }
  }
}

function houveMudanca(estado1, estado2) {
  const keysRelevantes = ['elementos', 'popupAdicionar'];
  var retorno = [];
  for (var k of keysRelevantes) {
    if (JSON.stringify(estado1[k]) !== JSON.stringify(estado2[k]))
      retorno.push(k);  
  }
  if (retorno.length === 0) retorno = false;
  return retorno; 
}

function deepSpreadPresente(present) {
  var elementos = [];
  var selecionado = {...present.selecionado};
  var popupAdicionar = {...present.popupAdicionar};
  var abaAtiva = present.abaAtiva

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
  return {...present, elementos: elementos, selecionado: selecionado, abaAtiva: abaAtiva, popupAdicionar: popupAdicionar};
}

export let store = createStore(undoable(reducerElementos), /* preloadedState, */
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const atalhosAdicionar = {ctrlm: 0, ctrlb: 1, ctrll: 2, ctrli: 3, ctrld: 4};

hotkeys('right,left,up,down,ctrl+z,ctrl+shift+z,ctrl+y,ctrl+n,ctrl+m,ctrl+i,ctrl+b,ctrl+l,ctrl+d', function(event, handler){
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
      // case 'ctrl+n':
      //   store.dispatch({type: 'criar-nova-apresentacao'});
      default:
        var atalho = handler.key.replace('+','');
        var tipo = tipos[atalhosAdicionar[atalho]];
        store.dispatch({type: 'ativar-popup-adicionar', popupAdicionar: {tipo: tipo}});
  }
  if (offset !== 0) store.dispatch({type: 'offset-selecao', offset: offset})
});

ReactDOM.render(
  <App />,
  document.getElementById('root')
);