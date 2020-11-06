import React, { Component } from 'react';
import { connect } from 'react-redux';
import { capitalize, getNomeInterfaceTipo } from '../../Element';
import Preview from '../Preview/Preview';

export function getBase64Image(src, classe, total, callback) {
  const img = new Image();
  img.crossOrigin = 'Anonymous';
  img.onload = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    let dataURL;
    var iw = img.width;
    var ih = img.height;
    var windowW = window.screen.width;
    var windowH = window.screen.height;
    var scale = Math.max((windowW/iw), (windowH/ih));
    var wScaled = windowW/scale;
    var hScaled = windowH/scale;
    canvas.width = windowW;
    canvas.height = windowH;
    ctx.drawImage(img, (iw - wScaled)/2, (ih - hScaled)/2, wScaled, hScaled, 0, 0, windowW, windowH);
    dataURL = canvas.toDataURL("image/png");
    callback(dataURL, classe, total, src);
  };

  img.src = src;
}

export const getDate = function() {
  var data = new Date(); 
  return data.getFullYear() +  
         String((data.getMonth()+1)).padStart(2,'0') + 
         String(data.getDate()).padStart(2,'0') + ' ' +
         String(data.getHours()).padStart(2,'0') + "h" +   
         String(data.getMinutes()).padStart(2,'0') + "m" + 
         String(data.getSeconds()).padStart(2,'0') + 's';
}

export function selecionadoOffset (elementos, selecionado, offset, apresentacao = undefined) {
    if (apresentacao === undefined) apresentacao = !!document.fullscreenElement; 
    if (elementos.length === 1) apresentacao = false;
    var elem = slidesOrdenados(elementos, !apresentacao);
    for (var i = 0; i < elem.length; i++) { //Acha o selecionado atual.
      if (elem[i].elemento === selecionado.elemento && elem[i].slide === selecionado.slide) {
        var novoIndex = i + offset;
        if (novoIndex < 0) {
          novoIndex = 0;
        } else if (novoIndex >= elem.length) { 
          novoIndex = elem.length-1;
        }         
        break;
      }
    }
    return {elemento: elem[novoIndex].elemento, slide: elem[novoIndex].slide};
}

export const slidesOrdenados = (elementos, incluirMestre = false) => {
  var elem = elementos.flatMap((e, i) => { 
    return e.slides.map((s, j) => ({elemento: i, slide: j, eMestre: s.eMestre})); //Gera um array ordenado com todos os slides que existem representados por objetos do tipo "selecionado".
  })
  if (!incluirMestre) {
    elem = elem.filter(e => !e.eMestre);
  }
  return elem;
}

export function getSlidePreview (state, selecionado = null) {
  const sel = selecionado || state.selecionado;
  const global = state.elementos[0].slides[0];
  const elemento = state.elementos[sel.elemento].slides[0];
  const slide = {...state.elementos[sel.elemento].slides[sel.slide]};
  const estiloAplicavel = obj => {
    var estilo = {...global.estilo[obj], ...elemento.estilo[obj], ...slide.estilo[obj]};
    for (var k of Object.keys(estilo)) {    
      if (k === 'height' || k === 'fontSize' || /padding/.test(k)) {
        estilo[k] = estilo[k]*100 + '%';
      }
    }
    return estilo;
  } 

  var estiloTexto = estiloAplicavel('texto');
  var estiloParagrafo = {...estiloTexto, ...estiloAplicavel('paragrafo')};
  var estiloTitulo = {...estiloTexto, ...estiloAplicavel('titulo')};
  var tipo = state.elementos[sel.elemento].tipo;
  var titulo = capitalize(state.elementos[sel.elemento].titulo, estiloTitulo.caseTexto);

  return {...slide,
    tipo: tipo,
    nomeLongoElemento: getNomeInterfaceTipo(tipo) + ': ' + ((tipo === 'Imagem' && !titulo) ? state.elementos[sel.elemento].imagens[0].alt : titulo),
    selecionado: {...sel},
    textoArray: slide.textoArray.map(t => capitalize(t, estiloParagrafo.caseTexto)),
    titulo: titulo,
    estilo: {
      titulo: {...estiloTitulo},
      paragrafo: {...estiloParagrafo},
      fundo: estiloAplicavel('fundo'), 
      tampao: estiloAplicavel('tampao'),
      texto: estiloTexto,
      imagem: estiloAplicavel('imagem')
    }
  };
}
  

const slideFinal = {
  tipo: '', textoArray: ['Fim da apresentação. Pressione F11 para sair do modo de tela cheia.'],
  titulo: '',
  selecionado: {elemento: 999, slide: 0},
  estilo: {
    titulo: {height: '90%'},
    paragrafo: {fontSize: '150%', color: '#ffffff', fontFamily: 'Helvetica', textAlign: 'center', padding: '0%'},
    fundo: {src:'./Galeria/Fundos/Cor Sólida.jpg'}, 
    tampao: {backgroundColor: '#000000', opacity: '1'},
    texto: {},
    imagem: {}
  }
}

class Exportador extends Component {
    
  constructor (props) {
    super(props);
    this.ref = React.createRef();
    this.state = {slidePreviewFake: true, previews: [], popupConfirmacao: null, callback: null, feito: false};
  } 

  getCopiaDOM = () => {
    this.imagensBase64 = [];
    var sOrdenados = slidesOrdenados(this.props.state.elementos, false);
    this.previews = sOrdenados.map((s, i) => ({...getSlidePreview(this.props.state, s), indice: i}));
    if (this.props.criarSlideFinal) this.previews.push({...slideFinal, indice: this.previews.length});
    this.setState({previews: this.previews.map(s => <Preview slidePreviewFake={s}/>)})
    setTimeout(() => {
      this.copiaDOM = document.cloneNode(true);
      this.getImagensBase64();
    }, 10);
    
  }

  getImagensBase64 = () => {
    var [ uniques, imgsUnique] = [{}, []];
    var i;
    for (var p of this.previews) {
      var imgs = this.copiaDOM.querySelectorAll('#preview-fake' + p.indice + ' img');
      for(i = 0; i < imgs.length; i++) {
        if(!uniques[imgs[i].src]) {
          uniques[imgs[i].src] = 'classeImagem' + i;
          imgsUnique.push(imgs[i]);
        }
        var classe = uniques[imgs[i].src];
        imgs[i].className = classe;
        var classesPai = imgs[i].parentElement.classlist;
        if (classesPai && classesPai.includes('div-imagem-slide')) {
          p.classeImagem = classe;
        } else {
          p.classeImagemFundo = classe;
        }
      }
    }
    for (var j = 0; j < imgsUnique.length; j++) {
      getBase64Image(imgsUnique[j].src, imgsUnique[j].className, imgsUnique.length,
        (dataURL, classe, total, src) => {
          this.imagensBase64.push({data: dataURL, classe: classe});
          if (total === this.imagensBase64.length) {
            var nomeArquivo = getDate() + ' Apresentação.';
            this.state.callback(this.copiaDOM, this.imagensBase64, this.previews, nomeArquivo);
            this.setState({previews: null});
          }
        }
      );
    }
  }

  static getDerivedStateFromProps = (props, state) => {
    if (props.callback && props.callback !== state.callback) {
      return {callback: props.callback, feito: false}
    } 
    return null;
  }

  render() {
    if (this.state.callback && !this.state.feito) {
      this.getCopiaDOM();
      this.setState({feito: true});
    }
    return <>{this.state.previews}</>
  }

}

const mapStateToProps = function (state) {
  return {state: state.present};
}

export default connect(mapStateToProps)(Exportador);