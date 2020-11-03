import { fonteBase } from './Components/Preview/Preview';

export const textoMestre = 'As configurações do estilo desse slide serão aplicadas aos demais, exceto quando configurações específicas de cada slide se sobrepuserem às deste. \n\nEste slide não será exportado nem exibido no modo de apresentação.'

export class Estilo {
  constructor () {
    this.texto = {}; 
    this.titulo = {}; 
    this.paragrafo = {}; 
    this.fundo = {}; 
    this.tampao = {};
    this.imagem = {};
  }
}
  
const estiloPadrao = {
  texto: {fontFamily: fonteBase.fontFamily}, 
  titulo: {fontSize: 3, height: 0.25, paddingRight: 0.08}, 
  paragrafo: {fontSize: 1.5, paddingRight: 0.08, lineHeight: 1.9}, 
  fundo: {src: './Galeria/Fundos/Aquarela.jpg'}, 
  tampao: {backgroundColor: '#fff', opacity: 0.2},
  imagem: {padding: 0.02}
};

const proporcaoPadTop = 0;

export const getEstiloPadrao = () => {
  var estilo = estiloPadrao;
  estilo.paragrafo = getPadding(estilo, 'paragrafo');
  estilo.titulo = getPadding(estilo, 'titulo');  
  return estilo;
}

export function getPadding (estilo, objeto) {
  var pad = estilo[objeto].paddingRight;
  if (!pad) return {...estilo[objeto]};
  return {...estilo[objeto],
          paddingTop: objeto === 'paragrafo' ? (pad*proporcaoPadTop || 0.005): 0, 
          paddingBottom: objeto === 'paragrafo' ? pad : 0,
          paddingLeft: pad
  };
}

export default class Element {
  
  constructor(tipo, titulo, texto = [], imagens = [], estilo = {}, eMestre = false) {     
    this.tipo = tipo;
    this.titulo = titulo;
    this.texto = texto;
    this.imagens = imagens;
    this.eMestre = eMestre;
    
    var est = {...new Estilo(), ...estilo};
    est = {...est, paragrafo: getPadding(est, 'paragrafo'), titulo: getPadding(est, 'titulo')};
    console.log(est);
    if (this.tipo === 'Texto-Livre' && texto.filter(t => t !== '').length === 0) est.titulo.height = '1';
    this.slides = [{estilo: {...est}, eMestre: true, textoArray: [textoMestre]}];
    this.criarSlides(this.texto, est);
  }

  criarSlides = (texto, estiloMestre, nSlide = 0, estGlobal = null, thisP = this) => {
    
    if (thisP.eMestre) return;
    if (thisP.slides[nSlide].eMestre) nSlide++;
    if (thisP.tipo === 'Imagem') {
      thisP.dividirImagens();
    } else {
      thisP.dividirTexto(texto, nSlide, estiloMestre, estGlobal, thisP);
    }
    if (thisP.slides.length > 1 && !thisP.slides[0].eMestre) {
      thisP.slides.unshift({estilo: {...estiloMestre}, textoArray: [textoMestre], eMestre: true});
      thisP.slides[1].estilo = {...new Estilo()};
    } else if (thisP.slides.length === 2 && thisP.slides[0].eMestre) {
      thisP.slides[1].estilo = thisP.slides[0].estilo;
      thisP.slides.shift();
    }
    return thisP;
  }

  
  getArrayTexto = (nSlide = 0, thisP = this) => {
    if (thisP.slides[nSlide].eMestre) nSlide++;
    var arrayTexto = [];
    while (nSlide < thisP.slides.length) {
      arrayTexto.push(thisP.slides[nSlide].textoArray);
      nSlide++;
    }
    return arrayTexto.flat();
  }

  dividirImagens = (thisP = this) => {
    if (thisP.imagens.length === 1) {
      thisP.slides[0].imagem = thisP.imagens[0];
      thisP.slides[0].eMestre = false;
      thisP.slides[0].textoArray = [];
    } else {
      for (var img of thisP.imagens) {
        thisP.slides.push({estilo: {...new Estilo()}, imagem: img, textoArray: []});
      }
    }
  }

