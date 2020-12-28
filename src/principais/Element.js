import AdicionarMusica from '../Components/Popup/PopupsAdicionar/LetrasMusica/AdicionarMusica';
import AdicionarTextoBiblico from '../Components/Popup/PopupsAdicionar/TextoBiblico/AdicionarTextoBiblico';
import AdicionarTexto from '../Components/Popup/PopupsAdicionar/AdicionarTexto';
import AdicionarImagem from '../Components/Popup/PopupsAdicionar/AdicionarImagem/AdicionarImagem';
// import AdicionarVideo from '../Components/Popup/PopupsAdicionar/AdicionarVideo/AdicionarVideo';
import { capitalize, canvasTextWidth, retiraAcentos } from './FuncoesGerais';
import store from '../index';

export const tiposElemento = {
    Música: AdicionarMusica
  , TextoBíblico: AdicionarTextoBiblico
  , TextoLivre: AdicionarTexto
  , Imagem: AdicionarImagem
  // , Vídeo: AdicionarVideo
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

export const textoMestre = 'As configurações do estilo desse slide serão aplicadas aos demais, exceto quando configurações específicas de cada slide se sobrepuserem às deste. \n\nEste slide não será exportado nem exibido no modo de apresentação.'

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
  paragrafo: {fontSize: 1.5, paddingRight: 0.08, lineHeight: 1.9}, 
  fundo: {path: ''}, 
  tampao: {backgroundColor: '#ffffff', opacityFundo: 0.2, eBasico: true},
  imagem: {left: '10%', right: '10%', top: '10%', bottom: '10%', borderRadius: '0px', proporcaoNatural: 1}
};

const proporcaoPadTop = 0;

export const getEstiloPadrao = () => {
  var estilo = {...estiloPadrao};
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
  
  constructor(tipo, titulo, texto = [], imagens = [], estilo = {}, eMestre = false, elementoDB = null) {     
    if (elementoDB) {
      this.descoversorFirestore(elementoDB);
      return;
    }
    this.tipo = tipo;
    this.titulo = titulo;
    this.texto = texto;
    this.imagens = imagens;
    this.eMestre = eMestre;
    this.colapsado = false;
    
    var est = {...newEstilo(), ...estilo};
    est = {...est, paragrafo: getPadding(est, 'paragrafo'), titulo: getPadding(est, 'titulo')};
    if (this.tipo === 'TextoLivre' && texto.filter(t => t !== '').length === 0) est.titulo.height = '1';
    this.slides = [{estilo: {...est}, eMestre: true, textoArray: [textoMestre]}];
    this.criarSlides(this.texto, est);
  }

  criarSlides = (texto, estiloMestre, nSlide = 0, estGlobal = null, ratio = null, thisP = this) => {
    
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
          nSlide = 1;
          break;
        }
      }
    }
    if (thisP.tipo === 'Imagem') {
      thisP.dividirImagens();
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
      estilo: {...estiloMestre, titulo: {...estiloMestre.titulo, height: 1, display: null}},
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
    return arrayTexto.flat();
  }

  dividirImagens = (thisP = this) => {
    if (thisP.imagens.length === 1) {
      thisP.slides[0].imagem = thisP.imagens[0];
      thisP.slides[0].eMestre = false;
      thisP.slides[0].textoArray = [];
    } else {
      for (var img of thisP.imagens) {
        thisP.slides.push({estilo: {...newEstilo()}, imagem: img, textoArray: []});
      }
    }
  }

  dividirTexto = (texto, nSlide, estElemento, estGlobal = null, ratio = null, thisP = this) => {
    
    //Divide o texto a ser incluído em quantos slides forem necessários, mantendo a estilização de cada slide.
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
    var padV = Number(estP.paddingTop) + Number(estP.paddingRight); //Right é a base de cálculo, bottom varia.
    var padH = Number(estP.paddingRight) + Number(estP.paddingLeft);
    var larguraLinha = ratio.width*(1-padH);
    var alturaLinha = estP.lineHeight*estP.fontSize*fonteBase.numero;
    var alturaTitulo = estTitulo.display === 'none'
                        ? 0 
                        : estTitulo.height;
    var alturaSecaoTitulo = ratio.height*alturaTitulo;
    var alturaSecaoParagrafo = ratio.height-alturaSecaoTitulo;
    var alturaParagrafo = alturaSecaoParagrafo*(1-padV);
    var nLinhas = alturaParagrafo/alturaLinha;
  
    if (nLinhas % 1 > 0.7) {
      nLinhas = Math.ceil(nLinhas);
    } else {
      nLinhas = Math.floor(nLinhas);
    }
    slide.estilo.paragrafo.paddingBottom = ((alturaSecaoParagrafo-nLinhas*alturaLinha)/ratio.width)-Number(estP.paddingTop); 
    
    var duasColunas = false;
    if (estP.duasColunas) {
      larguraLinha = larguraLinha*0.48;
      if (thisP.tipo === 'Música') {
        duasColunas = true;       
      } else {
        nLinhas = nLinhas*2;
      }
    }


    var estiloFonte = [(estP.fontStyle || ''), (estP.fontWeight || ''), estP.fontSize*fonteBase.numero + fonteBase.unidade, "'" + estP.fontFamily + "'"];
    estiloFonte = estiloFonte.filter(a => a !== '').join(' ');
    var caseTexto = estP.caseTexto || estP.caseTexto;
    var separador = thisP.tipo === 'TextoBíblico' ? '' : '\n\n';
    if (thisP.tipo === 'Música' && estP.omitirRepeticoes) texto = marcarEstrofesRepetidas(texto);
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
        thisP.dividirTexto(texto.slice(i+1), nSlide+1, estElemento, estGlobal, ratio, thisP);
        break;
      }
    }
    thisP.slides[nSlide].textoArray = texto.slice(0, i+1);
  }

  conversorFirestore = thisP => {
    var elementoSimplificado = {
      tipo: thisP.tipo,
      titulo: thisP.titulo,
      texto: thisP.texto,
      imagens: thisP.imagens,
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
    this.texto = elementoDB.texto;
    this.imagens = elementoDB.imagens;
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
    if (widthInicial + widthParcial > larguraLinha) {
      return [1, ...linhasTrecho(palavras.slice(i+1).join(' '), fontStyle, larguraLinha)];
    }
  }
  return [widthParcial];
}