import React, { Component } from 'react';
import { connect } from 'react-redux';
import { capitalize } from './Element';
import Preview, { toggleFullscreen as fullScreen } from './Components/Preview/Preview'
import { proporcaoPadTop } from './Element';

const toggleFullscreen = fullScreen;

const downloadArquivoTexto = function(nomeArquivo, conteudoArquivo) {
  let blobx = new Blob([conteudoArquivo], { type: 'text/plain' }); // ! Blob
  let elemx = window.document.createElement('a');
  elemx.href = window.URL.createObjectURL(blobx); // ! createObjectURL
  elemx.download = nomeArquivo;
  elemx.style.display = 'none';
  document.body.appendChild(elemx);
  elemx.click();
  document.body.removeChild(elemx);
}

function getBase64Image(img) {
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  return canvas.toDataURL("image/png");
  //return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

const getDate = function() {
  var data = new Date(); 
  return data.getFullYear() +  
         String((data.getMonth()+1)).padStart(2,'0') + 
         String(data.getDate()).padStart(2,'0') + ' ' +
         String(data.getHours()).padStart(2,'0') + "h" +   
         String(data.getMinutes()).padStart(2,'0') + "m" + 
         String(data.getSeconds()).padStart(2,'0') + 's';
}

function scriptHTML () {

  function offsetSlide(offset) {
    var [ classAtivo, idPreviewFake ] = [ 'slide-ativo', 'preview-fake']
    var atual = document.getElementsByClassName(classAtivo)[0];
    var n = Number(atual.id.replace(idPreviewFake, "")) + offset;
    var novo = document.getElementById(idPreviewFake + n);
    if (novo) {
      novo.classList.add(classAtivo);
      atual.classList.remove(classAtivo);
    }
  }

  function alternarTransparenciaBotao() {
    document.getElementById('ativar-tela-cheia').style.opacity = document.fullscreenElement ? '0' : '';
  }
  
  document.addEventListener("click", function (event) {
    var el = event.target;
    if (el.matches(".movimentar-slide")) {
      if (el.matches(".esquerda")) {
        offsetSlide(-1);
      } else {
        offsetSlide(1);
      }
    }
    if (el.parentElement.matches('#ativar-tela-cheia')) {
      alternarTransparenciaBotao();
      toggleFullscreen(document.body);
    }
  }, false);

  document.addEventListener('fullscreenchange', alternarTransparenciaBotao, false);

  document.addEventListener("keydown", function (event) {
    switch (event.code) {
      case 'ArrowLeft':
      case 'ArrowUp':
        offsetSlide(-1);
        break;
      case 'Enter':
      case 'Space':
      case 'ArrowRight':
      case 'ArrowDown':
        offsetSlide(1);
        break;
      case 'Escape':
        if (document.fullscreenElement) toggleFullscreen();
        break;
      default:
        break;
    }
  }, false);
} 

const styleSheet = '.slide-ativo {z-index: 39;}' +
             '.preview-fake {background-color: white; position: absolute}' +
             '#ativar-tela-cheia {opacity: 0.2; right: 4vh; bottom: 4vh; width: 10vh; height: 10vh;}' +
             '#ativar-tela-cheia:hover {opacity: 0.8;}';

export function selecionadoOffset (elementos, selecionado, offset, apresentacao = undefined) {
    if (apresentacao === undefined) apresentacao = !!document.fullscreenElement; 
    if (elementos.length === 1) apresentacao = false;
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
      this.state = {slidePreviewFake: true, previews: []};
      this.styleSheet = styleSheet;
      this.script = '' + scriptHTML;
    }

    exportarHTML = () => {
      var e = {elemento: 0, slide: 0};
      var eAnt = {};
      var contador = 1;
      var imagens = [];
      var previews = [];
      
      while (!(e.elemento === eAnt.elemento && e.slide === eAnt.slide)) {
        eAnt = {...e};
        e = selecionadoOffset(this.props.state.elementos, e, 1, true);
        previews.push({...getSlidePreview(this.props.state, e), indice: contador});
        contador++;
      }
      
      previews.push({
        tipo: '', texto: 'Fim da apresentação. Pressione F11 para sair do modo de tela cheia.',
        titulo: '',
        selecionado: {elemento: 999, slide: 0},
        estilo: {
          titulo: {paddingTop: '50%'},
          paragrafo: {fontSize: '150%', color: '#ffffff', fontFamily: 'Helvetica', textAlign: 'center'},
          fundo: {src:'./Galeria/Fundos/Cor Sólida.jpg'}, 
          tampao: {backgroundColor: '#000000', opacity: '1'},
          texto: {},
          imagem: {}
        },
        indice: contador
      });

      this.setState({previews: previews.map(s => <Preview slidePreviewFake={s}/>)})
      setTimeout(() => {
        console.log(this.pegarImagensRelevantes());
        this.stringArquivo = document.body.parentElement.innerHTML;
        var htmlSlides = this.stringArquivo.match(/<div id="preview-fake.*<span id="marcador-fim-slides"><\/span>/)[0];
        htmlSlides = htmlSlides.replace(/<div class="borda-slide-mestre".*?>/g,'');
        htmlSlides = htmlSlides.replace(/<div id="texto-slide-mestre".*?<\/div>/g,'');
        var botaoTelaCheia = htmlSlides.match(/<button id="ativar-tela-cheia".*?<\/button>/)[0].replace(/style=".*?"/,'');
        htmlSlides = htmlSlides.replace(/<button id="ativar-tela-cheia".*?<\/button>/g,'');
        this.stringArquivo = this.stringArquivo.split('<div id="root">')[0];
        this.stringArquivo = this.stringArquivo.replace('</style><style type="text/css">', '');
        this.stringArquivo = this.stringArquivo.replace('<style type="text/css">', '<style type="text/css">' + this.styleSheet)
        var script = '<script>' + toggleFullscreen + this.script + '\n scriptHTML(); </script>';
        this.stringArquivo = this.stringArquivo + botaoTelaCheia + htmlSlides + script + '</body>';
        downloadArquivoTexto(getDate() + ' Apresentação.html', this.stringArquivo);
      }, 10);
    }

    pegarImagensRelevantes= () => {
      var imgs = document.querySelectorAll('.preview-fake img');
      var [ uniques, imgsUnique, l ] = [{}, [], imgs.length];
      for(var i=0; i<l; i++) {
        if(uniques[imgs[i].src]) continue;
        uniques[imgs[i].src] = true;
        imgsUnique.push(imgs[i]);
      }
      return imgsUnique.map(i => ({base64: getBase64Image(i), src: i.src}));
    }

    render() {
        
        return (
          <div className='div-botao-exportar' onClick={this.exportarHTML}> 
            <button id='exportar-html' className='botao-exportar sombrear-selecao'><div id='logo-html'>{this.simboloHTML}</div></button>
            <div className='rotulo-botao-exportar'>HTML</div>
            {this.state.previews}
            {/* <Preview refPreview={this.ref} slidePreviewFake={this.state.slidePreviewFake}/> */}
          </div>
        )
    }

}

const mapStateToProps = function (state) {
    return {state: state}
}

export default connect(mapStateToProps)(ExportadorHTML);

