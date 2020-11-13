import React, { Component } from 'react';
import BotaoExportador from './BotaoExportador';
import { IoMdMail } from 'react-icons/io';
import { firebaseFunctions } from '../../firebase';

const enviarEmail = firebaseFunctions.httpsCallable('enviarEmail');

class ExportarEmail extends Component {

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
    
    enviarEmail(
      'Email teste', 'tthiagopmaia@gmail.com, thiago.maia@ufop.edu.br',
      'Rapaz, que e-mail bonito...', '<div><h1>Belo e-mail</h1> haha</div>'
      // ,
      // [{filename: 'teste.txt',
      //   content: 'oi' //arquivo
      // }]
    )
  }

  render() {
      return (
        <BotaoExportador formato='email' onClick={() => this.props.definirMeioExportacao(this.exportarEmail, this.props.posicao)} 
          arrow={this.props.posicaoArrow === this.props.posicao} logo={<IoMdMail size={this.props.tamIcones}/>} rotulo='E-mail'/>
      )
  }

}

export default ExportarEmail;

