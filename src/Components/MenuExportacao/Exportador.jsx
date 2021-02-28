import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getNomeInterfaceTipo } from '../../principais/Element';
import { capitalize, getImgBase64, parseCorToRgb, rgbObjToStr } from '../../principais/FuncoesGerais';
import SlideFormatado from '../Preview/SlideFormatado'; 

export function getBase64Image(imagem, total, ratio, callback) {
  const img = new Image();
  let est = imagem.estilo;
  img.crossOrigin = 'Anonymous';
  img.onload = () => {
    getImgBase64(
      img, ratio.width, ratio.height, 
      dataURL => callback(dataURL, imagem, total),
      est.borderRadius ? Number(est.borderRadius.replace('px','')) : undefined,
      est.espelhadoHorizontal,
      est.espelhadoVertical
    )
  };

  img.src = imagem.src;
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
        if (!offset && apresentacao && elem[i].eMestre) offset = 1;
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

export function getPreviews(elementos) {
  var sOrdenados = slidesOrdenados(elementos, false);
  let previews = sOrdenados.map((selecionado, indice) => ({ ...getSlidePreview({ elementos, selecionado }), indice }));
  return previews;
}

export function getSlidePreview ({elementos, selecionado}) {
  let el = elementos[selecionado.elemento];
  let s = el.slides[selecionado.slide];
  const global = elementos[0].slides[0];
  const elemento = el.slides[0];
  const slide = {...s};
  const estiloAplicavel = obj => {
    var estilo = {...global.estilo[obj], ...elemento.estilo[obj], ...slide.estilo[obj]};
    for (var k of Object.keys(estilo)) {    
      if (k === 'height' || k === 'width' || k === 'fontSize' || /padding/.test(k)) {
        estilo[k] = estilo[k]*100 + '%';
      }
      if (/[Cc]olor/.test(k)) {
        var cor = estilo[k] || '#ffffff';
        let {r, g, b, a} = parseCorToRgb(cor);
        if (estilo.opacityFundo) a = Number(estilo.opacityFundo);
        if (a === undefined) a = 1;
        estilo[k] = rgbObjToStr({r, g, b, a});
      }
    }
    return estilo;
  }

  var estiloTexto = estiloAplicavel('texto');
  var estiloTitulo = {...estiloTexto, ...estiloAplicavel('titulo')};
  var estiloParagrafo = {...estiloTexto, ...estiloAplicavel('paragrafo')};
  if(estiloTitulo.abaixo) {
    [estiloParagrafo.paddingTop, estiloParagrafo.paddingBottom] = [estiloParagrafo.paddingBottom, estiloParagrafo.paddingTop];
  }
  var { tipo } = el;
  var tituloSlide = s.titulo;
  var titulo = tituloSlide !== undefined ? tituloSlide : el.titulo;
  titulo = capitalize(titulo, estiloTitulo.caseTexto);
  let sAnterior = el.slides[selecionado.slide-1];
  let versoAnterior = tipo === "TextoBíblico" 
                      ? sAnterior ? sAnterior.textoArray.length ? sAnterior.textoArray[sAnterior.textoArray.length-1] : undefined : undefined
                      : undefined

  return {...slide,
    tipo,
    titulo,
    nomeLongoElemento: getNomeInterfaceTipo(tipo) + ': ' + ((tipo === 'Imagem' && !titulo) ? el.imagens[0].alt : titulo),
    selecionado: {...selecionado},
    textoArray: slide.textoArray.map(t => ({...t, texto: capitalize(t.texto, estiloParagrafo.caseTexto)})),
    versoAnterior,
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
  tipo: '', textoArray: [{texto: 'Fim da apresentação. Pressione F11 para sair do modo de tela cheia.'}],
  titulo: '',
  selecionado: {elemento: 999, slide: 0},
  estilo: {
    titulo: {height: '90%'},
    paragrafo: {fontSize: '150%', color: '#ffffff', fontFamily: 'Helvetica', textAlign: 'center', padding: '0%'},
    fundo: {}, 
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
    let ratio = this.props.ratio;
    let previews = getPreviews(this.props.elementos);
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
        this.substituirSpanFinal(copiaDOM);
        this.getImagensBase64(previews, imagensBase64, copiaDOM, ratio, this.callbackMeio, this.props.callbackFormato);
      }, 10);
    }
  }

  substituirSpanFinal = copiaDOM => {
    var spans = [...copiaDOM.querySelectorAll('span')].reverse();
    for (var s of spans) {
      if (s.innerText === slideFinal.textoArray[0].texto) {
        s.id = 'mensagem-slide-final';
        return;
      }
    }
  }

  getImagensBase64 = (previews, imagensBase64, copiaDOM, ratio, callbackMeio, callbackFormato) => {
    var [ uniques, imgsUnique] = [{}, []];
    var nClasses = 0;
    for (let p of previews) {
      let id = '#preview-fake' + p.indice;
      let imgs = [...copiaDOM.querySelectorAll(id + ' .imagem-fundo-preview, ' + id + ' .div-imagem-slide')]
                  .reduce((resultado, i) => {
                    i.src = i.style.backgroundImage.replace('url("', '').split('")')[0];
                    if (/fundo/.test(i.className)) i.eFundo = true;
                    if (i.src) resultado.push(i);
                    return resultado;
                  }, []);
      for(let i = 0; i < imgs.length; i++) {
        if(!uniques[imgs[i].src]) {
          uniques[imgs[i].src] = 'classeImagem' + nClasses;
          nClasses++;
          imgsUnique.push(imgs[i]);
        }
        let classe = uniques[imgs[i].src];
        imgs[i].classList.add(classe);
        imgs[i].classe = classe;
        imgs[i].style.removeProperty('background-image');
        let estilo;
        if (imgs[i].eFundo) {
          p.classeImagemFundo = classe;
          estilo = {};
        } else {
          p.classeImagem = classe;
          estilo = p.estilo.imagem;
        }
        imgs[i].estilo = estilo;
      }
    }

    var nomeArquivo = getDate() + ' Apresentação.';
    
    const chamarCallback = imagens => callbackMeio(callbackFormato(copiaDOM, imagens, previews, nomeArquivo))

    if(!nClasses) chamarCallback([]);

    for (var j = 0; j < imgsUnique.length; j++) {
      getBase64Image(imgsUnique[j], imgsUnique.length, ratio,
        (data, {classe}, total) => {
          imagensBase64.push({data, classe});
          if (total === imagensBase64.length)
            chamarCallback(imagensBase64, previews, nomeArquivo);
        }
      );
    }
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
      <div className='container-preview-invisivel'>
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