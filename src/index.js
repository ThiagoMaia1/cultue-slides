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
//    (Não consegui reproduzir) 'Null' no título do slide em alguns casos (e.g. múltiplas referências)
//    Redivisão de slides duplicando versículos quando a letra fica muito grande.
//    ✔️ Realce se mantém no modo de apresentação.
//    ✔️ Marcação de clicados no Negrito e afins.
//    Limpar variáveis action no reducer.
//    ✔️ Imagem ficando fixa apenas no hover.
//    Zerar sliders ao limpar formatação.
//
// Features:
//   Envio de imagens.
//   Incorporar vídeos do youtube.
//   Login para salvar preferências.
//   Exportar como power point/pdf.
//   Editar texto direto no slide.
//   Combo de número de capítulos e versículos da bíblia.
//   Possibilidade de editar elemento (retornando à tela da query).
//   ✔️ Navegar slides clicando à direita ou esquerda.
//   Marcador de repetições de estrofes nos slides de música/slide de refrão repetido.

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { createStore } from 'redux';
import hotkeys from 'hotkeys-js';
import { fonteBase } from './Components/Preview/Preview';

export class Estilo {
  constructor () {
    this.texto = {}; 
    this.titulo = {}; 
    this.paragrafo = {}; 
    this.fundo = null; 
    this.tampao = {};
  }
}

const estiloPadrao = {
  texto: {fontFamily: fonteBase.fontFamily}, 
  titulo: {fontSize: '3', height: '0.25', padding: '0.08'}, 
  paragrafo: {fontSize: '1.5', padding: '0.08', lineHeight: '1.7'}, 
  fundo: './Galeria/Fundos/Aquarela.jpg', 
  tampao: {backgroundColor: '#fff', opacity: '0.2'}
};
const proporcaoPadTop = 0;
const textoMestre = 'As configurações do estilo desse slide serão aplicadas aos demais, exceto quando configurações específicas de cada slide se sobrepuserem as deste. \n\n Este slide não será exibido no modo de apresentação.'
var storeInitialized;

export class Element {
  constructor(tipo, titulo, texto = [], estilo = {}, eMestre = false) {
    this.tipo = tipo;
    this.titulo = titulo;
    this.texto = texto;
    
    var est = {...new Estilo(), ...estilo};
    this.slides = [{estilo: {...est}}];
    this.eMestre = eMestre;
    this.criarSlides(this.texto, est);
  }

  criarSlides = (texto, estiloMestre, nSlide = 0, estGlobal = null) => {
    if (this.slides[nSlide].eMestre) nSlide++;
    this.dividirTexto(texto, nSlide, estGlobal);
    if (this.slides.length > 1 && !this.slides[0].eMestre) {
      this.slides.unshift({estilo: {...estiloMestre}, texto: textoMestre, eMestre: true});
      this.slides[1].estilo = {...new Estilo()};
    } else if (this.slides.length === 2 && this.slides[0].texto.eMestre) {
      this.slides[1].estilo = this.slides[0].estilo;
      this.slides.shift();
    }
  }

