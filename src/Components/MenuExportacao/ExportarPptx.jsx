import React, { Component } from 'react';
import BotaoExportador from './BotaoExportador';
import pptxgen from "pptxgenjs";
import { fonteBase, larguraTela, alturaTela } from '../Preview/TamanhoTela/TamanhoTela';

class ExportarPptx extends Component {
    
  constructor (props) {
    super(props);
    this.formato = 'pptx';
    this.logo = (
      <div className='container-logo-pptx'>
        <img id='logo-pptx' className='logo-exportacao' src={require('./Logos/Logo PowerPoint.svg')} alt='Logo PowerPoint'/>
        <div id='exportar-pptx' className='botao-exportar'></div>
      </div>
    )
  }

  exportarPptx = (_copiaDOM, imagensBase64, previews, nomeArquivo) => {
    
    var imagens = imagensBase64.reduce((resultado, img) => {
      resultado[img.classe] = img.data.replace('data:','');
      return resultado;
    }, {});
    let pptx = new pptxgen();
    pptx.defineLayout({name: 'LayoutTela', ...getDimensoesInches(false)});
    pptx.layout = 'LayoutTela';
    var quadro = document.getElementById('preview')
    var alturaQuadro = quadro.offsetHeight;
    var larguraQuadro = quadro.offsetWidth;
    this.taxaPadTop = alturaQuadro/larguraQuadro;

    for (var p of previews) {
      let slide = pptx.addSlide();
      substituirPorcentagensPreview(p.estilo);
      slide.background = ({data: imagens[p.classeImagemFundo], ...getDimensoesInches()});
      if (p.classeImagem) {
        var opcoesImagem = getDimensaoImagem(p.estilo.imagem);
        slide.addImage({data: imagens[p.classeImagem], sizing: {type: 'contain'}, ...opcoesImagem});
      }
      slide.addShape(pptx.ShapeType.rect, 
                     {fill: {
                        color: p.estilo.tampao.backgroundColor.replace('#',''), 
                        transparency: (1-Number(p.estilo.tampao.opacity))*100
                     }, x: 0, y: 0, w: '100%', h: '100%'}
      );
      var opcoesTitulo = {...getDimensaoTitulo(p.estilo.titulo), ...getAtributos(p.estilo.titulo)};
      slide.addText(p.titulo, opcoesTitulo);
      
      var separador = p.tipo === 'TextoBíblico' ? ' ' : '\n\n';
      var texto = p.textoArray.join(separador);
      var opcoesTexto = {...getDimensaoTexto(p.estilo, this.taxaPadTop), ...getAtributos(p.estilo.paragrafo)};
      slide.addText(texto, opcoesTexto);
    }
    return {nomeArquivo: nomeArquivo + this.formato, arquivo: pptx, formato: this.formato}
  }

  componentDidMount = () => {
    if(this.props.formatoExportacao === this.formato)
      this.props.definirCallback(this.exportarPptx);
  }

  render() {
      return (
        <BotaoExportador formato={this.formato} onClick={() => this.props.definirCallback(this.exportarPptx)} 
          logo={this.logo} rotulo='PowerPoint'/>
      )
  }

}

function getDimensaoTitulo(titulo) {
  var x = titulo.paddingRight + '%';
  var y = 0;
  var w = (100 - titulo.paddingRight*2) + '%';
  var h = titulo.height + '%';
  return {x: x, y: y, w: w, h: h, valign: 'center'};
}

function getDimensaoTexto(estilo, taxaPadTop) {
  var titulo = estilo.titulo;
  var paragrafo = estilo.paragrafo;
  var padTop = paragrafo.paddingTop*taxaPadTop;
  var x = paragrafo.paddingRight + '%';
  var y = (titulo.height + padTop) + '%';
  var w = (100 - paragrafo.paddingRight*2) + '%';
  var h = (100 - titulo.height - padTop) + '%';
  return {x: x, y: y, w: w, h: h, valign: 'top'};
}

function getDimensaoImagem(imagem) {
  var x = imagem.padding + '%';
  var y = imagem.padding + '%';
  var w = imagem.width + '%';
  var h = imagem.height + '%';
  return {x: x, y: y, w: w, h: h};
}

function getAtributos(objeto) {
  var atributos = Object.keys(objeto);
  var estilo = {};
  var novoAtributo;
  for (var i = 0; i < atributos.length; i++) {
    if(atributos[i] === 'lineHeight') {
      novoAtributo = converterAtributosPptx(atributos[i], objeto);
    } else {
      novoAtributo = converterAtributosPptx(atributos[i], objeto[atributos[i]]);
    }
    estilo = {...estilo, ...novoAtributo};
  }
  return {...estilo};
}

const correcaoPixels = 0.522694;
const atributosHtmlPptx = {textAlign: v => {
                            if (v === 'justify') v = 'left';
                            return {align: v}},
                           color: v => ({color: v.replace('#', '')}),
                           lineHeight: o => ({lineSpacing: Math.round(o.lineHeight*o.fontSize*correcaoPixels*fonteBase.numero)/100}),
                           fontWeight: v => {if (v > 550) return{bold: true}},
                           fontStyle: v => {if (v === 'italic') return{italic: true}},
                           textDecorationLine: v => {if (v === 'underline') return {underline: true}},
                           fontFamily: v => ({fontFace: v}),
                           fontSize: v => ({fontSize: correcaoPixels*fonteBase.numero*v/100}) 
}

function converterAtributosPptx(atributoHTML, valor) {
  var f = atributosHtmlPptx[atributoHTML];
  if (!!f) return f(valor);
}

function substituirPorcentagensPreview(estilo) {
  var keysEstilo = Object.keys(estilo);
  for (var i of keysEstilo) {
    var atributos = Object.keys(estilo[i]);
    for (var j of atributos) {
      var obj = {};
      if (/%/.test(estilo[i][j])) {
        obj[j] = Number(estilo[i][j].replace('%',''));
        estilo[i] = {...estilo[i], ...obj}; 
      }
    }
  }
}

const getDimensoesInches = (keysAbrev = true) => {
  var divDpi = document.createElement('div');
  divDpi.setAttribute('style', "height: 1in; width: 1in; left: 100%; position: fixed; top: 100%;");
  document.body.appendChild(divDpi);
  var dpi_x = divDpi.offsetWidth;
  var dpi_y = divDpi.offsetHeight;
  var width = larguraTela/dpi_x;
  var height = alturaTela/dpi_y;
  if (keysAbrev) {
    return {w: width, h: height};
  } else {
    return {width: width, height: height}
  }
}

export default ExportarPptx;