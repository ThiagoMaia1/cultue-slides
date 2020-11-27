import React, { Component } from 'react';
import { alturaTela, larguraTela } from '../Preview/TamanhoTela/TamanhoTela'
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
      format: [larguraTela, alturaTela]
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

  componentDidUpdate = (prevProps) => {
    if(!prevProps.formatoExportacao === this.formato && this.props.formatoExportacao === this.formato)
      this.props.definirCallback(this.exportarPDF);
  }

  componentDidMount = () => {
    if (this.props.formatoExportacao === this.formato)
      this.props.definirCallback(this.exportarPDF);
  }

  render() {
    return (
      <BotaoExportador formato={this.formato} onClick={() => this.props.definirCallback(this.exportarPDF)} 
        logo={this.logo} rotulo={this.formato.toUpperCase()}/>
    )
  }

}
export default ExportadorPDF;

