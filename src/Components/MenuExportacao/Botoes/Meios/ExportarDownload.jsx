import React, { Component } from 'react';
import { connect } from 'react-redux';
import BotaoExportador from '../BotaoExportador';
import { MdFileDownload } from 'react-icons/md';
import { getPreviews } from '../../Exportador';
import { getFontesUsadas, getZipFontes } from '../../ModulosFontes';
import { downloadArquivoTexto, downloadArquivo } from '../../../../principais/FuncoesGerais';

class ExportarDownload extends Component {

  constructor (props) {
    super(props);
    this.meio = 'download';
  }

  exportarDownload = ({ nomeArquivo, arquivo, formato }) => {
    switch (formato) {
      case 'pptx':
        arquivo.writeFile(nomeArquivo);
        let previews = getPreviews(this.props.elementos);
        let fontesEspeciais = getFontesUsadas(previews).google;
        getZipFontes(
          fontesEspeciais || [], 
          blob => downloadArquivo('Fontes Especiais.zip', blob)
        ); 
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

const mapState = state => ({
    elementos: state.present.elementos
});

export default connect(mapState)(ExportarDownload);