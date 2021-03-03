import AdicionarMusica from '../Components/Popup/PopupsAdicionar/LetrasMusica/AdicionarMusica';
import AdicionarTextoBiblico from '../Components/Popup/PopupsAdicionar/TextoBiblico/AdicionarTextoBiblico';
import { getTextoVersiculo } from '../Components/Preview/TextoPreview';
import AdicionarTexto from '../Components/Popup/PopupsAdicionar/AdicionarTexto';
import AdicionarImagem from '../Components/Popup/PopupsAdicionar/AdicionarImagem/AdicionarImagem';
import AdicionarVideo from '../Components/Popup/PopupsAdicionar/AdicionarVideo/AdicionarVideo';
import { capitalize, canvasTextWidth, retiraAcentos } from './FuncoesGerais';
import {listaSuperscritos} from './Constantes';
import store from '../index';

export const tiposElemento = {
    Música: AdicionarMusica
  , TextoBíblico: AdicionarTextoBiblico
  , TextoLivre: AdicionarTexto
  , Imagem: AdicionarImagem
  , Vídeo: AdicionarVideo
}

export const imagemEstaNoBD = strSrc => /firebase/.test(strSrc || '');

export function getNomeInterfaceTipo(nome) {
  nome = nome.split('');
  for (var i = 1; i < nome.length; i++) {
    if(/[A-Z]/.test(nome[i])) {
      nome.splice(i, 0, [' ']);
      i++;
    }
  }
  return nome.join('');
}

export const getGeneroTipo = tipo => {
  return /[oe]/.test(tipo.slice(-1)) ? 'o' : 'a';
}

export function getDadosMensagem(elemento) {
  return {
    elemento: getNomeInterfaceTipo(elemento.tipo) + ': "' + elemento.titulo + '"',
    genero: getGeneroTipo(elemento.tipo)
  };
}

export const textoMestre = {texto: 'As configurações do estilo desse slide serão aplicadas aos demais, exceto quando configurações específicas de cada slide se sobrepuserem às deste. \n\nEste slide não será exportado nem exibido no modo de apresentação.'}

export const listaPartesEstilo = ['texto', 'titulo', 'paragrafo', 'fundo', 'tampao', 'imagem'];

export const newEstilo = () => {
  var obj = {};
  for (var i of listaPartesEstilo) {
    obj[i] = {};
  }
  return obj;
}

export const fontePadrao = 'Noto Sans';

export const getFonteBase = (ratio = {}) => ({numero: 0.025*(ratio.height || store.getState().present.ratio.height), unidade: 'px', fontFamily: fontePadrao});
  
export const estiloPadrao = {
  texto: {fontFamily: fontePadrao, eBasico: true}, 
  titulo: {fontSize: 3, height: 0.25, paddingRight: 0.08, textAlign: 'center'}, 
  paragrafo: {fontSize: 1.5, paddingRight: 0.08, paddingBottom: 0.08, paddingTop: 0.005, lineHeight: 1.9, temVers: true, temLivro: true, temCap: true}, 
  fundo: {path: ''}, 
  tampao: {backgroundColor: '#ffffff', opacityFundo: 0.2, eBasico: true},
  imagem: {
    left: '10%', right: '10%', top: '10%', bottom: '10%', borderRadius: '10px', proporcaoNatural: 1,
    espelhadoVertical: false, 
    espelhadoHorizontal: false
  }
};

export const getEstiloPadrao = () => {
  var estilo = {...estiloPadrao};
  estilo.paragrafo = getPadding(estilo, 'paragrafo');
  estilo.titulo = getPadding(estilo, 'titulo');  
  return estilo;
}

export function getPadding (estilo, objeto) {
  let pad = estilo[objeto].paddingRight;
  let {paddingBottom} = estilo[objeto];
  if (objeto !== 'paragrafo') paddingBottom = 0;
  else if (paddingBottom === undefined) paddingBottom = pad;
  if (!pad) return {...estilo[objeto]};
  return {...estilo[objeto],
          paddingRight: pad,
          paddingLeft: pad,
          paddingBottom,
          paddingTop: 0.005
  };
}

export default class Element {
  
  constructor(tipo, titulo, texto = [], imagens = [], estilo = {}, eMestre = false, elementoDB = null) {     
    if (elementoDB) {
      this.descoversorFirestore(elementoDB);
      return;
    }
    this.tipo = tipo;
    this.titulo = titulo;
    this.eMestre = eMestre;
    this.colapsado = false;
    
    var est = {...newEstilo(), ...estilo};
    est = {...est, paragrafo: getPadding(est, 'paragrafo'), titulo: getPadding(est, 'titulo')};
    if (this.tipo === 'TextoLivre' && texto.filter(t => t !== '').length === 0) est.titulo.height = '1';
    this.slides = [{estilo: {...est}, eMestre: true, textoArray: [textoMestre]}];
    this.criarSlides(texto, est, undefined, undefined, undefined, undefined, imagens);
  }

