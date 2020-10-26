import React, { Component } from 'react';
import { connect } from 'react-redux';
import { capitalize } from './Element';
import Preview from './Components/Preview/Preview'
import { proporcaoPadTop } from './Element';

export function selecionadoOffset (elementos, selecionado, offset, apresentacao = undefined) {
    if (apresentacao === undefined) apresentacao = !!document.fullscreenElement; 
    var elem = elementos.flatMap((e, i) => { 
      return e.slides.map((s, j) => ({elemento: i, slide: j, eMestre: s.eMestre})); //Gera um array ordenado com todos os slides que existem representados por objetos do tipo "selecionado".
    })
    for (var i = 0; i < elem.length; i++) { //Acha o selecionado atual.
      if (elem[i].elemento === selecionado.elemento && elem[i].slide === selecionado.slide) {
        var novoIndex = i + offset;
        if (novoIndex < 0) {
          novoIndex = 0;
        } else if (novoIndex >= elem.length) { 
          novoIndex = elem.length-1;
        }
        if (apresentacao) { //Se for slide mestre, pula um a mais pra frente ou pra trás com base no offset informado.
          while (elem[novoIndex].eMestre) {
            offset = offset > 0 ? 1 : -1;
            novoIndex += offset;
            if (novoIndex >= elem.length || novoIndex <= 0) {
              novoIndex = i;
              offset = -offset; 
            }
          }
        }         
        break;
      }
    }
    return {elemento: elem[novoIndex].elemento, slide: elem[novoIndex].slide};
}

export function getSlidePreview (state, selecionado = null) {
    const sel = selecionado || state.selecionado;
    const global = state.elementos[0].slides[0];
    const elemento = state.elementos[sel.elemento].slides[0];
    const slide = state.elementos[sel.elemento].slides[sel.slide];
  
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
      texto: capitalize(slide.texto, estiloParagrafo.caseTexto),
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

class ExportadorHTML extends Component {
    
    constructor (props) {
      super(props);
      this.ref = React.createRef();
      this.simboloHTML = '</>';
      this.state = {slidePreviewFake: true};
    }

    exportarHTML = () => {
      var e = {elemento: 0, slide: 0};
      var eAnt = {};
      this.stringArquivo = document.body.parentElement.innerHTML.split(/(?<=<\/head>)/g)[0] + '<body>';
      while (!(e.elemento === eAnt.elemento && e.slide === eAnt.slide)) {
        eAnt = {...e};
        e = selecionadoOffset(this.props.state.elementos, e, 1, true);
        this.setState({slidePreviewFake: getSlidePreview(this.props.state, e)});
        this.stringArquivo = this.stringArquivo + this.ref.current.outerHTML;
      }
      console.log(this.stringArquivo + '</body>');
    }

    {/* <img id=imageid src=https://www.google.de/images/srpr/logo11w.png>
JavaScript

function getBase64Image(img) {
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  var dataURL = canvas.toDataURL("image/png");
  return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

var base64 = getBase64Image(document.getElementById("imageid")); */}

    render() {
        
        return (
          <div className='div-botao-exportar' onClick={this.exportarHTML}> 
            <button id='exportar-html' className='botao-exportar sombrear-selecao'><div id='logo-html'>{this.simboloHTML}</div></button>
            <div className='rotulo-botao-exportar'>HTML</div>
            <Preview refPreview={this.ref} slidePreviewFake={this.state.slidePreviewFake}/>
          </div>
        )
    }

}

const mapStateToProps = function (state) {
    return {state: state}
}

export default connect(mapStateToProps)(ExportadorHTML);

