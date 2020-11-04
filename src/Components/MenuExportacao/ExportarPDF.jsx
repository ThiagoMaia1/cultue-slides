import React, { Component } from 'react';
import BotaoExportador from './BotaoExportador';

class ExportadorPDF extends Component {
    
  constructor (props) {
    super(props);
    this.state = {slidePreviewFake: true, previews: []};
    this.formato = 'pdf';
    this.logo = (
      <img id='logo-pdf' src={require('./Logos/Logo PDF.png')} alt='Logo PDF'></img>
    )
  }

  exportarPDF = (_copiaDOM, _imagensBase64, _previews, nomeArquivo) => {
  
    return {nomeArquivo: nomeArquivo + this.formato, conteudoArquivo: {}};
  }

  render() {
    return (
      <BotaoExportador formato={this.formato} onClick={() => this.props.definirCallback(this.exportarPDF)} 
        logo={this.logo} rotulo={this.formato.toUpperCase()}/>
    )
  }

}

export default ExportadorPDF;

