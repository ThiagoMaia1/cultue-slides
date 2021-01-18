import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Home from './Home';
import { createStore } from 'redux';
import hotkeys from 'hotkeys-js';
import { getEstiloPadrao, newEstilo, getDadosMensagem } from './principais/Element.js';
import { selecionadoOffset, getSlidePreview } from './Components/MenuExportacao/Exportador';
import { atualizarApresentacao, getApresentacaoPadraoBasica, autorizacaoEditar, autorizacaoPadrao, apresentacaoAnonima, getElementosDesconvertidos } from './principais/firestore/apresentacoesBD';
import { atualizarRegistro } from './principais/firestore/apiFirestore';
import { keysTutoriais } from './Components/Tutorial/ListaTutorial';
import { toggleFullscreen, objetosSaoIguais } from './principais/FuncoesGerais';
import { getPopupConfirmacao } from './Components/Popup/PopupConfirmacao';
import inicializarHotkeys from './principais/atalhos';
import { persistStore, persistReducer, createTransform } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import reducerEditarSlide from './principais/reducerEditarSlide';

const numeroAcoesPropaganda = 20000;
const abaAtivaPadrao = 'texto';

const defaultList = {...getApresentacaoPadraoBasica(), 
  abaAtiva: abaAtivaPadrao,
  popupAdicionar: {},
  apresentacao: apresentacaoAnonima,
  modoApresentacao: false
};

const getAutorizacao = (autorizacao, idUsuario, idUsuarioAtivo) => {
  autorizacao = autorizacao || autorizacaoPadrao;
  if ((idUsuarioAtivo === idUsuario || !idUsuario) && autorizacao === 'ver')
    autorizacao = 'editar';
  return autorizacao;
}

export const redividirSlides = (elementos, sel, ratio) => {
  if (elementos.length !== 1) {
      var [ i, slide, repetir ] = (sel.elemento === 0 ? [ 1, 0, 1 ] : [ sel.elemento, sel.slide, 0]);
    do {
      var e = elementos[i];
      if (!e.getArrayTexto) e = getElementosDesconvertidos([e])[0];
      e.criarSlides(e.getArrayTexto(slide, e), e.slides[0].estilo, slide, elementos[0].slides[0].estilo, ratio, e);
      i++;
    } while (repetir && i < elementos.length)
  }
  
  return elementos;
}

