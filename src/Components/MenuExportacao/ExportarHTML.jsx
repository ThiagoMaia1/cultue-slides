import React, { Component } from 'react';
import Exportador from './Exportador';
import { downloadArquivoTexto, getDate } from './Exportador';
import { toggleFullscreen as fullScreen } from '../Preview/Preview'

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
             '#paragrafo-textoArray-999-0-0 {padding-left: 5.5vw;}';

class ExportarHTML extends Component {
    
    constructor (props) {
      super(props);
      var simboloHTML = '</>';
      this.logo = <div id='logo-html'>{simboloHTML}</div>
      this.state = {slidePreviewFake: true, previews: []};
      this.styleSheet = styleSheet;
      this.script = '' + scriptHTML;
      this.cssImagens = [];
    }

    exportarHTML = (copiaDOM, imagensBase64, _previews, nomeArquivo) => {

      var botoesTelaCheia = [...copiaDOM.querySelectorAll('#ativar-tela-cheia')];
      var botaoTelaCheia = botoesTelaCheia[0].outerHTML;
      for (var i of botoesTelaCheia) {i.remove();}
      var setasMovimento = [...copiaDOM.querySelectorAll('.container-setas')];
      var setaMovimento = setasMovimento[1].outerHTML;
      for (var j of setasMovimento) {j.remove();}
      var slides = [...copiaDOM.querySelectorAll('.preview-fake')];
      var slidesHtml = slides.map(s => s.outerHTML);
      copiaDOM.body.innerHTML = botaoTelaCheia + setaMovimento + slidesHtml.join('');
      for (var img of imagensBase64) { //Criar o css para as imagens.
        var { classe, data } = img;
        this.cssImagens.push('.' + classe + '::before{content: url(' + data + '); position: absolute; z-index: 0;}')
      }
      var imagensDOM = [...copiaDOM.querySelectorAll('img')]; //Substituir Imagens por spans, para que o fundo seja definido pelo css.
      for (var imgDOM of imagensDOM) {
        var span = document.createElement('span');
        span.classList.add(imgDOM.className);
        imgDOM.parentNode.insertBefore(span, imgDOM);
        imgDOM.remove();
      }
      var css = copiaDOM.createElement("style"); //Inserir arquivo CSS no DOM.
      css.type = 'text/css';
      css.innerHTML = styleSheet + this.cssImagens.join('\n');
      copiaDOM.head.appendChild(css);
      var script = copiaDOM.createElement("script");
      script.innerHTML = toggleFullscreen + this.script + 'scriptHTML();'
      copiaDOM.body.appendChild(script);
      this.stringArquivo = copiaDOM.body.parentElement.innerHTML;
      downloadArquivoTexto(nomeArquivo, this.stringArquivo);
    }

    render() {
        
        return (
          <Exportador formato='html' callback={this.exportarHTML} logo={this.logo} rotulo='HTML' criarSlideFinal={true}/>
        )
    }

}

export default ExportarHTML;

