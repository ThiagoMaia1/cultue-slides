import React, { Component } from 'react';
import Exportador from './Exportador';
import { downloadArquivoTexto/*, getBase64Image*/, getDate } from './Exportador';

const styleSheet = '.slide-ativo {z-index: 20;}' +
             '.preview-fake {background-color: white; position: absolute}' +
             '#ativar-tela-cheia {opacity: 0.2; right: 4vh; bottom: 4vh; width: 10vh; height: 10vh;}' +
             '#ativar-tela-cheia:hover {opacity: 0.8;}' + 
             '.tampao {z-index: 1;}' + 
             '.texto-preview {z-index: 2;}' +
             '#paragrafo-textoArray-999-0-0 {padding-left: 7vw;}';

class ExportadorPDF extends Component {
    
    constructor (props) {
      super(props);
      this.state = {slidePreviewFake: true, previews: []};
      this.styleSheet = styleSheet;
      this.logo = (
        <img id='logo-pdf' src={require('./Logos/Logo PDF.png')} alt='Logo PDF'></img>
      )
    }

    exportarPDF = previews => {
      
    }
   
    finalizarArquivoExportacao =  () => {
      
      downloadArquivoTexto(getDate() + ' Apresentação.PDF', this.stringArquivo);
    }

    // cssImagensBase64 = () => {
    //   var imgs = this.copiaDOM.querySelectorAll('img');
    //   var [ uniques, imgsUnique, l ] = [{}, [], imgs.length];
    //   for(var i = 0; i < l; i++) {
    //     if(!uniques[imgs[i].src]) {
    //       uniques[imgs[i].src] = 'classeImagem' + i;
    //       imgsUnique.push(imgs[i]);
    //     }
    //     imgs[i].className = uniques[imgs[i].src];
    //   }
    //   for (var img of imgsUnique) {
    //     getBase64Image(img.src, img.className,
    //       (dataURL, classe) => {
    //         this.cssImagens.push('.' + classe + '::before{content: url(' + dataURL + '); position: absolute; z-index: 0;}')
    //         if (this.cssImagens.length === imgsUnique.length) this.finalizarArquivoExportacao();
    //       }
    //     );
    //   }
    // }

    render() {
        return (
          <Exportador id='exportar-pdf' callback={this.exportarPDF} logo={this.logo} rotulo='PDF'/>
        )
    }

}

export default ExportadorPDF;