  criarSlides = (texto, estiloMestre, nSlide = 0, estGlobal = null, ratio = null, thisP = this, imagens = []) => {
    
    if (thisP.eMestre) return;
    if (thisP.slides[nSlide].eMestre) nSlide++;
    let isolarTitulo = ((estGlobal || {}).titulo || {}).isolar || estiloMestre.titulo.isolar;
    if (isolarTitulo) { 
      nSlide = Math.max(2, nSlide);
      if (thisP.slides.length === 1 || !thisP.slides[1].eTitulo) 
        thisP.slides.splice(1, 0, this.getSlideTitulo(estiloMestre));
    } else {
      for (let i = 0; i < thisP.slides.length; i++) {
        if (thisP.slides[i].eTitulo) {
          thisP.slides.splice(i, 1);
          nSlide = nSlide -1;
          break;
        }
      }
    }
    if (thisP.tipo === 'Imagem') {
      thisP.dividirImagens(this, imagens);
    } else {
      thisP.dividirTexto(texto, nSlide, estiloMestre, estGlobal, ratio, thisP);
    }
    if (thisP.slides.length > 1 && !thisP.slides[0].eMestre) {
      thisP.slides.unshift({estilo: {...estiloMestre}, textoArray: [textoMestre], eMestre: true});
      thisP.slides[1].estilo = {...newEstilo()};
    } else if (thisP.slides.length === 2 && thisP.slides[0].eMestre) {
      thisP.slides[1].estilo = thisP.slides[0].estilo;
      thisP.slides.shift();
    }
    return thisP;
  }

  getSlideTitulo = (estiloMestre) => {
    return {
      textoArray: [],
      estilo: {...estiloMestre, titulo: {...estiloMestre.titulo, height: 1, visibility: null}},
      eTitulo: true
    }
  }
  
  getArrayTexto = (nSlide = 0, thisP = this) => {
    if (thisP.slides[nSlide].eMestre) nSlide++;
    var arrayTexto = [];
    while (nSlide < thisP.slides.length) {
      arrayTexto.push(thisP.slides[nSlide].textoArray);
      nSlide++;
    }
    arrayTexto = arrayTexto.flat(); 
    let separador = thisP.tipo === 'Música' ? '\n' : ' ';
    return arrayTexto.reduce((res, t) => {
      if (t.continuacao) {
        res[res.length - 1].texto += separador + t.texto;
      } else {
        res.push(t);
      }
      return res;
    }, []).map(t => ({...t, continuacao: false}))
  }

  dividirImagens = (thisP = this, imagens) => {
    if (imagens.length === 1) {
      thisP.slides[0].imagem = imagens[0];
      thisP.slides[0].eMestre = false;
      thisP.slides[0].textoArray = [];
    } else {
      for (var img of imagens) {
        thisP.slides.push({estilo: {...newEstilo()}, imagem: img, textoArray: []});
      }
    }
  }

