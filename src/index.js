// //Falta fazer:
// Básico:
//   Corrigir fundo do pop-up nas previews de música e texto bíblico.
//   ✔️ Corrigir reordenamento. 
//   Concluir cálculo de linhas do slide.
//   Permitir formatação de fontes, margens, estilo de texto.

// Features:
//   Permitir envio de imagens.
//   Permitir incorporar vídeos do youtube.
//   Login para salvar preferências.
//   Exportar como power point/pdf.
//   Permitir editar texto direto no slide.
//   Combo de número de capítulos e versículos da bíblia.

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { createStore } from 'redux';
import hotkeys from 'hotkeys-js';
import { fonteBase } from './Components/Preview/Preview'; //em vh.

const estiloPadrao = {
  texto: {color: 'black', fontFamily: 'Helvetica'}, 
  titulo: {fontSize: '3'}, 
  paragrafo: {fontSize: '1.5', padding: '0.1', lineHeight: '1.7'}, 
  fundo: './Galeria/Fundos/Aquarela.jpg', 
  tampao: {backgroundColor: '#000', opacity: '0.2'}
};
const proporcaoPadTop = 0.25;
const slideMestre = 'slide-mestre'
var storeInitialized;

export class Element {
  constructor(tipo, titulo, texto = [], estilo = {}) {
    this.tipo = tipo;
    this.titulo = titulo;
    
    this.estiloNull = {texto: {}, titulo: {}, paragrafo: {}, fundo: null, tampao: {}};
    var est = {...this.estiloNull, ...estilo};
    this.slides = [{estilo: {...est}}];
    this.criarSlides(texto, est);
    
  }

  criarSlides(texto, estilo, nSlide = 0) {
    this.divisoesTexto(texto, nSlide);
    if (this.slides.length > 1 && this.slides[0].texto !== slideMestre) {
      this.slides.unshift({estilo: {...estilo}, texto: slideMestre});
      this.slides[1].estilo = {...this.estiloNull};
    } 
  }