export const reducerElementos = function (state = defaultList, action, usuario) {

  var el = [...state.elementos];
  var sel = action.selecionado || state.selecionado;
  var e;
  var notificacao;
  var dadosMensagem;
  var autorizacao;
  let { ratio, abaAtiva } = state;
  delete state.notificacao;
  switch (action.type) {
    case 'definir-apresentacao-ativa':
      var ap = action.apresentacao;
      ap.autorizacao = getAutorizacao(ap.autorizacao, ap.idUsuario, usuario.uid);
      sel = selecionadoOffset(action.elementos, getApresentacaoPadraoBasica().selecionado, 0, !autorizacaoEditar(ap.autorizacao));
      return {...state, apresentacao: action.apresentacao, elementos: action.elementos, ratio: action.ratio, selecionado: sel};
    case 'alterar-autorizacao':
      autorizacao = getAutorizacao(action.autorizacao, state.apresentacao.idUsuario, usuario.uid);
      return {...state, apresentacao: {...state.apresentacao, autorizacao: autorizacao}};
    case 'selecionar-ratio-apresentacao':
      return {...state, elementos: redividirSlides(el, getApresentacaoPadraoBasica().selecionado, action.ratio), ratio: {...action.ratio}}
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
        el = redividirSlides(el, {elemento: action.elementoASubstituir, slide: 0}, ratio);
      } else {
        el.push(elNovo);
      }
      return {...state, elementos: [...el], selecionado: {elemento: el.length-1, slide: 0}, popupAdicionar: {}};
    case "deletar":
      var excluido = el.splice(Number(action.elemento), 1);
      dadosMensagem = getDadosMensagem(excluido[0]);
      notificacao = dadosMensagem.elemento + ' Excluíd' + dadosMensagem.genero;
      var novaSelecao = {elemento: state.selecionado.elemento, slide: 0};
      if (state.selecionado.elemento >= el.length) novaSelecao.elemento = state.selecionado.elemento-1 
      return {...state, elementos: el, selecionado: {...novaSelecao}, notificacao };
    case 'duplicar-slide':
      if(el[sel.elemento].eMestre) return state;
      el.splice(sel.elemento, 0, el[sel.elemento]);
      sel.elemento++;
      dadosMensagem = getDadosMensagem(el[sel.elemento]);
      notificacao = dadosMensagem.elemento + ' Duplicad' + dadosMensagem.genero;
      return {...state, elementos: el, selecionado: sel, notificacao};
    case "reordenar":
      return {...state, elementos: action.novaOrdemElementos, selecionado: sel};
    case "toggle-colapsar":
      el[sel.elemento].colapsado = !el[sel.elemento].colapsado;
      return {...state, elementos: el};
    case "editar-slide": {
      return {...state, ...reducerEditarSlide({elementos: el, sel, action, ratio})};
    }
    case "limpar-estilo": {
      dadosMensagem = getDadosMensagem(el[sel.elemento]);
      const limparEstiloSlide = s => s.estilo = newEstilo();
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
        notificacao = 'Estilo de Toda a Apresentação Limpo'
      } else if (sel.slide === 0) {
        limparEstiloElemento(el[sel.elemento]);
        notificacao = 'Estilo d' + dadosMensagem.genero + ' ' + dadosMensagem.elemento + ' Limp' + dadosMensagem.genero;
      } else {
        limparEstiloSlide(el[sel.elemento].slides[sel.slide]);
        notificacao = 'Estilo do Slide' + sel.slide + ' d' + dadosMensagem.genero + ' ' + dadosMensagem.elementos + '" Limp' + dadosMensagem.genero;
      }
      el = redividirSlides(el, sel, state.ratio);
      return {...state, elementos: [...el], selecionado: action.selecionado, abaAtiva: abaAtivaPadrao, notificacao};
    }
    case "fixar-novas-fontes": {
      return {...state, notificacao: 'Fontes Especiais Substituídas'};
    }
    case "ativar-popup-adicionar": {
      return {...state, popupAdicionar: {...action.popupAdicionar}};
    }
    case "ativar-realce": {
      return {...state, abaAtiva: action.abaAtiva};
    }
    case "definir-selecao":
      if(action.offset !== undefined) 
        sel = {...selecionadoOffset(el, sel, action.offset, autorizacaoEditar(state.apresentacao.autorizacao) ? undefined : true)};
      else if (!autorizacaoEditar(state.apresentacao.autorizacao)) 
        sel = selecionadoOffset(el, sel, 0, true);
      let [elMax, slideMax] = [el.length -1, el[sel.elemento].slides.length - 1] 
      if(sel.elemento > elMax) sel.elemento = elMax;
      if(sel.slide > slideMax) sel.slide = slideMax;
      if(/imagem|video/.test(el[sel.elemento].tipo)) {
        if(abaAtiva === 'paragrafo') abaAtiva = abaAtivaPadrao;
      } else if(abaAtiva === 'imagem') abaAtiva = abaAtivaPadrao;
      return {...state, selecionado: sel, abaAtiva};
    case 'definir-modo-apresentacao':
      var novoModo = action.modoApresentacao || !state.modoApresentacao;
      toggleFullscreen(novoModo ? document.getElementById('borda-slide-mestre') : null);
      novoModo
        ? hotkeys.setScope('apresentacao')
        : hotkeys.setScope('app')
      if (novoModo) sel = selecionadoOffset(state.elementos, sel, 0, true);
      return {...state, modoApresentacao: novoModo, selecionado: sel};
    default:
      return state;
  }
};

const estadoSessao = {
  popupConfirmacao: null,
  notificacoes: [],
  itensTutorial: [],
  searchAtivo: false,
  erros: []
}