  dividirTexto = (texto, nSlide, estGlobal = null) => {//Divide o texto a ser incluído em quantos slides forem necessários, mantendo a estilização de cada slide.
    
    if (nSlide === this.slides.length) {
      this.slides.push({estilo: {...new Estilo()}, texto: ''});
    } else if (nSlide > this.slides.length) {
      console.log('Tentativa de criar slide além do limite: ' + nSlide);
      return;
    }
    var slide = this.slides[nSlide];  
    if (nSlide === 0) slide.eMestre = this.eMestre; 

    var estSlide = slide.estilo;
    var estElemento;
    if (!storeInitialized) {
      [ estGlobal, estElemento ] = [ {...estiloPadrao}, {...estiloPadrao} ]
    } else {
      estElemento = this.slides[0].estilo;
      if (!estGlobal)
        estGlobal = store.getState().elementos[0].slides[0].estilo;
    }
    
    var estP = {...estGlobal.paragrafo, ...estElemento.paragrafo , ...estSlide.paragrafo};
    var estT = {...estGlobal.texto, ...estElemento.texto, ...estSlide.texto};
    var estTitulo = {...estGlobal.titulo, ...estElemento.titulo, ...estSlide.titulo};
    
    var pad = Number(estP.padding) // Variáveis relacionadas ao tamanho do slide.
    var larguraLinha = window.screen.width*(1-pad*2);
    var alturaLinha = Number(estP.lineHeight)*Number(estP.fontSize)*fonteBase.numero; 
    var alturaParagrafo = window.screen.height*(1-Number(estTitulo.height)-pad*(1 + proporcaoPadTop));
    var nLinhas = alturaParagrafo/alturaLinha;
    if (nLinhas % 1 > 0.7) {
      nLinhas = Math.ceil(nLinhas);
    } else {
      nLinhas = Math.floor(nLinhas);
    }

    var estiloFonte = [(estT.fontStyle || ''), (estT.fontWeight || ''), estP.fontSize*fonteBase.numero + fonteBase.unidade, estT.fontFamily];
    estiloFonte = estiloFonte.filter(a => a !== '').join(' ');
    var caseTexto = estT.caseTexto || estP.caseTexto;
    var linhas = [''];
    
    for (var i = 0; i < texto.length; i++) {
      var palavras = texto[i].split(/(?=\n)|(?<=\n)| +/);
      for (var k = 0; k < palavras.length; k++) {
        if (linhas.join('') === '' && palavras[k] === '\n') continue; //Se é a primeira linha não precisa de line break antes.
        linhas[linhas.length-1] = linhas[linhas.length-1] + (linhas[linhas.length-1] === '' ? '' : ' ') + palavras[k];
        var proximaPalavra = (k+1 === palavras.length ? (i+1 === texto.length ? '' : texto[i+1].replace('\n', '\n ').split(/ +/)[0]) : palavras[k+1]);
        if (getTextWidth(linhas[linhas.length-1], proximaPalavra, estiloFonte, larguraLinha, caseTexto) > larguraLinha) {
          linhas.push('');
        }    
      }
      if (linhas.length+1 >= nLinhas || proximaPalavra === '' || 
         (linhas.join('') !== '' && //Se próximo versículo (exceto sozinho) vai ultrapassar o slide, conclui slide atual.
         (Math.ceil(getTextWidth(linhas[linhas.length-1], (texto[i+1] || ''), estiloFonte, larguraLinha, caseTexto) + 50)/larguraLinha) > nLinhas - (linhas.length-1))) {
          var textoSlide = linhas.join(' ').replace(/\n /g,'\n');
          this.slides[nSlide].texto = textoSlide;
          this.slides[nSlide].textoArray = texto.slice(0, i+1);
          if (proximaPalavra !== '') this.dividirTexto(texto.slice(i+1), nSlide+1, estGlobal);
          return;
      }
    }
  }

  getArrayTexto = (nSlide = 0) => {
    if (this.slides[nSlide].eMestre) nSlide++;
    var arrayTexto = [];
    while (nSlide < this.slides.length) {
      arrayTexto.push(this.slides[nSlide].textoArray);
      nSlide++;
    }
    return arrayTexto.flat();
  }

  higienizarEstilo(nSlide = 0) {
    var slidesAHigienizar = nSlide === 0 ? this.slides : this.slides[nSlide];
    for (let s of slidesAHigienizar) {
      for (let [ , obj] of Object.entries(s.estilo)) {
        if (JSON.stringify(obj) === '{}' || typeof obj === 'string') continue;
        for (let [atributo, valor] of Object.entries(obj)) {
          if (valor === null || valor === undefined || valor === '') {
            delete obj[atributo];
          } 
        }
      }
    }
  }

}

function getTextWidth(texto, proximaPalavra, fontSize, larguraLinha, caseTexto) {
  var enes = proximaPalavra.split('\n').length-1;
  if (enes > 0) return enes*(larguraLinha + 1);
  var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
  var context = canvas.getContext("2d");
  context.font = fontSize;
  var txt = capitalize(texto.replace('\n',' ') + ' ' + proximaPalavra, caseTexto)
  var metrics = context.measureText(txt);
  return metrics.width-3; //-3 porque parece que existe uma pequena tolerância.
}