  divisoesTexto(texto, nSlide) { //Divide o texto a ser incluído em quantos slides forem necessários, mantendo a estilização de cada slide.
    if (nSlide === this.slides.length) {
      this.slides.push({estilo: this.estiloNull, texto: ''});
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
    
    var pad = Number(estP.padding)
    var larguraLinha = window.screen.width*(1-pad*2)*0.5;
    var alturaLinha = Number(estP.lineHeight)*Number(estP.fontSize)*window.innerHeight*fonteBase.numero/100; 
    var nLinhas = window.screen.height*0.5*(0.8-pad*(1 + proporcaoPadTop))/alturaLinha;
    if (nLinhas % 1 > 0.7) {
      nLinhas = Math.ceil(nLinhas);
    } else {
      nLinhas = Math.floor(nLinhas);
    }

    console.log('pad: ' + pad + ' larguraLinha: ' + larguraLinha + ' alturaLinha: ' + alturaLinha + ' nLinhas: ' + nLinhas)
    
    var estiloFonte = estP.fontSize*fonteBase.numero + fonteBase.unidade + ' ' + estT.fontFamily;
    var divisor = '\n\n';
    if (this.tipo === 'Bíblia') divisor = ' ';
    var linhas = [''];
    
    for (var i = 0; i < texto.length; i++) {
      var palavras = texto[i].split(' ');
      for (var k = 0; k < palavras.length; k++) {
        linhas[linhas.length-1] = linhas[linhas.length-1] + ' ' + palavras[k];
        var proximaPalavra = (k+1 === palavras.length ? (i+1 === texto.length ? '' : texto[i+1].split(' ')[0]) : palavras[k+1]);
        if (getTextWidth(linhas[linhas.length-1] + ' ' + proximaPalavra, estiloFonte) > larguraLinha) {
          linhas.push('');
        }    
      }
      if (linhas.length+1 === nLinhas || proximaPalavra === '' || 
         (linhas.join('') !== '' && //Se próximo versículo (exceto sozinho) vai ultrapassar o slide, conclui slide atual.
         (Math.ceil(getTextWidth(linhas[linhas.length-1] + (texto[i+1] || ''), estiloFonte) + 50)/larguraLinha) > nLinhas - (linhas.length-2))) {
          var textoSlide = linhas.join(' ');
          this.slides[nSlide].texto = textoSlide;
          if (proximaPalavra !== '') this.divisoesTexto(texto.filter((t, index) => index > i), nSlide+1);
          return;
      }
    }
  }

  // divisoesTexto(texto, est) { //Retorna um array com os blocos de texto que devem ser divididos para cada slide.
  //   var estP = {...estiloPadrao.paragrafo, ...est.paragrafo};
  //   var pad = Number(estP.padding)
  //   var larguraLinha = window.screen.width*(1-pad*2)*0.5;
  //   var alturaLinha = Number(estP.lineHeight)*Number(estP.fontSize)*window.innerHeight*fonteBase.numero/100; 
  //   var nLinhas = window.screen.height*0.5*(0.8-pad*(1 + proporcaoPadTop))/alturaLinha;
  //   if (nLinhas.rest % 1 > 0.7) {
  //     nLinhas = Math.ceil(nLinhas);
  //   } else {
  //     nLinhas = Math.floor(nLinhas);
  //   }
  //   console.log('pad: ' + pad + ' larguraLinha: ' + larguraLinha + ' alturaLinha: ' + alturaLinha + ' nLinhas: ' + nLinhas)
  //   var estiloFonte = estP.fontSize*fonteBase.numero + fonteBase.unidade + ' ' + est.texto.fontFamily;
  //   var textoDividido = [];
  //   var divisor = '\n\n';
  //   var linhas = [];
  //   if (this.tipo === 'Bíblia') divisor = ' ';
  //   for (var i = 0; i < texto.length; i++) {
  //     var palavras = texto[i].split(' ');
  //     for (var k = 0; k < palavras.length; k++) {
  //       linhas[linhas.length-1] = linhas[linhas.length-1] + ' ' + palavras[k];
  //       var proximaPalavra = (k+1 === palavras.length ? (i+1 === texto.length ? '' : texto[i+1].split(' ')[0]) : palavras[k+1]);
  //       if (linhas.length === 0 || getTextWidth(linhas[linhas.length-1] + ' ' + proximaPalavra, estiloFonte) > larguraLinha) {
  //         linhas.push('');
  //       }    
  //     }
  //     if (linhas.length+1 === nLinhas || proximaPalavra === '' || 
  //        (linhas.length !== 0 && //Se próximo versículo (exceto sozinho) vai ultrapassar o slide, conclui slide atual.
  //        (Math.ceil(getTextWidth(linhas[linhas.length-1] + (texto[i+1] || ''), estiloFonte) + 50)/larguraLinha) > nLinhas - (linhas.length-1))) {
  //       textoDividido.push(linhas.join(' '));
  //       linhas = [];
  //     }
  //   }
  //   console.log(textoDividido);
  //   return textoDividido;
  // }

}

function getTextWidth(texto, fontSize) {
  var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
  var context = canvas.getContext("2d");
  context.font = fontSize;
  var metrics = context.measureText(texto);
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
  switch (action.type) {
    case "inserir":
      nState = {elementos: [...state.elementos, action.elemento], selecionado: {elemento: state.elementos.length, slide: 0}};
      return {...nState, slidePreview: getSlidePreview(nState)};
    case "deletar":
      return {elementos: state.elementos.filter(el => (el.id !== action.elemento.id)), selecionado: state.selecionado, slidePreview: state.slidePreview};
    case "reordenar":
      nState = {elementos: action.novaOrdemElementos, selecionado: action.novaSelecao};
      return {...nState, slidePreview: getSlidePreview(nState)};  
    case "atualizar-estilo": {
      var el = [...state.elementos];
      var obj = el[state.selecionado.elemento].slides[state.selecionado.slide].estilo;
      obj[action.objeto] = action.valor instanceof Object ? {...obj[action.objeto], ...action.valor} : action.valor;
      nState = {elementos: el, selecionado: state.selecionado}; //Para que o getSlidePreview use os valores já atualizados.
      return {...nState, slidePreview: getSlidePreview(nState)};
    }
    case "definir-selecao":
      nState = {elementos: state.elementos, selecionado: action.novaSelecao};
      return {...nState, slidePreview: getSlidePreview(nState)};
    case "offset-selecao":
      var elem = state.elementos.flatMap((e, i) => { 
        return e.slides.map((s, j) => ({elemento: i, slide: j})); //Gera um array ordenado com todos os slides que existem representados por objetos do tipo "selecionado".
      })
      for (var i = 0; i < elem.length; i++) { //Acha o selecionado atual.
        if (elem[i].elemento === state.selecionado.elemento && elem[i].slide === state.selecionado.slide) {
          var novoIndex = i + action.offset;
          if (novoIndex < 0) {
            novoIndex = 0;
          } else if (novoIndex >= elem.length) { 
            novoIndex = elem.length-1;
          }
          break;
        }
      }
      nState = {elementos: state.elementos, selecionado: {...elem[novoIndex]}};
      return {...nState, slidePreview: getSlidePreview(nState)};
    default:
      return state;
  }
};

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