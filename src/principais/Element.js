import AdicionarMusica from '../Components/Popup/PopupsAdicionar/LetrasMusica/AdicionarMusica';
import AdicionarTextoBiblico from '../Components/Popup/PopupsAdicionar/TextoBiblico/AdicionarTextoBiblico';
import AdicionarTexto from '../Components/Popup/PopupsAdicionar/AdicionarTexto';
import AdicionarImagem from '../Components/Popup/PopupsAdicionar/AdicionarImagem/AdicionarImagem';
import AdicionarVideo from '../Components/Popup/PopupsAdicionar/AdicionarVideo/AdicionarVideo';
import { capitalize, canvasTextWidth, retiraAcentos } from './FuncoesGerais';
import store from '../index';
import { Provider } from 'react-redux';
import {createStore} from 'redux';
import React from 'react';
import ReactDOM from 'react-dom';
import { getSlidePreview } from '../Components/MenuExportacao/Exportador';
import SlideFormatado from '../Components/Preview/SlideFormatado';

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
  imagem: {
    left: '10%', right: '10%', top: '10%', bottom: '10%', borderRadius: '10px', proporcaoNatural: 1,
    espelhadoVertical: false, 
    espelhadoHorizontal: false
  }
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
    this.eMestre = eMestre;
    this.colapsado = false;
    
    var est = {...newEstilo(), ...estilo};
    est = {...est, paragrafo: getPadding(est, 'paragrafo'), titulo: getPadding(est, 'titulo')};
    if (this.tipo === 'TextoLivre' && texto.filter(t => t !== '').length === 0) est.titulo.height = '1';
    this.slides = [{estilo: {...est}, eMestre: true, textoArray: [textoMestre]}];
    this.criarSlides(texto, est, undefined, undefined, undefined, undefined, imagens);
  }

  criarSlides = (texto, estiloMestre, nSlide = 0, estGlobal = null, ratio = null, thisP = this, imagens = [], elementos = null) => {
    
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
      thisP.dividirTexto(texto, nSlide, estiloMestre, estGlobal, ratio, thisP, elementos);
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

  dividirImagens = (thisP = this, imagens) => {
    if (thisP.imagens.length === 1) {
      thisP.slides[0].imagem = imagens[0];
      thisP.slides[0].eMestre = false;
      thisP.slides[0].textoArray = [];
    } else {
      for (var img of imagens) {
        thisP.slides.push({estilo: {...newEstilo()}, imagem: img, textoArray: []});
      }
    }
  }

  dividirTexto = (texto, nSlide, estElemento, estGlobal = null, ratio = null, thisP = this, elementos) => {
    
    //Divide o texto a ser incluído em quantos slides forem necessários, mantendo a estilização de cada slide.
    if (nSlide === thisP.slides.length) {
      thisP.slides.push({estilo: {...newEstilo()}, textoArray: []});
    } else if (nSlide > thisP.slides.length) {
      console.log('Tentativa de criar slide além do limite: ' + nSlide);
      return;
    }
    ratio = ratio || store.getState().present.ratio;
    var slide = thisP.slides[nSlide];  
    elementos = [
      ...(elementos || store.getState().present.elementos), 
      {...thisP, slides: [...thisP.slides.slice(0, nSlide+1), slide]}
    ];
    let selecionado;

    const getSlide = () =>{
      selecionado = {elemento: elementos.length-1, slide: nSlide};
      return getSlidePreview({elementos, selecionado});
    }

    let {paragrafo, titulo} = getSlide().estilo;
    
    // Variáveis relacionadas ao tamanho do slide.
    // let padV = Number(paragrafo.paddingTop) + Number(paragrafo.paddingRight); //Right é a base de cálculo, bottom varia.
    // var padH = Number(paragrafo.paddingRight) + Number(paragrafo.paddingLeft);
    // var larguraLinha = ratio.width*(1-padH);
    // let fonteBase = getFonteBase(ratio);
    // let alturaLinha = paragrafo.lineHeight*paragrafo.fontSize*fonteBase.numero;
    // let alturaTitulo = titulo.display === 'none'
    //                     ? 0 
    //                     : titulo.height;
    // let alturaSecaoTitulo = ratio.height*alturaTitulo;
    // let alturaSecaoParagrafo = ratio.height-alturaSecaoTitulo;
    // let alturaParagrafo = alturaSecaoParagrafo*(1-padV);
    // let nLinhas = alturaParagrafo/alturaLinha;
  
    // if (nLinhas % 1 > 0.7) {
    //   nLinhas = Math.ceil(nLinhas);
    // } else {
    //   nLinhas = Math.floor(nLinhas);
    // }
    // slide.estilo.paragrafo.paddingBottom = ((alturaSecaoParagrafo-nLinhas*alturaLinha)/ratio.width)-Number(paragrafo.paddingTop); 
    
    // var duasColunas = false;
    // if (paragrafo.duasColunas) {
    //   larguraLinha = larguraLinha*0.48;
    //   if (thisP.tipo === 'Música') {
    //     duasColunas = true;       
    //   } else {
    //     nLinhas = nLinhas*2;
    //   }
    // }

    // var estiloFonte = [(paragrafo.fontStyle || ''), (paragrafo.fontWeight || ''), paragrafo.fontSize*fonteBase.numero + fonteBase.unidade, "'" + paragrafo.fontFamily + "'"];
    // estiloFonte = estiloFonte.filter(a => a !== '').join(' ');
    // var caseTexto = paragrafo.caseTexto || paragrafo.caseTexto;
    // var separador = thisP.tipo === 'TextoBíblico' ? '' : '\n\n';
    if (thisP.tipo === 'Música' && paragrafo.omitirRepeticoes) texto = marcarEstrofesRepetidas(texto);
    // var { contLinhas, widthResto } = getLinhas(texto[0], estiloFonte, larguraLinha, caseTexto);
    let i;
    let idPreview = 'container-preview-invisivel';
    let node = document.getElementById(idPreview);

    for (i = 0; i < texto.length; i++) {
      if (i + 1 >= texto.length) {
        thisP.slides = thisP.slides.slice(0, nSlide + 1);
        break;
      }
      slide.textoArray = texto.slice(0, i+1);
      let preview = 
        <Provider store={createStore((state = {present: {ratio, selecionado: {}}}) => state)}>
          <div className={idPreview}> 
            <SlideFormatado 
              slidePreview={getSlide()}
              className='preview-fake'
              editavel={false}
              proporcao={1}
            />
          </div>
        </Provider>
      ReactDOM.render(preview, node);
      let alturaQuadro = document.querySelectorAll(`#${idPreview} .realce-paragrafo`)[0].getBoundingClientRect().height;
      let {height} = document.querySelectorAll(`#${idPreview} .container-estrofe`)[0].getBoundingClientRect();
      ReactDOM.unmountComponentAtNode(node);
      console.log(height);
      if(height > alturaQuadro) {
        thisP.dividirTexto(texto.slice(i+1), nSlide+1, estElemento, estGlobal, ratio, thisP, elementos);
        break;
      }
    }
    slide.textoArray = texto.slice(0, i+1);
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

export const eEstiloLimpo = slide => {
  
}