import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Home from './Home';
import { createStore } from 'redux';
import hotkeys from 'hotkeys-js';
import Element, { getEstiloPadrao, newEstilo, getPadding, getDadosMensagem, listaPartesEstilo } from './principais/Element.js';
import { selecionadoOffset, getSlidePreview } from './Components/MenuExportacao/Exportador';
import { atualizarApresentacao, getApresentacaoPadrao, autorizacaoEditar, ratioPadrao, autorizacaoPadrao, apresentacaoAnonima } from './principais/firestore/apresentacoesBD';
import { atualizarRegistro } from './principais/firestore/apiFirestore';
import { keysTutoriais } from './Components/Tutorial/Tutorial';
import { toggleFullscreen } from './principais/FuncoesGerais';
import inicializarHotkeys from './principais/atalhos';

const redividirSlides = (elementos, sel, ratio) => {
  if (elementos.length !== 1) {
      var [ i, slide, repetir ] = (sel.elemento === 0 ? [ 1, 0, 1 ] : [ sel.elemento, sel.slide, 0]);
    do {
      var e = elementos[i];
      e.criarSlides(e.getArrayTexto(slide, e), e.slides[0].estilo, slide, elementos[0].slides[0].estilo, ratio, e);
      i++;
    } while (repetir && i < elementos.length)
  }
  
  return elementos;
}

const numeroAcoesPropaganda = 20;

var defaultList = {...getApresentacaoPadrao(), selecionado: {elemento: 1, slide: 0}, elementos: [...getApresentacaoPadrao().elementos, new Element('Imagem', 'Imagem', [], [{src: '123'}])], 
  abaAtiva: 'texto',
  popupAdicionar: {},
  apresentacao: apresentacaoAnonima,
  ratio: {...ratioPadrao},
  modoApresentacao: false
};

const getAutorizacao = (autorizacao, idUsuario, idUsuarioAtivo) => {
  autorizacao = autorizacao || autorizacaoPadrao;
  if ((idUsuarioAtivo === idUsuario || !idUsuario) && autorizacao === 'ver')
    autorizacao = 'editar';
  return autorizacao;
}