export function undoable(reducer) {

  var presenteInicial = reducer(undefined, {})
  const initialState = {
    past: [],
    present: presenteInicial,
    future: [],
    slidePreview: getSlidePreview(presenteInicial),
    usuario: {},
    tutoriaisFeitos: [],
    contadorPropaganda: 0,
    propagandaAtiva: false,
    ...estadoSessao
  }

  const limiteUndo = 50;
  
  return function (state = initialState, action) {
    let { past, present, future, previousTemp, usuario, notificacoes, tutoriaisFeitos, 
          itensTutorial, searchAtivo, contadorPropaganda, propagandaAtiva, erros, popupConfirmacao } = state;

    var notificacoesAtualizado = getNotificacoes(notificacoes, getConteudoNotificacao(action));
    var newPresent;
    var novosItensTutorial = [];
    var slidesPadrao = [];
    const tituloSemConexao = 'Sem Conexão com a Internet';
    if(!window.navigator.onLine) {
      return {...state, ...getPopupConfirmacao(
        'OK',
        tituloSemConexao,
        'Você não possui uma conexão ativa. Verifique sua conexão para continuar.'
      )}
    } else if(popupConfirmacao && popupConfirmacao.titulo === tituloSemConexao) {
      state.popupConfirmacao = null;
    }
    if(propagandaAtiva) {
      if(action.type === 'desativar-propaganda') {        
        return {...state, propagandaAtiva: false};
      } else {
        return state;
      }
    }
    switch (action.type) {
      case 'resetar':
        return {...initialState};
      case 'login':
        var feitos = [...tutoriaisFeitos, ...(action.usuario.tutoriaisFeitos || [])];
        novosItensTutorial = itensTutorial.filter(n => !feitos.includes(n))
        return {...state, usuario: action.usuario, tutoriaisFeitos: feitos, itensTutorial: novosItensTutorial};
      case 'definir-apresentacao-padrao':
        let idApresentacaoPadrao = action.idApresentacao;
        atualizarDadosUsuario(usuario.uid, {idApresentacaoPadrao});
        return {...state, usuario: {...usuario, idApresentacaoPadrao}};
      case 'definir-item-tutorial':
        let tutoriaisAction = [action.itemTutorial].flat();
        var feitosNovo = action.refazer
                         ? tutoriaisFeitos.filter(t => !tutoriaisAction.includes(t))
                         : [...new Set([...tutoriaisFeitos, ...itensTutorial].filter(t => !!t))];
        if (!action.zerar) {
          novosItensTutorial = [...itensTutorial];
          for(let t of tutoriaisAction) {
            if (!feitosNovo.includes(t)) novosItensTutorial.push(t);
          }
        }
        atualizarDadosUsuario(usuario.uid, {tutoriaisFeitos: feitosNovo});
        return {...state, itensTutorial: novosItensTutorial, tutoriaisFeitos: feitosNovo}
      case 'bloquear-tutoriais':
        atualizarDadosUsuario(usuario.uid, { tutoriaisFeitos: keysTutoriais });
        return {...state, itensTutorial: [], tutoriaisFeitos: [...keysTutoriais]}
      case 'adicionar-slide-padrao':
        slidesPadrao = [...usuario.slidesPadrao, action.slide];
        atualizarDadosUsuario(usuario.uid, {slidesPadrao});
        return {...state, usuario: {...usuario, slidesPadrao}};
      case 'excluir-slide-padrao':
        slidesPadrao = [...usuario.slidesPadrao]
        slidesPadrao.splice(usuario.slidesPadrao.map(s => s.titulo).indexOf(action.titulo), 1);
        atualizarDadosUsuario(usuario.uid, {slidesPadrao});
        return {...state, usuario: {...usuario, slidesPadrao}};
      case 'alterar-imagem-colecao-usuario':
        let { urls, subconjunto, excluir, transferirPara } = action;
        if (!Array.isArray(urls)) urls = [urls];
        let imagens = {...usuario.imagens} || {};
        let conjunto = [...(imagens[subconjunto] || [])];
        imagens[subconjunto] = (excluir || transferirPara)
                               ? conjunto.filter(img => !urls.includes(img))
                               : [...urls, ...conjunto];
        if(transferirPara) imagens[transferirPara] = [...(imagens[transferirPara] || []), ...urls];
        for (let k of Object.keys(imagens)) 
          imagens[k] = [...new Set(imagens[k])];
        atualizarDadosUsuario(usuario.uid, {imagens});
        return {...state, usuario: {...usuario, imagens }};
      case 'toggle-search':
        return {...state, searchAtivo: !searchAtivo};
      case 'ativar-popup-confirmacao':
        return {...state, popupConfirmacao: action.popupConfirmacao};
      case 'UNDO':
        if (past.length === 0) return state;
        const previous = past[past.length - 1];
        const newPast = past.slice(0, past.length - 1);
        atualizarApresentacaoBD (present, previous);
        return {
          ...state,
          past: newPast,
          present: previous,
          future: [present, ...future],
          slidePreview: getSlidePreview(previous),
          previousTemp: null,
          notificacoes: notificacoesAtualizado
        }
      case 'REDO':
        if (future.length === 0) return state;
        const next = future[0];
        const newFuture = future.slice(1);
        atualizarApresentacaoBD (present, next);
        return {
          ...state,
          past: [...past, present],
          present: next,
          future: newFuture,
          slidePreview: getSlidePreview(next),
          previousTemp: null,
          notificacoes: notificacoesAtualizado
        }
      case 'editar-slide-temporariamente':
        newPresent = reducer(deepSpreadPresente(present), {...action, type: 'editar-slide'}, usuario)
        return {...state, 
          present: newPresent, 
          previousTemp: previousTemp || deepSpreadPresente(present), 
          slidePreview: getSlidePreview(newPresent)};
      case 'editar-slide-preview':
        newPresent = action.reverter ? present : reducer(deepSpreadPresente(present), {...action, type: 'editar-slide'}, usuario);
        return {...state, slidePreview: getSlidePreview(newPresent)};
      case 'registrar-erro':
        return {...state, erros: [...erros, action.erro]};
      default:
        newPresent = reducer(deepSpreadPresente(present), action, usuario);
        notificacoesAtualizado = getNotificacoes(notificacoesAtualizado, newPresent.notificacao);
        if (previousTemp) present = previousTemp;
        var mudanca = houveMudanca(present, newPresent);
        if (mudanca.length > 0) {
          past = [...past, present];
          if(mudanca.includes('elementos') || mudanca.includes('ratio'))
            newPresent.apresentacao.zerada = false
          if (action.type === 'inserir')
          present.popupAdicionar = {...action.popupAdicionar, tipo: action.elemento.tipo};
        } 
        atualizarApresentacaoBD (present, newPresent, mudanca);
        if (past.length - contadorPropaganda*numeroAcoesPropaganda >= numeroAcoesPropaganda) {
          contadorPropaganda++;
          propagandaAtiva = true;
        }
        return {
          ...state,
          past: [...past.slice(Math.max(0, past.length-limiteUndo), past.length)],
          present: newPresent,
          future: [],
          slidePreview: getSlidePreview(newPresent),
          previousTemp: null,
          notificacoes: [...notificacoesAtualizado],
          propagandaAtiva: propagandaAtiva,
          contadorPropaganda: contadorPropaganda
        }
    }
  }
}

