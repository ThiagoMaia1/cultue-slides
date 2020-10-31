import React, { Component } from 'react';
import { connect } from 'react-redux';
import { capitalize } from '../../Element';
import { proporcaoPadTop } from '../../Element';
import PopupConfirmacao from '../Configurar/Popup/PopupConfirmacao';
import Preview from '../Preview/Preview'

export const downloadArquivoTexto = function(nomeArquivo, conteudoArquivo) {
  let blobx = new Blob([conteudoArquivo], { type: 'text/plain' }); // ! Blob
  let elemx = window.document.createElement('a');
  elemx.href = window.URL.createObjectURL(blobx); // ! createObjectURL
  elemx.download = nomeArquivo;
  elemx.style.display = 'none';
  document.body.appendChild(elemx);
  elemx.click();
  document.body.removeChild(elemx);
}

export function getBase64Image(src, classe, total, callback) {
  const img = new Image();
  img.crossOrigin = 'Anonymous';
  img.onload = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    let dataURL;
    var iw = img.width;
    var ih = img.height;
    var minW = window.screen.width;
    var minH = window.screen.height;
    var scale = Math.max((minW/iw), (minH/ih));
    var iwScaled = iw*scale;
    var ihScaled = ih*scale;
    canvas.width = iwScaled;
    canvas.height = ihScaled;
    ctx.drawImage(img, (minW - iwScaled)/2, (minH - ihScaled)/2, iwScaled, ihScaled);
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

  var estiloTexto = {...global.estilo.texto, ...elemento.estilo.texto, ...slide.estilo.texto};
  //Pra dividir o padding-top.
  var estiloParagrafo = {...estiloTexto, ...global.estilo.paragrafo, ...elemento.estilo.paragrafo, ...slide.estilo.paragrafo};
  var estiloTitulo = {...estiloTexto, ...global.estilo.titulo, ...elemento.estilo.titulo, ...slide.estilo.titulo};
  var tipo = state.elementos[sel.elemento].tipo;
  var titulo = capitalize(state.elementos[sel.elemento].titulo, estiloTitulo.caseTexto);

  return {tipo: tipo,
    nomeLongoElemento: tipo.replace('-', ' ') + ': ' + ((tipo === 'Imagem' && !state.elementos[sel.elemento].titulo) ? state.elementos[sel.elemento].imagens[0].alt : state.elementos[sel.elemento].titulo),
    nomeLongoSlide: '',
    selecionado: {...sel},
    textoArray: slide.textoArray.map(t => capitalize(t, estiloParagrafo.caseTexto)),
    titulo: titulo,
    eMestre: slide.eMestre,
    imagem: slide.imagem,
    estilo: {
      titulo: {...estiloTitulo, ...getEstiloPad(estiloTitulo, 'titulo'), fontSize: estiloTitulo.fontSize*100 + '%', height: estiloTitulo.height*100 + '%'},
      paragrafo: {...getEstiloPad(estiloParagrafo, 'paragrafo'), fontSize: estiloParagrafo.fontSize*100 + '%'},
      fundo: {...global.estilo.fundo, ...elemento.estilo.fundo, ...slide.estilo.fundo}, 
      tampao: {...global.estilo.tampao, ...elemento.estilo.tampao, ...slide.estilo.tampao},
      texto: {...estiloTexto},
      imagem: {...global.estilo.imagem, ...elemento.estilo.imagem, ...slide.estilo.imagem}
    }
  };
}
  
function getEstiloPad (estilo, objeto) {
    var pad = estilo.padding*100; //Separa o padding para o padding-top ser diferente, proporcional à constante proporcaoPadTop.
    var rep;
    var padTop;
    if (objeto === 'titulo') {
      [ rep, padTop ] = [ 1, 0 ];
    } else {
      rep = 3;
      padTop = pad*proporcaoPadTop || '0.5';
    }
    return {...estilo, padding: String(padTop).substr(0, 5) + ('% ' + pad).repeat(rep) + '%'};
}

const slideFinal = {
  tipo: '', textoArray: ['Fim da apresentação. Pressione F11 para sair do modo de tela cheia.'],
  titulo: '',
  selecionado: {elemento: 999, slide: 0},
  estilo: {
    titulo: {paddingTop: '52%'},
    paragrafo: {fontSize: '150%', color: '#ffffff', fontFamily: 'Helvetica', textAlign: 'center'},
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
    this.state = {slidePreviewFake: true, previews: [], popupConfirmacao: null};
    this.imagensBase64 = [];
  } 

  conferirClick = () => {
    if (this.props.exportavel) {
        this.getCopiaDom();
    } else {
        this.setState({popupConfirmacao: (
            <PopupConfirmacao titulo='Apresentação Vazia' botoes='OK'
                            pergunta={'Insira pelo menos um slide antes de exportar.'} 
                            callback={() => this.setState({popupConfirmacao: null})}/>
        )});
    }
  }

  getCopiaDom = () => {
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
            var nomeArquivo = getDate() + ' Apresentação.' + this.props.formato;
            this.props.callback(this.copiaDOM, this.imagensBase64, this.previews, nomeArquivo);
            this.setState({previews: null});
          }
        }
      );
    }
  }

  render() {
      return (
        <>
          {this.state.previews}
          {this.state.popupConfirmacao}
          <div className='div-botao-exportar' onClick={this.conferirClick}> 
            <button id={'exportar-' + this.props.formato} className='botao-exportar sombrear-selecao'>{this.props.logo}</button>
            <div className='rotulo-botao-exportar'>{this.props.rotulo}</div>
          </div>
        </>
      )
  }

}

const mapStateToProps = function (state) {
  state = state.present;
  return {state: state, exportavel: state.elementos.length > 1};
}

export default connect(mapStateToProps)(Exportador);