export const reducerElementos = function (state = defaultList, action, usuario) {

  var el = [...state.elementos];
  var sel = action.selecionado || state.selecionado;
  var e;
  var notificacao;
  var dadosMensagem;
  var autorizacao;
  delete state.notificacao;
  switch (action.type) {
    case 'definir-apresentacao-ativa':
      var ap = action.apresentacao;
      ap.autorizacao = getAutorizacao(ap.autorizacao, ap.idUsuario, usuario.uid);
      sel = selecionadoOffset(action.elementos, getApresentacaoPadrao().selecionado, 0, !autorizacaoEditar(ap.autorizacao));
      return {...state, apresentacao: action.apresentacao, elementos: action.elementos, ratio: action.ratio, selecionado: sel};
    case 'alterar-autorizacao':
      autorizacao = getAutorizacao(action.autorizacao, state.apresentacao.idUsuario, usuario.uid);
      return {...state, apresentacao: {...state.apresentacao, autorizacao: autorizacao}};
    case 'selecionar-ratio-apresentacao':
      return {...state, elementos: redividirSlides(el, {elemento: 0, slide: 0}, action.ratio), ratio: {...action.ratio}}
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
        el = redividirSlides(el, {elemento: action.elementoASubstituir, slide: 0}, state.ratio);
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
      return {...state, elementos: el, selecionado: {...novaSelecao}, notificacao: notificacao };
    case "reordenar":
      return {...state, elementos: action.novaOrdemElementos, selecionado: sel};
    case "toggle-colapsar":
      el[sel.elemento].colapsado = !el[sel.elemento].colapsado;
      return {...state, elementos: el};
    case "editar-slide": {
      e = {...el[sel.elemento]};
      var s = e.slides[sel.slide];
      var est = s.estilo;
      if (action.objeto === 'estilo') {
        s.estilo = {...action.valor};
      } else if (action.objeto === 'estiloSemReplace') {
        var keys = Object.keys(action.estilo).filter(k => listaPartesEstilo.includes(k));
        for (var k of keys) {
          s.estilo[k] = {...s.estilo[k], ...action.estilo[k]};
        }
      } else if(action.objeto === 'srcImagem') {
        s.imagem = {...action.valor};
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
        if (!sel.slide && e.tipo !== 'Imagem' && e.tipo !== 'Vídeo') e.titulo = action.valor;
      } else if (Object.keys(action.valor)[0] === 'paddingRight') {
        est[action.objeto].paddingRight = action.valor.paddingRight;
        est[action.objeto] = getPadding(est, action.objeto);
      } else if (action.objeto === 'fundo') {
        est.fundo = {...action.valor};
      } else {
        est[action.objeto] = {...est[action.objeto], ...action.valor};
      }
      el[sel.elemento] = e;
      if (action.redividir) el = redividirSlides(el, sel, state.ratio);
      return {...state, elementos: [...el], selecionado: sel};
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
      return {...state, elementos: [...el], selecionado: action.selecionado, abaAtiva: 'texto', notificacao: notificacao};
    }
    case "ativar-popup-adicionar": {
      return {...state, popupAdicionar: {...action.popupAdicionar}};
    }
    case "ativar-realce": {
      return {...state, abaAtiva: action.abaAtiva};
    }
    case "definir-selecao":
      if (!autorizacaoEditar(state.apresentacao.autorizacao)) 
        sel = selecionadoOffset(state.elementos, action.selecionado, 0, true);
      if(sel.slide > el[sel.elemento].slides.length - 1) sel.slide = 0;
      if(sel.elemento > el.length -1) sel.elemento = 0;
      return {...state, selecionado: sel};
    case "offset-selecao":  
      sel = {...selecionadoOffset(state.elementos, state.selecionado, action.offset, autorizacaoEditar(state.apresentacao.autorizacao) ? undefined : true)};
      return {...state, selecionado: sel, elementos: el};
    case 'definir-modo-apresentacao':
      var novoModo = action.modoApresentacao || !state.modoApresentacao;
      toggleFullscreen(novoModo ? document.getElementById('borda-slide-mestre') : null);
      novoModo
        ? hotkeys.setScope('apresentacao')
        : hotkeys.setScope('app')
      return {...state, modoApresentacao: novoModo};
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
    popupConfirmacao: null,
    notificacoes: [],
    itensTutorial: [],
    tutoriaisFeitos: [],
    searchAtivo: false,
    contadorPropaganda: 0,
    propagandaAtiva: false
  }

  const limiteUndo = 50;
  
  return function (state = initialState, action) {
    var { past, present, future, previousTemp, usuario, notificacoes, tutoriaisFeitos, itensTutorial, searchAtivo, contadorPropaganda, propagandaAtiva } = state;
    var notificacoesAtualizado = getNotificacoes(notificacoes, getConteudoNotificacao(action));
    var newPresent;
    var novosItensTutorial = [];
    var slidesPadrao = [];
    if(propagandaAtiva) {
      if(action.type === 'desativar-propaganda') {        
        return {...state, propagandaAtiva: false};
      } else {
        return state;
      }
    }
    switch (action.type) {
      case 'login':
        var feitos = action.usuario.tutoriaisFeitos || [];
        novosItensTutorial = itensTutorial.filter(n => !feitos.includes(n))
        return {...state, usuario: action.usuario, tutoriaisFeitos: feitos, itensTutorial: novosItensTutorial};
      case 'toggle-search':
        return {...state, searchAtivo: !searchAtivo};
      case 'ativar-popup-confirmacao':
        return {...state, popupConfirmacao: action.popupConfirmacao};
      case 'definir-item-tutorial':
        var tutoriais = [...new Set([...tutoriaisFeitos, ...itensTutorial].filter(t => !!t))];
        if (!action.zerar) {
          novosItensTutorial = [...itensTutorial];
          var tutorialNovo = tutoriais.includes(action.itemTutorial) ? null : action.itemTutorial;
          if (tutorialNovo) novosItensTutorial.push(tutorialNovo);
        }
        atualizarDadosUsuario(usuario.uid, {tutoriaisFeitos: tutoriais});
        return {...state, itensTutorial: novosItensTutorial, tutoriaisFeitos: tutoriais}
      case 'bloquear-tutoriais':
        atualizarDadosUsuario(usuario.uid, { tutoriaisFeitos: keysTutoriais });
        return {...state, itensTutorial: [], tutoriaisFeitos: [...keysTutoriais]}
      case 'adicionar-slide-padrao':
        slidesPadrao = [...usuario.slidesPadrao, action.slide];
        atualizarDadosUsuario(usuario.uid, {slidesPadrao: slidesPadrao});
        return {...state, usuario: {...usuario, slidesPadrao: slidesPadrao}};
      case 'excluir-slide-padrao':
        slidesPadrao = usuario.slidesPadrao.splice(action.indiceSlide, 1);
        atualizarDadosUsuario(usuario.uid, {slidesPadrao: slidesPadrao});
        return {...state, usuario: {...usuario, slidesPadrao: slidesPadrao}};
      case 'UNDO':
        if (past.length === 0) return state;
        const previous = past[past.length - 1];
        const newPast = past.slice(Math.max(0, past.length-limiteUndo), past.length - 1);
        atualizarApresentacaoBD (present, previous, action.type);
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
        atualizarApresentacaoBD (present, next, action.type);
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
        newPresent = action.reverter ? present : reducer(deepSpreadPresente(present), {...action, type: 'editar-slide'}, usuario)
        return {...state, slidePreview: getSlidePreview(newPresent)};
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
        atualizarApresentacaoBD (present, newPresent, action.type, mudanca);
        if (past.length - contadorPropaganda*numeroAcoesPropaganda >= numeroAcoesPropaganda) {
          contadorPropaganda++;
          propagandaAtiva = true;
        }
        return {
          ...state,
          past: [...past],
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

const atualizarDadosUsuario = (idUsuario, dados) => {
  if (idUsuario)
    atualizarRegistro(dados, 'usuários', idUsuario);
}

function atualizarApresentacaoBD (present, newPresent, acao, mudanca = null) {
  if (!mudanca) mudanca = houveMudanca(present, newPresent);
  if ((mudanca.includes('elementos') || mudanca.includes('ratio')) && !mudanca.includes('apresentacao') && newPresent.apresentacao.id) {
    atualizarApresentacao(newPresent.elementos, newPresent.ratio, newPresent.apresentacao.id);
  } 
}

function houveMudanca(estado1, estado2) {
  const keysRelevantes = ['elementos', 'popupAdicionar', 'apresentacao', 'ratio'];
  var retorno = [];
  for (var k of keysRelevantes) {
    if (JSON.stringify(estado1[k]) !== JSON.stringify(estado2[k]))
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
    elementos.push({...e, slides: slides});
  }
  return {...present, elementos: elementos, selecionado: selecionado, abaAtiva: abaAtiva, popupAdicionar: popupAdicionar, apresentacao: apresentacao, ratio: ratio};
}

export let store = createStore(undoable(reducerElementos), /* preloadedState, */
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

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