const defaultList = {elementos: [
  new Element("Slide-Mestre", "Slide-Mestre", [textoMestre], estiloPadrao, true),
  new Element("Título","Exemplo",["Esta é uma apresentação de exemplo."]),
  new Element('Texto-Bíblico',"João 1:1-3", ['João 1']),
  new Element("Música","Jesus em Tua Presença",["Jesus em tua presença..."]),
  new Element("Imagem","Aquarela",["./Fundos/Aquarela.jpg"])],
  selecionado: {elemento: 0, slide: 0}, 
  slidePreview: {selecionado: {elemento: 0, slide: 0}, texto: textoMestre, titulo: 'Slide-Mestre', 
                 estilo: {...estiloPadrao, paragrafo: getEstiloPad(estiloPadrao.paragrafo, 'paragrafo'), titulo: getEstiloPad(estiloPadrao.paragrafo, 'titulo')}},
  realce: {aba: '', cor: ''}
}

export const reducerElementos = function (state = defaultList, action) {

  storeInitialized = true;
  var nState;
  var el;
  var sel;
  switch (action.type) {
    case "inserir":
      nState = {elementos: [...state.elementos, action.elemento], selecionado: {elemento: state.elementos.length, slide: 0}};
      return {...nState, slidePreview: getSlidePreview(nState), realce: state.realce};
    case "deletar":
      el = [...state.elementos];
      el.splice(Number(action.elemento), 1);
      var novaSelecao = {elemento: state.selecionado.elemento, slide: 0};
      if (state.selecionado.elemento >= el.length) novaSelecao.elemento = state.selecionado.elemento-1 
      nState = {elementos: el, selecionado: {...novaSelecao}};
      return {...nState, slidePreview: getSlidePreview(nState), realce: state.realce};
    case "reordenar":
      nState = {elementos: action.novaOrdemElementos, selecionado: action.novaSelecao};
      return {...nState, slidePreview: getSlidePreview(nState), realce: state.realce};  
    case "atualizar-estilo": {
      sel = action.selecionado || state.selecionado;
      el = [...state.elementos];
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
      el = [...state.elementos];
      sel = action.selecionado;
      if (sel.elemento === 0 && sel.slide === 0) {
        if (action.objeto) {
          el[0].slides[0].estilo[action.objeto] = estiloPadrao[action.objeto];
        } else {
          var f = el[sel.elemento].slides[sel.slide].estilo.fundo
          el[sel.elemento].slides[sel.slide].estilo = {...estiloPadrao, fundo: f};
        }  
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
      nState = {elementos: state.elementos, selecionado: action.novaSelecao};
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

  return {selecionado: {...sel},
    texto: capitalize(slide.texto, estiloParagrafo.caseTexto),
    titulo: capitalize(state.elementos[sel.elemento].titulo, estiloTitulo.caseTexto),
    eMestre: slide.eMestre,
    estilo: {
      titulo: {...estiloTitulo, ...getEstiloPad(estiloTitulo, 'titulo'), fontSize: estiloTitulo.fontSize*100 + '%', height: estiloTitulo.height*100 + '%'},
      paragrafo: {...getEstiloPad(estiloParagrafo, 'paragrafo'), fontSize: estiloParagrafo.fontSize*100 + '%'},
      fundo: slide.estilo.fundo || elemento.estilo.fundo || global.estilo.fundo, 
      tampao: {...global.estilo.tampao, ...elemento.estilo.tampao, ...slide.estilo.tampao},
      texto: {...estiloTexto}
    }
  };
}

function capitalize (string, caseTexto) {

  const primeiraMaiuscula = string => {
    if (typeof string !== 'string') return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  switch (caseTexto) {
    case 'Maiúsculas':
      return string.toUpperCase();
    case 'Minúsculas':
      return string.toLowerCase();
    case 'Primeira Maiúscula':
      return primeiraMaiuscula(string);
    default:
      return string;
  }
}

function getEstiloPad (estilo, objeto) {
  var pad = estilo.padding*100; //Separa o padding para o padding-top ser diferente, proporcional à constante proporcaoPadTop.
  var proporcao;
  var rep;
  if (objeto === 'titulo') {
    proporcao = 0;
    rep = 1;
  } else {
    proporcao = proporcaoPadTop;
    rep = 3;
  }
  return {...estilo, padding: String(pad*proporcao).substr(0, 5) + ('% ' + pad).repeat(rep) + '%'};
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