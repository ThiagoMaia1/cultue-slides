import React, { Component } from 'react';
import BotaoExportador from './BotaoExportador';
import { BsLink45Deg } from 'react-icons/bs';

const gerarLinkCompartilhavel= () => {
  //todo;
  return null;
}

class ExportarLink extends Component {
    
  constructor (props) {
    super(props);
    this.posicao = 2;
  }

  exportarLink = obj => {
    var { nomeArquivo, conteudoArquivo } = obj;
    gerarLinkCompartilhavel(nomeArquivo, conteudoArquivo);
  }

  render() {
      return (
        <BotaoExportador formato='link' onClick={() => this.props.definirMeioExportacao(this.exportarLink, this.posicao)} 
          arrow={this.props.posicaoArrow === this.posicao} logo={<BsLink45Deg size={this.props.tamIcones}/>} rotulo='Link'/>
      )
  }

}

export default ExportarLink;