const rootReducer = (state, action) => {
  if (/persist\//.test(action.type)) return state;
  return undoable(reducerElementos)(state, action);
}

const limparSessao = createTransform(
  undefined,
  (_state, key) => estadoSessao[key],
  {whitelist: Object.keys(estadoSessao)}
)

const persistConfig = {
  key: 'root',
  storage,
  stateReconciler: autoMergeLevel2,
  transforms: [limparSessao]
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

let store = createStore(persistedReducer, /* preloadedState, */
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export let persistor = persistStore(store);
export default store;

window.onerror = (_message, _source, _lineno, _colno, error) => {
  store.dispatch({type: 'registrar-erro', erro: error})
}

const atualizarDadosUsuario = (idUsuario, dados) => {
  if (idUsuario)
    atualizarRegistro(dados, 'usuários', idUsuario);
}

function atualizarApresentacaoBD (present, newPresent, mudanca = null) {
  if (!mudanca) mudanca = houveMudanca(present, newPresent);
  if ((mudanca.includes('elementos') || mudanca.includes('ratio')) && !mudanca.includes('apresentacao') && newPresent.apresentacao.id) {
    atualizarApresentacao(newPresent.elementos, newPresent.ratio, newPresent.apresentacao.id);
  } 
}

function houveMudanca(estado1, estado2) {
  const keysRelevantes = ['elementos', 'popupAdicionar', 'apresentacao', 'ratio'];
  var retorno = [];
  for (var k of keysRelevantes) {
    if (!objetosSaoIguais(estado1[k], estado2[k]))
      retorno.push(k);  
  }
  return retorno; 
}

function deepSpreadPresente(present) {
  var elementos = [];
  var selecionado = {...present.selecionado};
  var popupAdicionar = {...present.popupAdicionar};
  var abaAtiva = present.abaAtiva;
  var apresentacao = {...present.apresentacao};
  var ratio = {...present.ratio}

  for (var e of present.elementos) {
    var slides = [];
    for (var s of e.slides) {
      var estilo = {};
      for (var est in s.estilo) {
        estilo[est] = {...s.estilo[est]};
      }
      slides.push({...s, estilo: estilo, textoArray: [...s.textoArray]});
    }
    let input2;
    if((e.input2 || []).length) {
      input2 = [];
      for (let i of e.input2) {
        input2.push({...i});
      }
    } else {
      input2 = e.input2;
    }
    elementos.push({...e, slides, input2});
  }
  return {...present, elementos, selecionado, abaAtiva, popupAdicionar, apresentacao, ratio};
}

function getNotificacoes(notificacoes, conteudo) {
  var notif = notificacoes;
  if (conteudo) {
    notificacoes.unshift({conteudo: conteudo, dateTime: new Date().getTime()});
    notif = [...notificacoes];
  }
  return notif;
}

function getConteudoNotificacao(action) {
  var conteudo;
  switch(action.type){
    case 'UNDO':
      conteudo = 'Ação Desfeita';
      break;
    case 'REDO':
      conteudo = 'Ação Refeita';
      break;
    case 'inserir-notificacao':
      conteudo = action.conteudo;
      break;
    default:
      return null;
  }
  return conteudo;
}

inicializarHotkeys();

ReactDOM.render(
  <Home />,
  document.getElementById('root')
);