import React, { Component } from 'react';
import Exportador from './Exportador';
import pptxgen from "pptxgenjs";

const atributosHtmlPptx = {textAlign: v => {
                            if (v = 'justify') v = 'left';
                            return {align: v}},
                           padding: v => ({margin: v}),
                           color: v => ({color: v.replace('#')}),
                           lineHeight: v => ({lineSpacing: v*255 + 1}),
                           textWeight: v => {if (v > 550) return{bold: true}},
                           fontStyle: v => {if (v === 'italic') return{italic: true}},
                           textDecorationLine: v => {if (v === 'underline') return {underline: true}},
                           fontFamily: v => ({fontFace: v})
}

function converterAtributosPptx(atributoHTML, valor) {
  var f = atributosHtmlPptx[atributoHTML];
  if (!!f) return f(valor);
}

class ExportarPptx extends Component {
    
  constructor (props) {
    super(props);
    this.logo = (
      <div className='container-logo-pptx'>
        <img id='logo-pptx' className='logo-exportacao' src={require('./Logos/Logo PowerPoint.svg')} alt='Logo PowerPoint'/>
        <div id='exportar-pptx' className='botao-exportar'></div>
      </div>
    )
  }

  exportarPptx = (_copiaDOM, imagensBase64, previews, nomeArquivo) => {
    
    var imagens = imagensBase64.reduce((resultado, img) => {
      resultado[img.classe] = img.data;
      return resultado;
    }, {});
    let pptx = new pptxgen();
    // pptx.defineLayout({name: 'LayoutTela', ...this.getDimensoesInches()});
    // pptx.layout = 'LayoutTela';
    //todo: melhorar isso.

    for (var p of previews) {
      let slide = pptx.addSlide();
      slide.background = {data: imagens[p.classeImagemFundo], sizing: {type: 'cover'}};
      if (p.classeImagem) {
        slide.addImage({data: imagens[p.classeImagemFundo], sizing: {type: 'cover'}});
      }
      var atributosTitulo = Object.keys(p.estilo.titulo);
      var estiloTitulo = {};
      for (var i = 0; i < atributosTitulo.length; i++) {
        estiloTitulo = {...estiloTitulo, ...converterAtributosPptx(atributosTitulo[i], p.estilo.titulo[atributosTitulo[i]])};
      }
      slide.addText(p.titulo, estiloTitulo);
      slide.addText(p.textoArray.join(' '));
    }
    pptx.writeFile(nomeArquivo);
  }

  getDimensoesInches = () => {
    var divDpi = document.createElement('div');
    divDpi.setAttribute('style', "height: 1in; width: 1in; left: 100%; position: fixed; top: 100%;");
    var dpi_x = divDpi.offsetWidth;
    var dpi_y = divDpi.offsetHeight;
    var width = window.screen.width/dpi_x;
    var height = window.screen.height/dpi_y;
    return {width: width, height: height};
  }

  render() {
      return (
        <Exportador formato='pptx' callback={this.exportarPptx} logo={this.logo} rotulo='PowerPoint'/>
      )
  }

}

export default ExportarPptx;

