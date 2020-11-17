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
//   ✔️ Tamanho botão tela cheia.
//   ✔️ Pesquisa de letra de música não funciona na produção.
//   ✔️ Carrossel do Input Imagem não vai até o final.*/
// Errinhos:
//   Incluir webfonts na combo de fontes disponíveis.
//   Fontes que não suportam números superscritos.
//   Redividir quando o texto de um slide é todo deletado.
//   Duas colunas
//   Indicar que há estilização nos slides/elementos.
//   getEstiloPadrao pegar do padrão do usuário.
//   Logo do vagalume não está clicável.
//   Html descaracterizado ao enviar em anexo no e-mail.
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
//   ✔️ Atalho para nova apresentação.
//   ✔️ Tela perfil do usuário: apresentações passadas, e-mails salvos. 
//   ✔️ Cards de notificação
//   ✔️ Gif splash.
//   ✔️ Exportar como Power Point.*/
//   Tela perfil do usuário: informações básicas, predefinições. 
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
//   Persistir redux
//
// Negócio:
//   ✔️ Criar logo.
//   Cadastrar google ads.
//   Buscar parceria com ultimato.
//   Comprar domínio.
//   Configurar site para ser encontrado pelo google.
//   Pedir amigos para compartilharem.

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Home from './Home';
import { createStore } from 'redux';
import hotkeys from 'hotkeys-js';
import { getEstiloPadrao, Estilo, getPadding, tiposElemento, getDadosMensagem } from './Element.js';
import { selecionadoOffset, getSlidePreview } from './Components/MenuExportacao/Exportador';
import { atualizarApresentacao, getApresentacaoPadrao, definirApresentacaoAtiva, zerarApresentacao } from './firestore/apresentacoesBD';

const tipos = Object.keys(tiposElemento);

export const urlSite = 'https://slidesigreja-ff51f.web.app/';

var defaultList = {...getApresentacaoPadrao(), 
  abaAtiva: 'texto',
  popupAdicionar: {},
  apresentacao: {id: 0, zerada: true}
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
  var notificacao;
  var dadosMensagem;
  delete state.notificacao;
  switch (action.type) {
    case 'definir-apresentacao-ativa':
        return {...state, apresentacao: action.apresentacao, elementos: action.elementos};
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
      return {...state, elementos: [...el], selecionado: sel};
    }
    case "limpar-estilo": {
      dadosMensagem = getDadosMensagem(el[sel.elemento]);
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
        notificacao = 'Estilo de Toda a Apresentação Limpo'
      } else if (sel.slide === 0) {
        limparEstiloElemento(el[sel.elemento]);
        notificacao = 'Estilo d' + dadosMensagem.genero + ' ' + dadosMensagem.elemento + ' Limp' + dadosMensagem.genero;
      } else {
        limparEstiloSlide(el[sel.elemento].slides[sel.slide]);
        notificacao = 'Estilo do Slide' + sel.slide + ' d' + dadosMensagem.genero + ' ' + dadosMensagem.elementos + '" Limp' + dadosMensagem.genero;
      }
      el = redividirSlides(el, sel);
      return {...state, elementos: [...el], selecionado: action.selecionado, abaAtiva: 'texto', notificacao: notificacao};
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
    popupConfirmacao: null,
    notificacoes: []
  }

  const limiteUndo = 50;
  
  return function (state = initialState, action) {
    var { past, present, future, previousTemp, usuario, notificacoes } = state;
    var notificacoesAtualizado = getNotificacoes(notificacoes, getConteudoNotificacao(action));
    var newPresent;
    switch (action.type) {
      case 'login':
        return {...state, usuario: action.usuario};
      case 'ativar-popup-confirmacao':
        return {...state, popupConfirmacao: action.popupConfirmacao};
      case 'UNDO':
        if (past.length === 0) return state;
        const previous = past[past.length - 1];
        const newPast = past.slice(Math.max(0, past.length-limiteUndo), past.length - 1);
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
        newPresent = reducer(deepSpreadPresente(present), {...action, type: 'editar-slide'})
        return {...state, 
          present: newPresent, 
          previousTemp: previousTemp || deepSpreadPresente(present), 
          slidePreview: getSlidePreview(newPresent)};
      default:
        newPresent = reducer(deepSpreadPresente(present), action);
        notificacoesAtualizado = getNotificacoes(notificacoesAtualizado, newPresent.notificacao);
        if (previousTemp) present = previousTemp;
        var mudanca = houveMudanca(present, newPresent);
        if (mudanca.length > 0) {
          past = [...past, present];
          if(mudanca.includes('elementos')) {
            newPresent.apresentacao = {...newPresent.apresentacao, zerada: false}
            if(usuario.uid && !newPresent.apresentacao.id)
              definirApresentacaoAtiva(usuario, newPresent.apresentacao, newPresent.elementos);
          }
          if (action.type === 'inserir')
          present.popupAdicionar = {...action.popupAdicionar, tipo: action.elemento.tipo};
        } 
        atualizarApresentacaoBD (present, newPresent, mudanca);
        return {
          ...state,
          past: [...past],
          present: newPresent,
          future: [],
          slidePreview: getSlidePreview(newPresent),
          previousTemp: null,
          notificacoes: [...notificacoesAtualizado]
        }
    }
  }
}

function atualizarApresentacaoBD (present, newPresent, mudanca = null) {       
  if (!mudanca) mudanca = houveMudanca(present, newPresent);
  if (mudanca.includes('elementos') && !mudanca.includes('apresentacao') && newPresent.apresentacao.id) {
    atualizarApresentacao(newPresent.elementos, newPresent.apresentacao.id);
  } 
}

function houveMudanca(estado1, estado2) {
  const keysRelevantes = ['elementos', 'popupAdicionar', 'apresentacao'];
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
  return {...present, elementos: elementos, selecionado: selecionado, abaAtiva: abaAtiva, popupAdicionar: popupAdicionar, apresentacao: apresentacao};
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

const atalhosAdicionar = {ctrlm: 0, ctrlb: 1, ctrll: 2, ctrli: 3, ctrld: 4};

hotkeys('right,left,up,down,ctrl+z,ctrl+shift+z,ctrl+y,ctrl+o,ctrl+m,ctrl+i,ctrl+b,ctrl+l,ctrl+d', function(event, handler){
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
      case 'ctrl+o':
        zerarApresentacao(store.getState().usuario);
        break;
      default:
        var atalho = handler.key.replace('+','');
        var tipo = tipos[atalhosAdicionar[atalho]];
        store.dispatch({type: 'ativar-popup-adicionar', popupAdicionar: {tipo: tipo}});
  }
  if (offset !== 0) store.dispatch({type: 'offset-selecao', offset: offset})
});

ReactDOM.render(
  <Home />,
  document.getElementById('root')
);