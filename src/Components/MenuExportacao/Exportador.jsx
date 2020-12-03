import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getNomeInterfaceTipo } from '../../Element';
import { capitalize } from '../../FuncoesGerais';
import SlideFormatado from '../Preview/SlideFormatado'; 

export function getBase64Image(src, classe, total, ratio, callback) {
  const img = new Image();
  img.crossOrigin = 'Anonymous';
  img.onload = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    let dataURL;
    var iw = img.width;
    var ih = img.height;
    var windowW = ratio.width;
    var windowH = ratio.height;
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

export function selecionadoOffset (elementos, selecionado, offset, apresentacao) {
    if (apresentacao === undefined) apresentacao = !!document.fullscreenElement; 
    if (elementos.length === 1) apresentacao = false;
    var elem = slidesOrdenados(elementos, !apresentacao, selecionado);
    for (var i = 0; i < elem.length; i++) { //Acha o selecionado atual.
      if (elem[i].elemento === selecionado.elemento && elem[i].slide === selecionado.slide) {
        if (!offset && elem[i].eMestre) offset = 1;
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

export const slidesOrdenados = (elementos, incluirMestre = false, selecionado = {}) => {
  var elem = elementos.flatMap((e, i) => { 
    return e.slides.map((s, j) => ({elemento: i, slide: j, eMestre: s.eMestre, colapsado: e.colapsado})); //Gera um array ordenado com todos os slides que existem representados por objetos do tipo "selecionado".
  })
  const eElementoSelecionado = e => (e.elemento === selecionado.elemento && e.slide === selecionado.slide);
  if (!incluirMestre) {
    elem = elem.filter(e => (!(e.eMestre) || eElementoSelecionado(e)));
  } else {
    elem = elem.filter(e => (!(e.colapsado && e.slide > 0) || eElementoSelecionado(e)));
  }
  return elem;
}

export function getSlidePreview ({elementos, selecionado}) {
  const global = elementos[0].slides[0];
  const elemento = elementos[selecionado.elemento].slides[0];
  const slide = {...elementos[selecionado.elemento].slides[selecionado.slide]};
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
  var tipo = elementos[selecionado.elemento].tipo;
  var titulo = capitalize(elementos[selecionado.elemento].titulo, estiloTitulo.caseTexto);

  return {...slide,
    tipo: tipo,
    nomeLongoElemento: getNomeInterfaceTipo(tipo) + ': ' + ((tipo === 'Imagem' && !titulo) ? elementos[selecionado.elemento].imagens[0].alt : titulo),
    selecionado: {...selecionado},
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
    this.state = {previews: []};
  }

  getCopiaDOM = () => {
    document.body.style.cursor = 'progress';
    var imagensBase64 = [];
    var sOrdenados = slidesOrdenados(this.props.elementos, false);
    var ratio = this.props.ratio;
    var previews = sOrdenados.map((s, i) => ({...getSlidePreview({elementos: this.props.elementos, selecionado: s}), indice: i}));
    if (this.props.criarSlideFinal) previews.push({...slideFinal, indice: previews.length});
    this.setState({previews: previews.map((s, i) => 
      <SlideFormatado slidePreview={s}
        id={'preview-fake' + i}
        className='preview-fake'
        editavel={false}
        proporcao={1}
        key={i}
      />)
    })
    if (this.props.meio === 'link') {
      this.callbackMeio({formato: this.props.formato});
    } else {
      setTimeout(() => {
        var copiaDOM = document.cloneNode(true);
        var spans = copiaDOM.querySelectorAll('span');
        for (var s of spans) {
          if (s.innerText === slideFinal.textoArray[0]) {
            s.id = 'mensagem-slide-final';
            break;
          }
        }
        this.getImagensBase64(previews, imagensBase64, copiaDOM, ratio, this.callbackMeio, this.props.callbackFormato);
      }, 10);
    }
  }

  getImagensBase64 = (previews, imagensBase64, copiaDOM, ratio, callbackMeio, callbackFormato) => {
    var [ uniques, imgsUnique] = [{}, []];
    var i;
    setTimeout(() => {
      for (var p of previews) {
        var imgs = copiaDOM.querySelectorAll('#preview-fake' + p.indice + ' img');
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
        getBase64Image(imgsUnique[j].src, imgsUnique[j].className, imgsUnique.length, ratio,
          (dataURL, classe, total, src) => {
            imagensBase64.push({data: dataURL, classe: classe});
            if (total === imagensBase64.length) {
              var nomeArquivo = getDate() + ' Apresentação.';
              callbackMeio(callbackFormato(copiaDOM, imagensBase64, previews, nomeArquivo));
            }
          }
        );
      }
    }, 1000);
  }

  finalizar = () => {
    document.body.style.cursor = 'default';
    this.setState({previews: null});
  }

  componentDidUpdate = (prevProps) => {
    const p = this.props;
    if (p.callbackMeio && p.callbackFormato && p.chamada !== prevProps.chamada) {
      this.callbackMeio = obj => {
        this.props.callbackMeio(obj)
        this.finalizar();
      }
      this.getCopiaDOM();
    }
  }

  
  componentWillUnmount = () => {
    this.finalizar();
  }

  render() {
    return (
      <div style={{width: '0px', height: '0px', overflow: 'hidden', opacity: 0}}>
        {this.state.previews}
      </div>
    )
  }

}

const mapState = function (state) {
  const sP = state.present;
  return {elementos: sP.elementos, ratio: sP.ratio};
}

export default connect(mapState)(Exportador);