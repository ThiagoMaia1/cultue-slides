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
//   ✔️ getEstiloPadrao pegar do padrão do usuário.
//   ✔️ Logo do vagalume não está clicável.
//   ✔️ Fade do tutorial duas vezes
//   ✔️ Configuração do tutorial ao dar sign out/zerar apresentação
//   ✔️ Borda na tela cheia está arredondada
//   ✔️ Gradiente das notificações por cima das coisas
//   ✔️ Criar nova apresentação não funciona lá em cima e no atalho
//   ✔️ Incluir webfonts na combo de fontes disponíveis.
//   ✔️ Fontes que não suportam números superscritos.
//   ✔️ Html descaracterizado ao enviar em anexo no e-mail.
//   ✔️ Definir callback meio e formato no menu exportação inconsistente.
//   ✔️ Envio da apresentação para o BD quando o estilo é limpado.
//   ✔️ Largura e altura auto no menu exportação.
//   ✔️ Nova apresentação sair da tela de download.
//   ✔️ Carrossel com espaço extra que desconfigura tudo.
//   ✔️ Mudar regras margem galeria de fundos
//   ✔️ Carrossel às vezes não funciona no "Arrastar".
//   ✔️ Posição dos tutoriais
//   ✔️ Redividir slides ao mudar fonte
//   ✔️ Diferença topleft no fundo 3D ou mudar estilo por completo.
//   ✔️ Update firestore está dando undefined
//   ✔️ Clonar estilo não está funcionando
//   ✔️ Posição do preview ao alterar ratio.
//   ✔️ Atalho avançar tutorial com setas
//   ✔️ 'Arraste uma imagem, ou clique para selecionar o arquivo.' não está clicável.
//   ✔️ Definir padrão incluir ratio.
//   ✔️ Exportação HTML às vezes sem css
//   ✔️ Excluir imagem do input.
//   ✔️ Barra de pesquisa está com muitos erros (editando todas as estrofes de todos os slides).
//   ✔️ Carrossel do Input Imagem não vai até o final.*/
// Errinhos:
//   Redividir quando o texto de um slide é todo deletado.
//   Problemas ao dividir texto em duas colunas
//   Edição do conteúdo do parágrafo dando muitos erros (falha ao perder foco, não exibe cursor).
//   Ao abrir app, slide 1 é selecionado e perde o tampao.
//   Realçar apenas 1 resultado ao pesquisar.
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
//   ✔️ Gerar link compartilhável.
//   ✔️ Pesquisa no conteúdo dos slides.
//   ✔️ Navegação pelas setas causar rolagem na lista de slides.
//   ✔️ Tela de propagandas
//   ✔️ Criar texto livre padrão personalizado
//   ✔️ Selecionar resolução personalizada.
//   ✔️ Exportar como Power Point.*/
//   Tela perfil do usuário: informações básicas, predefinições, assinatura. 
//   Enviar por e-mail.
//   Shenanigans de segunda tela.
//   Editar tamanho da imagem direto no preview.
//   Exportação de slides de imagem
//   Melhorar pesquisa de letra de música usando google.
//   Persistir redux
//   Incluir fontes como base64.
//   Nomear apresentacao
//   Recuperar senha
//   E-mails não caírem no spam.
//   Pedir cadastro ao tentar enviar e-mail.

/*/ Features não necessários:
//   Exportar como PDF.
//   Incorporar vídeos do youtube.
//   Criar slides a partir de lista com separador.
//   Combo de número de capítulos e versículos da bíblia.
//   ColorPicker personalizado.
//   Adicionar logo da igreja (upload ou a partir de lista de logos famosas de denominações).
//   Favoritar músicas, fundos...
//   Otimizar mobile
//   Reutilizar links de compartilhamento.
//   Indicar que há estilização nos slides/elementos.*/
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
import { atualizarApresentacao, getApresentacaoPadrao, definirApresentacaoAtiva, zerarApresentacao, autorizacaoEditar, ratioPadrao } from './firestore/apresentacoesBD';
import { atualizarRegistro, slidesPadraoDefault } from './firestore/apiFirestore';
import { keysTutoriais } from './Components/Tutorial/Tutorial';

const tipos = Object.keys(tiposElemento);

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

const autorizacaoPadrao = 'editar';
const numeroAcoesPropaganda = 20;

var defaultList = {...getApresentacaoPadrao(), 
  abaAtiva: 'texto',
  popupAdicionar: {},
  apresentacao: {id: 0, zerada: true, autorizacao: autorizacaoPadrao},
  ratio: {...ratioPadrao}
};

export const reducerElementos = function (state = defaultList, action) {

  var el = [...state.elementos];
  var sel = action.selecionado || state.selecionado;
  var e;
  var notificacao;
  var dadosMensagem;
  delete state.notificacao;
  switch (action.type) {
    case 'definir-apresentacao-ativa':
      var autorizacao = action.apresentacao.autorizacao || autorizacaoPadrao;
      action.apresentacao.autorizacao = autorizacao;
      sel = selecionadoOffset(action.elementos, getApresentacaoPadrao().selecionado, 0, !autorizacaoEditar(autorizacao));
      return {...state, apresentacao: action.apresentacao, elementos: action.elementos, ratio: action.ratio, selecionado: sel};
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
      if (action.redividir) el = redividirSlides(el, sel, state.ratio);
      return {...state, elementos: [...el], selecionado: sel};
    }
    case "limpar-estilo": {
      dadosMensagem = getDadosMensagem(el[sel.elemento]);
      const limparEstiloSlide = s => s.estilo = JSON.parse(JSON.stringify(new Estilo()));
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
      return {...state, selecionado: sel};
    case "offset-selecao":  
      sel = {...selecionadoOffset(state.elementos, state.selecionado, action.offset, autorizacaoEditar(state.apresentacao.autorizacao) ? undefined : true)};
      return {...state, selecionado: sel, elementos: el};
    default:
      return state;
  }
};

const usuarioAnonimo = {uid: 0, slidesPadrao: slidesPadraoDefault};
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
      case 'logout':
        return {...state, usuario: usuarioAnonimo}
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
          if(mudanca.includes('elementos') || mudanca.includes('ratio')) {
            newPresent.apresentacao = {...newPresent.apresentacao, zerada: false}
            if(usuario.uid && !newPresent.apresentacao.id)
              definirApresentacaoAtiva(usuario, newPresent.apresentacao, newPresent.elementos, newPresent.ratio);
          }
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

const atalhosAdicionar = {ctrlm: 0, ctrlb: 1, ctrll: 2, ctrli: 3, ctrld: 4};

hotkeys('right,left,up,down,ctrl+z,ctrl+shift+z,ctrl+y,ctrl+o,ctrl+m,ctrl+i,ctrl+b,ctrl+l,ctrl+d,ctrl+f', function(event, handler){
  event.preventDefault();
  var offset = 0;
  if (store.getState().itensTutorial.length) return;
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
      case 'ctrl+f':
        store.dispatch({type: 'toggle-search'});
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