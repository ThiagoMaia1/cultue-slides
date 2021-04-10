import React, { Component } from 'react';
import { connect } from 'react-redux';
import BotaoExportador from '../BotaoExportador';
import { jsPDF } from "jspdf";
import TratarDadosHTML from '../../tratarDadosHTML';
 
class ExportadorPDF extends Component {
    
  constructor (props) {
    super(props);
    this.state = {slidePreviewFake: true, previews: []};
    this.formato = 'pdf';
    this.logo = (
      <img id='logo-pdf' src={require('../../Logos/Logo PDF.png').default} alt='Logo PDF'></img>
    )
  }

  exportarPDF = (copiaDOM, _imagensBase64, _previews, nomeArquivo) => {
    
    const pdf = new jsPDF(({
      orientation: "landscape",
      unit: "px",
      format: [this.props.ratio.width, this.props.ratio.height]
    }));
    
    copiaDOM = TratarDadosHTML(copiaDOM).copiaDOM;

    pdf.html(copiaDOM.body, {
      callback: function (pdf) {
        // pdf.save();
      }
    });
    return {nomeArquivo: nomeArquivo + this.formato, arquivo: pdf, formato: this.formato};
  }

  componentDidUpdate = prevProps => {
    if(!prevProps.formatoExportacao === this.formato && this.props.formatoExportacao === this.formato)
      this.props.definirFormatoExportacao(this.exportarPDF, this.formato);
  }

  componentDidMount = () => {
    if (this.props.formatoExportacao === this.formato)
      this.props.definirFormatoExportacao(this.exportarPDF, this.formato);
  }

  render() {
    return (
      <BotaoExportador formato={this.formato} onClick={() => this.props.definirFormatoExportacao(this.exportarPDF, this.formato)} 
        logo={this.logo} rotulo={this.formato.toUpperCase()} 
        mensagemInativo={'A exportação em PDF ainda não está disponível.\n\n' + 
                         'A exportação em HTML permite a exibição offline da apresentação de maneira leve e sem erros de formatação.'}
      />
    )
  }

}

const mapState = state => (
  {ratio: state.present.ratio}
)

export default connect(mapState)(ExportadorPDF);

