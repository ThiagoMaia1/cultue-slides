import { fonteBase } from './Components/Preview/Preview';

export class Estilo {
    constructor () {
      this.texto = {}; 
      this.titulo = {}; 
      this.paragrafo = {}; 
      this.fundo = null; 
      this.tampao = {};
      this.imagem = {};
    }
}
  
export const estiloPadrao = {
    texto: {fontFamily: fonteBase.fontFamily}, 
    titulo: {fontSize: '3', height: '0.25', padding: '0.08'}, 
    paragrafo: {fontSize: '1.5', padding: '0.08', lineHeight: '1.7'}, 
    fundo: './Galeria/Fundos/Aquarela.jpg', 
    tampao: {backgroundColor: '#fff', opacity: '0.2'}
};

export const proporcaoPadTop = 0;
export const textoMestre = 'As configurações do estilo desse slide serão aplicadas aos demais, exceto quando configurações específicas de cada slide se sobrepuserem as deste. \n\n Este slide não será exibido no modo de apresentação.'

  
export default class Element {
    constructor(tipo, titulo, texto = [], imagem = null, estilo = {}, eMestre = false) {     
      this.tipo = tipo;
      this.titulo = titulo;
      this.texto = texto;
      this.imagem = imagem;
      this.eMestre = eMestre;
      
      var est = {...new Estilo(), ...estilo};
      if (this.tipo === 'Título' && texto.filter(t => t !== '').length === 0) est.titulo.height = '1';
      this.slides = [{estilo: {...est}}];
      this.criarSlides(this.texto, est);
    }
  
    criarSlides = (texto, estiloMestre, nSlide = 0, estGlobal = null) => {
      if (this.slides[nSlide].eMestre) nSlide++;
      this.dividirTexto(texto, nSlide, estiloMestre, estGlobal);
      if (this.slides.length > 1 && !this.slides[0].eMestre) {
        this.slides.unshift({estilo: {...estiloMestre}, texto: textoMestre, eMestre: true});
        this.slides[1].estilo = {...new Estilo()};
      } else if (this.slides.length === 2 && this.slides[0].texto.eMestre) {
        this.slides[1].estilo = this.slides[0].estilo;
        this.slides.shift();
      }
    }
  
    dividirTexto = (texto, nSlide, estElemento, estGlobal = null) => {//Divide o texto a ser incluído em quantos slides forem necessários, mantendo a estilização de cada slide.
      
      if (nSlide === this.slides.length) {
        this.slides.push({estilo: {...new Estilo()}, texto: ''});
      } else if (nSlide > this.slides.length) {
        console.log('Tentativa de criar slide além do limite: ' + nSlide);
        return;
      }
      var slide = this.slides[nSlide];  
      if (nSlide === 0) slide.eMestre = this.eMestre; 
  
      var estSlide = slide.estilo;
      estGlobal = estGlobal ? estGlobal : estiloPadrao;
      
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
            if (proximaPalavra !== '') {
              this.dividirTexto(texto.slice(i+1), nSlide+1, estElemento, estGlobal);
            } else {
              this.slides = this.slides.slice(0, nSlide+1);
            }
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
  