  dividirTexto = (texto, nSlide, estElemento, estGlobal = null, ratio = null, thisP = this, versoAnterior = null) => {
    
    //Divide o texto a ser incluído em quantos slides forem necessários, mantendo a estilização de cada slide.
    if (texto.length === 0) {
      thisP.slides.splice(nSlide, 1000);
      return;
    }
    texto = [...texto];
    if (nSlide === thisP.slides.length) {
      thisP.slides.push({estilo: {...newEstilo()}, textoArray: []});
    } else if (nSlide > thisP.slides.length) {
      console.log('Tentativa de criar slide além do limite: ' + nSlide);
      return;
    }
    var slide = thisP.slides[nSlide];  
    
    var estSlide = slide.estilo;
    estGlobal = estGlobal ? estGlobal : store.getState().present.elementos[0].slides[0].estilo;
    if(!ratio) ratio = store.getState().present.ratio;
    var fonteBase = getFonteBase(ratio);
    
    var estT = {...estGlobal.texto, ...estElemento.texto, ...estSlide.texto};
    var estP = {...estT, ...estGlobal.paragrafo, ...estElemento.paragrafo , ...estSlide.paragrafo};
    var estTitulo = {...estT, ...estGlobal.titulo, ...estElemento.titulo, ...estSlide.titulo};
    // Variáveis relacionadas ao tamanho do slide.
    var padV = Number(estP.paddingTop) + Number(estP.paddingBottom);
    var padH = Number(estP.paddingRight) + Number(estP.paddingLeft);
    var larguraLinha = ratio.width*(1-padH);
    var alturaLinha = estP.lineHeight*estP.fontSize*fonteBase.numero;
    var alturaTitulo = estTitulo.height;
    var alturaSecaoTitulo = ratio.height*alturaTitulo;
    var alturaSecaoParagrafo = ratio.height-alturaSecaoTitulo;
    var alturaParagrafo = alturaSecaoParagrafo-padV*ratio.width;
    var nMaxLinhas = alturaParagrafo/alturaLinha;
  
    // if (nMaxLinhas % 1 > 0.7) {
    //   nMaxLinhas = Math.ceil(nMaxLinhas);
    // } else {
    //   nMaxLinhas = Math.floor(nMaxLinhas);
    // }
    // slide.estilo.paragrafo.paddingBottom = ((alturaSecaoParagrafo-nMaxLinhas*alturaLinha)/ratio.width)-Number(estP.paddingTop); 
    
    // var duasColunas = false;
    // if (estP.duasColunas) {
    //   larguraLinha = larguraLinha*0.48;
    //   if (thisP.tipo === 'Música') {
    //     duasColunas = true;       
    //   } else {
    //     nMaxLinhas = nMaxLinhas*2;
    //   }
    // }

    const eBiblia = thisP.tipo === 'TextoBíblico';
    const eMusica = thisP.tipo === 'Música';
    if (eMusica) {
      if(estP.omitirRepeticoes) texto = marcarEstrofesRepetidas(texto);
      else texto = multiplicarEstrofes(texto);
    }

    var estiloFonte = [(estP.estiloFonte || ''), (estP.fontWeight || ''), estP.fontSize*fonteBase.numero + fonteBase.unidade, "'" + estP.fontFamily + "'"];
    estiloFonte = estiloFonte.filter(a => a !== '').join(' ');
    var caseTexto = estP.caseTexto || estP.caseTexto;
    var separador = eBiblia ? '' : '\n';
    let {temVers, temCap, temLivro} = estP;

    const getVersiculo = (verso, anterior, primeiro) => {
      if(eBiblia) return getTextoVersiculo(verso, anterior, {temVers, temCap, temLivro}, false, primeiro);
      return verso.texto; 
    }

    var i;
    
    const callDividir = indice =>
      thisP.dividirTexto(texto.slice(indice+1), nSlide+1, estElemento, estGlobal, ratio, thisP, texto[indice]);

    let dadosEstilo = {estiloFonte, larguraLinha, caseTexto}
    var { contLinhas, widthResto, quebrado } = getNumeroLinhas(getVersiculo(texto[0], versoAnterior, true), dadosEstilo, undefined, nMaxLinhas, eMusica, true);
    if (quebrado) {
      if (eBiblia) {
        let re = new RegExp('[' + listaSuperscritos + '] ', 'g');
        let intro = (temLivro ? texto[0].livro + ' ': '') + (temCap ? texto[0].cap + ' ' : '')
        quebrado = quebrado.map(t => t.replace(intro, '').replace(re, ''));
      }
      texto[0] = quebrado.map((t, l) => (
        {...texto[0], texto: t, continuacao: texto[0].continuacao || !!l}
      ))
      texto = texto.flat();
      i = 0;
      callDividir(i);
    } else {
      for (i = 0; i < texto.length; i++) {
        if (i+1 >= texto.length) {
          thisP.slides.splice(nSlide + 1, 1000);
          break;
        }
        var linhas = getNumeroLinhas(separador + getVersiculo(texto[i+1], texto[i], false), dadosEstilo, widthResto, nMaxLinhas, thisP.tipo)
        contLinhas += linhas.contLinhas;
        if (/\n/.test(separador)) widthResto = linhas.widthResto;
        else contLinhas += 1;        
        if (getNumLinhas(contLinhas, widthResto) > nMaxLinhas) { //Se próximo versículo vai ultrapassar o slide, conclui slide atual.
          // if (duasColunas) [ contLinhas, widthResto, duasColunas ] = [ 0, 0, false ]; 
          callDividir(i);
          break;
        }
      }
    }
    thisP.slides[nSlide].textoArray = texto.slice(0, i+1);
  }

