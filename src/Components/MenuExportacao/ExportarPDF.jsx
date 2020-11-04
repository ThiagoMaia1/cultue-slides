import React, { Component } from 'react';
import BotaoExportador from './BotaoExportador';
import { jsPDF } from "jspdf";
import TratarDadosHTML from './tratarDadosHTML';
 
class ExportadorPDF extends Component {
    
  constructor (props) {
    super(props);
    this.state = {slidePreviewFake: true, previews: []};
    this.formato = 'pdf';
    this.logo = (
      <img id='logo-pdf' src={require('./Logos/Logo PDF.png')} alt='Logo PDF'></img>
    )
  }

  exportarPDF = (copiaDOM, _imagensBase64, _previews, nomeArquivo) => {
    
    const pdf = new jsPDF(({
      orientation: "landscape",
      unit: "px",
      format: [window.screen.width, window.screen.height]
    }));
    
    copiaDOM = TratarDadosHTML(copiaDOM).copiaDOM;
    // var paginas = copiaDOM.querySelectorAll('.preview-fake');

    pdf.html(copiaDOM.body, {
      callback: function (pdf) {
        pdf.save();
      }
    });
    return {nomeArquivo: nomeArquivo + this.formato, arquivo: pdf, formato: this.formato};
  }

  render() {
    return (
      <BotaoExportador formato={this.formato} onClick={() => this.props.definirCallback(this.exportarPDF)} 
        logo={this.logo} rotulo={this.formato.toUpperCase()}/>
    )
  }

}

export default ExportadorPDF;

