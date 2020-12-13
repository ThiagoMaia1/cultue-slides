import React, { Component } from 'react';
import BotaoExportador from '../BotaoExportador';
import { MdFileDownload } from 'react-icons/md';

const downloadArquivoTexto = function(nomeArquivo, conteudoArquivo) {
  let blobx = new Blob([conteudoArquivo], { type: 'text/plain' }); // ! Blob
  let elemx = window.document.createElement('a');
  elemx.href = window.URL.createObjectURL(blobx); // ! createObjectURL
  elemx.download = nomeArquivo;
  elemx.style.display = 'none';
  document.body.appendChild(elemx);
  elemx.click();
  document.body.removeChild(elemx);
}

class ExportarDownload extends Component {

  constructor (props) {
    super(props);
    this.meio = 'download';
  }

  exportarDownload = obj => {
    var { nomeArquivo, arquivo, formato } = obj;
    switch (formato) {
      case 'pptx':
        arquivo.writeFile(nomeArquivo);
        break;
      case 'html':
        downloadArquivoTexto(nomeArquivo, arquivo);
        break;
      case 'pdf':
        arquivo.save(nomeArquivo);
        break;
      default:
        return;
    }   
  }

  componentDidUpdate = (prevProps) => {
    if(!prevProps.formatoExportacao && this.props.formatoExportacao) {
      this.props.definirMeioExportacao(this.exportarDownload, this.props.posicao, this.meio);
    } else if(prevProps.formatoExportacao && !this.props.formatoExportacao) {
      this.props.definirMeioExportacao(null, this.props.posicao, this.meio);
    }
  }

  componentDidMount = () => {
    if (this.props.formatoExportacao)
      this.props.definirMeioExportacao(this.exportarDownload, this.props.posicao, this.meio);
  }

  render() {
    return (
      <BotaoExportador formato={this.meio} onClick={() => this.props.definirMeioExportacao(this.exportarDownload, this.props.posicao, this.meio)} 
        arrow={this.props.posicaoArrow === this.props.posicao} logo={<MdFileDownload size={this.props.tamIcones}/>} rotulo='Baixar'/>
    )
  }

}

export default ExportarDownload;