  conversorFirestore = thisP => {
    var elementoSimplificado = {
      tipo: thisP.tipo,
      titulo: thisP.titulo,
      eMestre: thisP.eMestre,
      input1: thisP.input1 || null,
      input2: thisP.input2 || null,
      slides: thisP.slides
    }
    return elementoSimplificado;
  }

  descoversorFirestore = elementoDB => {
  
    const zerarSrc = objImagem => {
      objImagem.src = '';
      objImagem.idUpload = null;
    }

    this.tipo = elementoDB.tipo;
    this.titulo = elementoDB.titulo;
    this.eMestre = elementoDB.eMestre;
    this.input1 = elementoDB.input1;
    this.input2 = elementoDB.input2;
    this.slides = elementoDB.slides;
    for (let s of this.slides) {
      if (!s.imagem) return;
      if (!imagemEstaNoBD(s.imagem.src)) zerarSrc(s.imagem);
      let { fundo } = s.estilo;
      if (!fundo.path && !imagemEstaNoBD(fundo.src)) zerarSrc(fundo);
    }
  }
}

const marcarEstrofesRepetidas = texto => {

  const limparTexto = t => retiraAcentos(t).toLowerCase().replace(/[^a-z]/g,'');
  let tAnterior = limparTexto(texto[0].texto);
  for (let i = 1; i < texto.length; i++) {
    let tAtual = limparTexto(texto[i].texto);
    if(tAnterior === tAtual){
      texto[i-1].repeticoes = (texto[i-1].repeticoes || 1) + 1;
      texto.splice(i, 1);
    } 
    tAnterior = tAtual;
  }
  return texto;
}

const multiplicarEstrofes = texto => 
  texto.reduce((resultado, t) => {
    let rep = t.repeticoes || 1;
    let flated = Array(rep);
    flated.fill({...t, repeticoes: 1});
    resultado = [...resultado, ...flated];
    return resultado;
  }, [])


export function getNumeroLinhas(texto, dadosEstilo, widthInicial = 0, nMaxLinhas, eMusica, quebrar = false) {
  
  let {caseTexto} = dadosEstilo;
  texto = capitalize(texto, caseTexto);
  var widthResto = widthInicial;
  let separador = '\n';
  var trechos = texto.split(separador);
  var contLinhas = 0;
  for (let k = 0; k < trechos.length; k++) {
    let t = trechos[k];
    var {linhasTotal, widthParcial, quebrado} = getNumeroLinhasTrecho(t, dadosEstilo, widthResto, nMaxLinhas, quebrar && !eMusica);
    contLinhas += getNumLinhas(linhasTotal, widthParcial);
    widthResto = 0;
    if(quebrar && eMusica) quebrado = getParagrafoQuebrado(trechos, nMaxLinhas, contLinhas, widthResto, k, separador);
    if(quebrado) return {contLinhas: nMaxLinhas, widthResto: 0, quebrado};
  }
  if (trechos[trechos.length-1] !== '')
    widthResto = widthParcial;
  return {contLinhas, widthResto};
}

function getNumeroLinhasTrecho(texto, dadosEstilo, widthInicial = 0, nMaxLinhas, quebrar, linhasParcial = 0, textoParcial = []) {
  let separador = ' ';
  let palavras;
  if(typeof texto === 'string') palavras = texto.split(separador)
  else palavras = texto;
  if (linhasParcial >= nMaxLinhas && quebrar && palavras.join('')) 
    return {linhasTotal: linhasParcial, widthParcial: 0, quebrado: [textoParcial.join(separador), palavras.join(separador)]}
  let {estiloFonte, larguraLinha} = dadosEstilo;
  let widthPalavras = 0;
  for (let i = 0; i < palavras.length; i++) {
    widthPalavras += canvasTextWidth(separador + palavras[i+1], estiloFonte);
    if (widthInicial + widthPalavras > larguraLinha) {
      return getNumeroLinhasTrecho(
        palavras.slice(i+1), 
        dadosEstilo, 
        0, 
        nMaxLinhas,
        quebrar,
        linhasParcial + 1, 
        [textoParcial, palavras.slice(0, i+1)].flat()
      );
    }
  }
  return {linhasTotal: linhasParcial, widthParcial: widthPalavras, quebrado: null};
}

const getParagrafoQuebrado = (trechos, nMaxLinhas, contLinhas, widthResto, indice, separador) => {
  if(contLinhas + (widthResto ? 1 : 0) > nMaxLinhas)
    return [
      trechos.slice(0, indice).join(separador),
      trechos.slice(indice).join(separador)
    ];
}

const getNumLinhas = (contLinhas, widthResto) => contLinhas + (widthResto > 0 ? 1 : 0);