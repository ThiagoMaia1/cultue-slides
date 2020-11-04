import React, { Component } from 'react';
import BotaoExportador from './BotaoExportador';
import { IoMdMail } from 'react-icons/io';
import { enviarEmail as enviarEmailAnexo } from './EnviarEmail';

class ExportarEmail extends Component {

  constructor (props) {    
    super(props);
    this.posicao = 1;
  }

  exportarEmail = obj => {
    var { nomeArquivo, arquivo, formato } = obj;
    switch (formato) {
      case 'pptx':
        arquivo.writeFile(nomeArquivo);
        break;
      case 'html':
        // downloadArquivoTexto(nomeArquivo, arquivo);
        break;
      case 'pdf':
        arquivo.save(nomeArquivo);
        break;
      default:
        return;
    }
    
    enviarEmailAnexo(
      'Email teste', 'tthiagopmaia@gmail.com, thiago.maia@ufop.edu.br',
      'Rapaz, que e-mail bonito...', '<div><h1>Belo e-mail</h1> haha</div>',
      {filename: nomeArquivo,
        content: 'oi' //arquivo
      }
    )
  }

  render() {
      return (
        <BotaoExportador formato='email' onClick={() => this.props.definirMeioExportacao(this.exportarDownload, this.posicao)} 
          arrow={this.props.posicaoArrow === this.posicao} logo={<IoMdMail size={this.props.tamIcones}/>} rotulo='E-mail'/>
      )
  }

}

export default ExportarEmail;

