import React, { Component } from 'react';
import BotaoExportador from './BotaoExportador';
import { toggleFullscreen as fullScreen } from '../Preview/Preview';
import { alturaTela } from '../Preview/TamanhoTela/TamanhoTela';
import TratarDadosHTML from './tratarDadosHTML';

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

    if(window.innerHeight > alturaTela -100 && !telaCheiaElemento){
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

  document.getElementById('preview-fake0').classList.add('slide-ativo')
} 

class ExportarHTML extends Component {
    
  constructor (props) {
    super(props);
    var simboloHTML = '</>';
    this.logo = <div id='logo-html'>{simboloHTML}</div>
    this.state = {slidePreviewFake: true, previews: []};
    this.formato = 'html';
    this.script = '' + scriptHTML;
    this.cssImagens = [];
  }

  exportarHTML = (copiaDOM, imagensBase64, _previews, nomeArquivo) => {

    var tratado = TratarDadosHTML(copiaDOM);
    copiaDOM = tratado.copiaDOM;
    var { botaoTelaCheia, setaMovimento } = tratado;
    
    copiaDOM.body.innerHTML = botaoTelaCheia + setaMovimento + copiaDOM.body.innerHTML;
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
    css.innerHTML = this.cssImagens.join('\n');
    copiaDOM.head.appendChild(css);
    var script = copiaDOM.createElement("script");
    script.innerHTML = toggleFullscreen + this.script + 'scriptHTML();'
    copiaDOM.body.appendChild(script);
    this.stringArquivo = copiaDOM.body.parentElement.innerHTML;
    return {nomeArquivo: nomeArquivo + this.formato, arquivo: this.stringArquivo, formato: this.formato};
  }
  
  componentDidUpdate = (prevProps) => {
    if(!prevProps.formatoExportacao && this.props.formatoExportacao === this.formato)
      this.props.definirCallback(this.exportarHTML, true);
  }

  render() {
    return (
      <BotaoExportador formato={this.formato} onClick={() => this.props.definirCallback(this.exportarHTML, true)} 
        logo={this.logo} rotulo={this.formato.toUpperCase()}/>
    )
  }

}

export default ExportarHTML;

