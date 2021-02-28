import React, { Component } from 'react';
import BotaoExportador from '../BotaoExportador';
import { toggleFullscreen as fullScreen } from '../../../../principais/FuncoesGerais';
import TratarDadosHTML from '../../tratarDadosHTML';
import { getCssFontesBase64 } from '../../ModulosFontes';

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
    var botaoTela = document.getElementById('ativar-tela-cheia')
    var msgFinal = document.getElementById('mensagem-slide-final');
    if (msgFinal)
      msgFinal.innerHTML = msgFinal.innerHTML.replace(/Esc|F11/, botaoAApertar);

    if(window.innerHeight > window.screen.height -100 && !telaCheiaElemento){
      botaoTela.style.display = 'none';
    } else {
      botaoTela.style.display = '';
    }
    adicionarEstiloTamanho();
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
    let bloqueador;
    let idBloqueador = 'bloqueador-';
    let classe = 'bloqueador-ativo';
    let ativo = document.getElementsByClassName(classe)[0];
    if (ativo) ativo.classList.remove(classe);
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
      case 'KeyB':
        bloqueador = document.getElementById(idBloqueador + 'preto');
        break
      case 'KeyW':
        bloqueador = document.getElementById(idBloqueador + 'branco');
        break;
      default:
        break;
    }
    if (bloqueador) if (ativo !== bloqueador) bloqueador.classList.add(classe);
  }, false);

  document.getElementById('preview-fake0').classList.add('slide-ativo')

  function adicionarEstiloTamanho() {
    let sheets = document.styleSheets;
    let rule;
    for (let i = sheets.length -1; i >= 0; i--) {
      if(sheets[i].cssRules.length) {
        rule = sheets[i].cssRules[0];
        if (rule.selectorText === '.preview-fake') break;
      }
    }
    let slide = document.getElementById('preview-fake0');
    let quadro = document.getElementById('container-apresentacao');
    let scale = Math.min(quadro.offsetWidth/slide.offsetWidth, quadro.offsetHeight/ slide.offsetHeight);
    rule.style.transform = 'scale(' + scale + ')';
    rule.style.transformOrigin = 'center';
  }
    
  adicionarEstiloTamanho();
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

  exportarHTML = (copiaDOM, imagensBase64, previews, nomeArquivo) => {

    var tratado = TratarDadosHTML(copiaDOM);
    copiaDOM = tratado.copiaDOM;
    copiaDOM = getCssFontesBase64(copiaDOM, previews);
    var { botaoTelaCheia, setaMovimento } = tratado;
    
    
    copiaDOM.body.innerHTML = '<div id="bloqueador-branco" class="bloqueador-apresentacao"></div>'+
                              '<div id="bloqueador-preto" class="bloqueador-apresentacao"></div>' + 
                              botaoTelaCheia + setaMovimento + 
                              '<div id="container-apresentacao">' + copiaDOM.body.innerHTML + '</div>';
    for (var img of imagensBase64) { //Criar o css para as imagens.
      var { classe, data} = img;
      this.cssImagens.push('.' + classe + '{background-image: url(' + data + ');}');
    }
    var css = copiaDOM.createElement("style"); //Inserir arquivo CSS no DOM.
    css.type = 'text/css';
    css.innerHTML = this.cssImagens.join('\n');
    copiaDOM.head.appendChild(css);
    var script = copiaDOM.createElement("script");
    script.innerHTML = toggleFullscreen + this.script + 'scriptHTML();'
    copiaDOM.body.appendChild(script);
    copiaDOM.body.style.removeProperty('cursor');
    this.stringArquivo = copiaDOM.body.parentElement.innerHTML;
    return {nomeArquivo: nomeArquivo + this.formato, arquivo: this.stringArquivo, formato: this.formato};
  }
  
  componentDidUpdate = prevProps => {
    if(!prevProps.formatoExportacao === this.formato && this.props.formatoExportacao === this.formato)
      this.props.definirFormatoExportacao(this.exportarHTML, this.formato, true);
  }

  componentDidMount = () => {
    if (this.props.formatoExportacao === this.formato)
      this.props.definirFormatoExportacao(this.exportarHTML, this.formato, true);
  }

  render() {
    return (
      <BotaoExportador formato={this.formato} onClick={() => this.props.definirFormatoExportacao(this.exportarHTML, this.formato, true)} 
        logo={this.logo} rotulo={this.formato.toUpperCase()}/>
    )
  }

}

export default ExportarHTML;

