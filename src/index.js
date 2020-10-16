// //Falta fazer:
// Básico:
//   Corrigir fundo do pop-up nas previews de música e texto bíblico.
//   ✔️ Corrigir reordenamento. 
//   ✔️ Concluir cálculo de linhas do slide.
//   Permitir formatação de fontes, margens, estilo de texto.
//   ✔️ Possibilidade de excluir elementos.

// Features:
//   Permitir envio de imagens.
//   Permitir incorporar vídeos do youtube.
//   Login para salvar preferências.
//   Exportar como power point/pdf.
//   Permitir editar texto direto no slide.
//   Combo de número de capítulos e versículos da bíblia.
//   Possibilidade de editar elemento (retornando à tela da query).

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { createStore } from 'redux';
import hotkeys from 'hotkeys-js';
import { fonteBase } from './Components/Preview/Preview';

class Estilo {
  constructor () {
    this.texto = {}; 
    this.titulo = {}; 
    this.paragrafo = {}; 
    this.fundo = null; 
    this.tampao = {};
  }
}

const estiloPadrao = {
  texto: {color: 'black', fontFamily: 'Helvetica'}, 
  titulo: {fontSize: '3', height: '25%'}, 
  paragrafo: {fontSize: '1.5', padding: '0.08', lineHeight: '1.7'}, 
  fundo: './Galeria/Fundos/Aquarela.jpg', 
  tampao: {backgroundColor: '#fff', opacity: '0.2'}
};
const proporcaoPadTop = 0;
const slideMestre = 'slide-mestre'
var storeInitialized;

export class Element {
  constructor(tipo, titulo, texto = [], estilo = {}) {
    this.tipo = tipo;
    this.titulo = titulo;
    
    var est = {...new Estilo(), ...estilo};
    if (tipo === 'Título') est.titulo.height = '60%';
    this.slides = [{estilo: {...est}}];
    this.criarSlides(texto, est);
    
  }

  criarSlides(texto, estilo, nSlide = 0) {
    this.divisoesTexto(texto, nSlide);
    if (this.slides.length > 1 && this.slides[0].texto !== slideMestre) {
      this.slides.unshift({estilo: {...estilo}, texto: slideMestre});
      this.slides[1].estilo = {...new Estilo()};
    } 
  }

  divisoesTexto(texto, nSlide) {//Divide o texto a ser incluído em quantos slides forem necessários, mantendo a estilização de cada slide.
    if (nSlide === this.slides.length) {
      this.slides.push({estilo: {...new Estilo()}, texto: ''});
    } else if (nSlide > this.slides.length) {
      console.log('Tentativa de criar slide além do limite: ' + nSlide);
      return;
    }
    var slide = this.slides[nSlide];
    
    var estSlide = slide.estilo;
    var estGlobal;
    var estElemento;
    if (!storeInitialized) {
      [ estGlobal, estElemento ] = [ {...estiloPadrao}, {...estiloPadrao} ]
    } else {
      estGlobal = store.getState().elementos[0].slides[0].estilo;
      estElemento = this.slides[0].estilo;
    }
    
    var estP = {...estGlobal.paragrafo, ...estElemento.paragrafo , ...estSlide.paragrafo};
    var estT = {...estGlobal.texto, ...estElemento.texto, ...estSlide.texto};
    var estTitulo = {...estGlobal.titulo, ...estElemento.titulo, ...estSlide.titulo};
    
    var pad = Number(estP.padding) // Variáveis relacionadas ao tamanho do slide.
    var larguraLinha = window.screen.width*(1-pad*2);
    var alturaLinha = Number(estP.lineHeight)*Number(estP.fontSize)*fonteBase.numero; 
    var alturaParagrafo = window.screen.height*(1-(Number(estTitulo.height.replace('%',''))/100)-pad*(1 + proporcaoPadTop));
    var nLinhas = alturaParagrafo/alturaLinha;
    if (nLinhas % 1 > 0.7) {
      nLinhas = Math.ceil(nLinhas);
    } else {
      nLinhas = Math.floor(nLinhas);
    }

    var estiloFonte = estP.fontSize*fonteBase.numero + fonteBase.unidade + ' ' + estT.fontFamily;
    var linhas = [''];
    
    for (var i = 0; i < texto.length; i++) {
      var palavras = texto[i].split(/(?=\n)|(?<=\n)| +/);
      for (var k = 0; k < palavras.length; k++) {
        if (linhas.join('') === '' && palavras[k] === '\n') continue; //Se é a primeira linha não precisa de line break antes.
        linhas[linhas.length-1] = linhas[linhas.length-1] + (linhas[linhas.length-1] === '' ? '' : ' ') + palavras[k];
        var proximaPalavra = (k+1 === palavras.length ? (i+1 === texto.length ? '' : texto[i+1].replace('\n', '\n ').split(/ +/)[0]) : palavras[k+1]);
        if (getTextWidth(linhas[linhas.length-1], proximaPalavra, estiloFonte, larguraLinha) > larguraLinha) {
          linhas.push('');
        }    
      }
      if (linhas.length+1 >= nLinhas || proximaPalavra === '' || 
         (linhas.join('') !== '' && //Se próximo versículo (exceto sozinho) vai ultrapassar o slide, conclui slide atual.
         (Math.ceil(getTextWidth(linhas[linhas.length-1], (texto[i+1] || ''), estiloFonte, larguraLinha) + 50)/larguraLinha) > nLinhas - (linhas.length-1))) {
          var textoSlide = linhas.join(' ').replace(/\n /g,'\n');
          console.log(textoSlide);
          this.slides[nSlide].texto = textoSlide;
          if (proximaPalavra !== '') this.divisoesTexto(texto.slice(i+1), nSlide+1);
          return;
      }
    }
  }
}

