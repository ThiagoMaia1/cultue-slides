import React, { Component } from 'react';
import BotaoExportador from './BotaoExportador';
import { BsLink45Deg } from 'react-icons/bs';

const gerarLinkCompartilhavel= () => {
  //todo;
  return null;
}

class ExportarLink extends Component {

  exportarLink = obj => {
    var { nomeArquivo, conteudoArquivo } = obj;
    gerarLinkCompartilhavel(nomeArquivo, conteudoArquivo);
  }

  render() {
      return (
        <BotaoExportador formato='link' onClick={() => this.props.definirMeioExportacao(this.exportarLink, this.props.posicao)} 
          arrow={this.props.posicaoArrow === this.props.posicao} logo={<BsLink45Deg size={this.props.tamIcones}/>} rotulo='Link'/>
      )
  }

}

export default ExportarLink;