  dividirTexto = (texto, nSlide, estElemento, estGlobal = null, thisP = this) => {
    
    //Divide o texto a ser incluído em quantos slides forem necessários, mantendo a estilização de cada slide.
    if (nSlide === thisP.slides.length) {
      thisP.slides.push({estilo: {...new Estilo()}, textoArray: []});
    } else if (nSlide > thisP.slides.length) {
      console.log('Tentativa de criar slide além do limite: ' + nSlide);
      return;
    }
    var slide = thisP.slides[nSlide];  
    var estSlide = slide.estilo;
    estGlobal = estGlobal ? estGlobal : getEstiloPadrao();
    
    var estP = {...estGlobal.paragrafo, ...estElemento.paragrafo , ...estSlide.paragrafo};
    var estT = {...estGlobal.texto, ...estElemento.texto, ...estSlide.texto};
    var estTitulo = {...estGlobal.titulo, ...estElemento.titulo, ...estSlide.titulo};
    // Variáveis relacionadas ao tamanho do slide.
    var padV = estP.paddingTop + estP.paddingRight; //Right é a base de cálculo, bottom varia.
    var padH = estP.paddingRight + estP.paddingLeft;
    var larguraLinha = window.screen.width*(1-padH);
    var alturaLinha = estP.lineHeight*estP.fontSize*fonteBase.numero;
    var alturaSecaoTitulo = estTitulo.height*window.screen.height;
    var alturaSecaoParagrafo = window.screen.height-alturaSecaoTitulo;
    var alturaParagrafo = alturaSecaoParagrafo*(1-padV);
    var nLinhas = alturaParagrafo/alturaLinha;
  
    if (nLinhas % 1 > 0.7) {
      nLinhas = Math.ceil(nLinhas);
    } else {
      nLinhas = Math.floor(nLinhas);
    }
    slide.estilo.paragrafo.paddingBottom = ((alturaSecaoParagrafo-nLinhas*alturaLinha)/window.screen.width)-estP.paddingTop; 
    
    var duasColunas = false;
    if (estP.duasColunas) {
      larguraLinha = larguraLinha*0.48;
      if (thisP.tipo === 'Música') {
        duasColunas = true;       
      } else {
        nLinhas = nLinhas*2;
      }
    }

    var estiloFonte = [(estT.fontStyle || ''), (estT.fontWeight || ''), estP.fontSize*fonteBase.numero + fonteBase.unidade, "'" + estT.fontFamily + "'"];
    estiloFonte = estiloFonte.filter(a => a !== '').join(' ');
    var caseTexto = estT.caseTexto || estP.caseTexto;
    var separador = thisP.tipo === 'Texto-Bíblico' ? '' : '\n\n';
    if (thisP.tipo === 'Música' && estP.omitirRepeticoes) texto = marcarEstrofesRepetidas(texto);
    console.log(thisP.tipo === 'Música');
    console.log(estP.omitirRepeticoes);
    var { contLinhas, widthResto } = getLinhas(texto[0], estiloFonte, larguraLinha, caseTexto);
    var i;

    for (i = 0; i < texto.length; i++) {
      if (i+1 >= texto.length) {
        thisP.slides = thisP.slides.slice(0, nSlide+1);
        break;
      }
      var linhas = getLinhas(separador + texto[i+1], estiloFonte, larguraLinha, caseTexto, widthResto)
      contLinhas += linhas.contLinhas;
      widthResto = /\n/.test(separador) ? 0 : linhas.widthResto;        
      if ((contLinhas + (widthResto > 0 ? 1 : 0)) > nLinhas) { //Se próximo versículo vai ultrapassar o slide, conclui slide atual.
        if (duasColunas) [ contLinhas, widthResto, duasColunas ] = [ 0, 0, false ]; 
        thisP.dividirTexto(texto.slice(i+1), nSlide+1, estElemento, estGlobal, thisP);
        break;
      }
    }
    thisP.slides[nSlide].textoArray = texto.slice(0, i+1);
  }
}
  
