import React, { Component } from 'react';
import Preview, { toggleFullscreen as fullScreen } from '../Preview/Preview'
import Exportador from './Exportador';
import { downloadArquivoTexto, getBase64Image, getDate } from './Exportador';

const toggleFullscreen = fullScreen;

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
  
  window.addEventListener('resize', function(){
    var telaCheiaElemento = !!document.fullscreenElement;
    var botaoAApertar = telaCheiaElemento ? 'Esc' : 'F11';
    var msgFinal = document.getElementById('paragrafo-textoArray-999-0-0');
    var botaoTela = document.getElementById('ativar-tela-cheia')
    msgFinal.innerHTML = msgFinal.innerHTML.replace(/Esc|F11/, botaoAApertar);

    if(window.innerHeight > window.screen.height -100 && !telaCheiaElemento){
      botaoTela.style.display = 'none';
    } else {
      botaoTela.style.display = '';
    }
  });

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

const styleSheet = '.slide-ativo {z-index: 20;}' +
             '.preview-fake {background-color: white; position: absolute}' +
             '#ativar-tela-cheia {opacity: 0.2; right: 4vh; bottom: 4vh; width: 10vh; height: 10vh;}' +
             '#ativar-tela-cheia:hover {opacity: 0.8;}' + 
             '.tampao {z-index: 1;}' + 
             '.texto-preview {z-index: 2;}' +
             '#paragrafo-textoArray-999-0-0 {padding-left: 7vw;}';

class ExportadorHTML extends Component {
    
    constructor (props) {
      super(props);
      this.simboloHTML = '</>';
      this.state = {slidePreviewFake: true, previews: []};
      this.styleSheet = styleSheet;
      this.script = '' + scriptHTML;
      this.cssImagens = [];
    }

    exportarHTML = previews => {
      
      previews.push({
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
        },
        indice: previews.length
      });

      this.setState({previews: previews.map(s => <Preview slidePreviewFake={s}/>)})
      setTimeout(() => {
        this.copiaDOM = document.cloneNode(true);
        var botoesTelaCheia = [...this.copiaDOM.querySelectorAll('#ativar-tela-cheia')];
        var botaoTelaCheia = botoesTelaCheia[0].outerHTML;
        for (var i of botoesTelaCheia) {i.remove();}
        var setasMovimento = [...this.copiaDOM.querySelectorAll('.container-setas')];
        var setaMovimento = setasMovimento[1].outerHTML;
        for (var j of setasMovimento) {j.remove();}
        var slides = [...this.copiaDOM.querySelectorAll('.preview-fake')];
        var slidesHtml = slides.map(s => s.outerHTML);
        this.copiaDOM.body.innerHTML = botaoTelaCheia + setaMovimento + slidesHtml.join('');
        this.cssImagensBase64();
        this.setState({previews: null});    
      }, 10);
    }

    finalizarArquivoExportacao =  () => {
      var imagensDOM = [...this.copiaDOM.querySelectorAll('img')];
      for (var imgDOM of imagensDOM) {
        var span = document.createElement('span');
        span.classList.add(imgDOM.className);
        imgDOM.parentNode.insertBefore(span, imgDOM);
        imgDOM.remove();
      }
      var css = this.copiaDOM.createElement("style");
      css.type = 'text/css';
      css.innerHTML = styleSheet + this.cssImagens.join('\n');
      this.copiaDOM.head.appendChild(css);
      var script = this.copiaDOM.createElement("script");
      script.innerHTML = toggleFullscreen + this.script + 'scriptHTML();'
      this.copiaDOM.body.appendChild(script);
      this.stringArquivo = this.copiaDOM.body.parentElement.innerHTML;
      downloadArquivoTexto(getDate() + ' Apresentação.html', this.stringArquivo);
    }

    cssImagensBase64 = () => {
      var imgs = this.copiaDOM.querySelectorAll('img');
      var [ uniques, imgsUnique, l ] = [{}, [], imgs.length];
      for(var i = 0; i < l; i++) {
        if(!uniques[imgs[i].src]) {
          uniques[imgs[i].src] = 'classeImagem' + i;
          imgsUnique.push(imgs[i]);
        }
        imgs[i].className = uniques[imgs[i].src];
      }
      for (var img of imgsUnique) {
        getBase64Image(img.src, img.className,
          (dataURL, classe) => {
            this.cssImagens.push('.' + classe + '::before{content: url(' + dataURL + '); position: absolute; z-index: 0;}')
            if (this.cssImagens.length === imgsUnique.length) this.finalizarArquivoExportacao();
          }
        );
      }
    }

    render() {
        
        return (
          <>
            <Exportador id='exportar-html' callback={this.exportarHTML} logo={<div id='logo-html'>{this.simboloHTML}</div>} rotulo='HTML'/>
            {this.state.previews}
          </>
        )
    }

}

export default ExportadorHTML;