function getTextWidth(texto, proximaPalavra, fontSize, larguraLinha) {
  var enes = proximaPalavra.split('\n').length-1;
  if (enes > 0) return enes*(larguraLinha + 1);
  var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
  var context = canvas.getContext("2d");
  context.font = fontSize;
  var metrics = context.measureText(texto.replace('\n',' ') + ' ' + proximaPalavra);
  return metrics.width-3; //-3 porque parece que existe uma pequena tolerância.
}

const textoPadrao = [
  "João 1:1-3 1 No princípio era o Verbo, e o Verbo estava com Deus, e o Verbo ' ' ' ' ' ' era Deus.",
  '2 Ele estava no princípio com Deus.', 
  '3 Todas as coisas foram feitas por intermédio dele, e sem ele nada do que foi feito se fez.'
]

const defaultList = {elementos: [
  new Element("Configurações Globais", 'Título', textoPadrao, estiloPadrao),
  new Element("Título","Exemplo",["Esta é uma apresentação de exemplo."]),
  new Element("Bíblia","João 1:1-3", textoPadrao),
  new Element("Música","Jesus em Tua Presença",["Jesus em tua presença..."]),
  new Element("Imagem","Aquarela",["./Fundos/Aquarela.jpg"])],
  selecionado: {elemento: 0, slide: 0}, 
  slidePreview: {texto: textoPadrao, titulo: 'Título', 
                 estilo: {...estiloPadrao, paragrafo: getEstiloParagrafoPad(estiloPadrao.paragrafo)}}
}

export const reducerElementos = function (state = defaultList, action) {

  storeInitialized = true;
  var nState;
  var el;
  switch (action.type) {
    case "inserir":
      nState = {elementos: [...state.elementos, action.elemento], selecionado: {elemento: state.elementos.length, slide: 0}};
      return {...nState, slidePreview: getSlidePreview(nState)};
    case "deletar":
      el = [...state.elementos]
      el.splice(Number(action.elemento), 1);
      var novaSelecao = {elemento: state.selecionado.elemento, slide: 0};
      if (state.selecionado.elemento >= el.length) novaSelecao.elemento = state.selecionado.elemento-1 
      nState = {elementos: el, selecionado: {...novaSelecao}};
      return {...nState, slidePreview: getSlidePreview(nState)};
    case "reordenar":
      nState = {elementos: action.novaOrdemElementos, selecionado: action.novaSelecao};
      return {...nState, slidePreview: getSlidePreview(nState)};  
    case "atualizar-estilo": {
      el = [...state.elementos];
      var obj = el[state.selecionado.elemento].slides[state.selecionado.slide].estilo;
      obj[action.objeto] = action.valor instanceof Object ? {...obj[action.objeto], ...action.valor} : action.valor;
      nState = {elementos: el, selecionado: state.selecionado}; //Para que o getSlidePreview use os valores já atualizados.
      return {...nState, slidePreview: getSlidePreview(nState)};
    }
    case "definir-selecao":
      nState = {elementos: state.elementos, selecionado: action.novaSelecao};
      return {...nState, slidePreview: getSlidePreview(nState)};
    case "offset-selecao":
      nState = {elementos: state.elementos, selecionado: {...selecionadoOffset(state.elementos, state.selecionado, action.offset)}};
      return {...nState, slidePreview: getSlidePreview(nState)};
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
        novoIndex = 0 + (elem[0].texto === slideMestre ? 1 : 0);
      } else if (novoIndex >= elem.length) { 
        novoIndex = elem.length-1;
      }
      if (elem[novoIndex].texto === slideMestre) { //Se for slide mestre, pula um a mais pra frente ou pra trás com base no offset informado.
        novoIndex += (offset >= 0 ? 1 : -1);
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

  var estiloTexto = {...global.estilo.texto, ...elemento.estilo.texto, ...slide.estilo.texto}
  //Pra dividir o padding-top.
  var estiloParagrafo = {...estiloTexto, ...global.estilo.paragrafo, ...elemento.estilo.paragrafo, ...slide.estilo.paragrafo}
  
  return {texto: slide.texto === slideMestre ? state.elementos[sel.elemento].slides[1].texto : slide.texto, 
    titulo: state.elementos[sel.elemento].titulo,
    estilo: {
      titulo: {...estiloTexto, ...global.estilo.titulo, ...elemento.estilo.titulo, ...slide.estilo.titulo}, 
      paragrafo: getEstiloParagrafoPad(estiloParagrafo), 
      fundo: slide.estilo.fundo || elemento.estilo.fundo || global.estilo.fundo, 
      tampao: {...global.estilo.tampao, ...elemento.estilo.tampao, ...slide.estilo.tampao},
      texto: {...estiloTexto}
    }
  };
}

function getEstiloParagrafoPad (estiloParagrafo) {
  var pad = estiloParagrafo.padding*100; //Separa o padding para o padding-top ser diferente, proporcional à constante proporcaoPadTop.
  return {...estiloParagrafo, padding: String(pad*proporcaoPadTop).substr(0, 5) + ('% ' + pad).repeat(3) + '%'};
}

export let store = createStore(reducerElementos);

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