const marcarEstrofesRepetidas = texto => {

  const limparTexto = t => retiraAcentos(t).toLowerCase().replace(/[^a-z]/g,'');

  var textoAjeitado = [...texto];
  for (var j = 0; j < textoAjeitado.length; j++) {
    var separadoPorMultiplicador = textoAjeitado[j].split(/\((?= ?[2-9].{0,15})|(?<=\( ?[2-9]).{0,15}\)| (?=[2-9] ?(?:[xX]|[vV][eE][zZ][eE][sS]))|(?<=[2-9]) ?(?:[xX]|[vV][eE][zZ][eE][sS])/g);
    separadoPorMultiplicador = separadoPorMultiplicador.reduce((resultado, t) => {
      if(t) {
        if (!isNaN(t)) t = '$' + t + '$';
        resultado.push(t.trim());
      } 
      return resultado}, []
      );
      textoAjeitado.splice(j, 1, ...separadoPorMultiplicador);
  }
  var estrofeAnterior = limparTexto(textoAjeitado[0]);
  var estrofeAtual;
  var cont;
  for (var i = 1; i < textoAjeitado.length; i++) {
    if (/\$\d\$/.test(textoAjeitado[i])) continue;
    estrofeAtual = limparTexto(textoAjeitado[i]);
    if (estrofeAtual === estrofeAnterior) {
      cont = textoAjeitado[i-1].replace('$', '');
      if (!isNaN(cont)) {
        cont = Number(cont) + 1;
      } else {
        cont = 2;
      }
      textoAjeitado[i] = '$' + cont + '$';
      if (/\$\d\$/.test(textoAjeitado[i-1])) {
        textoAjeitado.splice(i-1, 1); 
        i--;
      }
    } else {
      cont = 1;
      estrofeAnterior = estrofeAtual;
    }
  }
  return textoAjeitado;
}

export function getLinhas(texto, fontStyle, larguraLinha, caseTexto, widthInicial = 0) {
  
  if (/\$\d\$/.test(texto)) return {contLinhas: 0, widthResto: 0}; 
  texto = capitalize(texto, caseTexto);
  var widthResto = widthInicial;
  var trechos = texto.split('\n');
  var linhas;
  var contLinhas = trechos.length-1;
  for (var t of trechos) {
    if (!t) continue;
    linhas = linhasTrecho(t, fontStyle, larguraLinha, widthResto);
    contLinhas += linhas.length-1;
    widthResto = 0;
  }
  if (trechos[trechos.length-1] !== '')
    widthResto = linhas[linhas.length-1];
  return {contLinhas: contLinhas, widthResto: widthResto};
}

function linhasTrecho(texto, fontStyle, larguraLinha, widthInicial = 0) {
  var palavras = texto.split(' ');
  var arrayP = [];
  var widthParcial = 0;
  for (var i = 0; i < palavras.length; i++) {
    arrayP.push(palavras[i]);
    widthParcial += canvasTextWidth(' ' + palavras[i+1], fontStyle);
    if (widthInicial + widthParcial> larguraLinha) {
      return [1, ...linhasTrecho(palavras.slice(i+2).join(' '), fontStyle, larguraLinha)];
    }
  }
  return [widthParcial];
}

function canvasTextWidth(texto, fontStyle) {
  var canvas = canvasTextWidth.canvas || (canvasTextWidth.canvas = document.createElement("canvas"));
  var context = canvas.getContext("2d");
  context.font = fontStyle;
  var metrics = context.measureText(texto);
  return metrics.width;
}

export function capitalize (string, caseTexto) {

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

function retiraAcentos(str) {
  var com_acento = "ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝŔÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿŕ";
  var sem_acento = "AAAAAAACEEEEIIIIDNOOOOOOUUUUYRsBaaaaaaaceeeeiiiionoooooouuuuybyr";
  var novastr="";
  for(var i = 0; i < str.length; i++) {
      var troca = false;
      for (var a = 0; a < com_acento.length; a++) {
          if (str.substr(i,1) === com_acento.substr(a, 1)) {
              novastr += sem_acento.substr(a, 1);
              troca=true;
              break;
          }
      }
      if (!troca) {
          novastr += str.substr(i, 1);
      }
  }
  return novastr;
}  