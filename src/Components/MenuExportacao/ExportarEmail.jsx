import React, { Component } from 'react';
import { connect } from 'react-redux';
import BotaoExportador from './BotaoExportador';
import { IoMdMail } from 'react-icons/io';
import { firebaseFunctions } from '../../firebase';
import ListaEmails from '../Perfil/ListaEmails';
import Carrossel from '../Carrossel/Carrossel';
import sobreporSplash from '../Splash/SobreporSplash';

const enviarEmail = firebaseFunctions.httpsCallable('enviarEmail');

class ExportarEmail extends Component {

  constructor (props) {
    super(props);
    this.state = {listaEmails: []};
  }

  selecionarEmail = (email, novoStatus) => {
    var lista = this.state.listaEmails;
    if (novoStatus) {
      lista.push(email);
    } else {
      lista = lista.filter(e => e !== email);
    }
    this.setState({listaEmails: lista});
  }

  exportarEmail = obj => {
    // var { nomeArquivo, arquivo, formato } = obj;
    const ListaComLoading = sobreporSplash(ListaEmails);
    var lista = this.state.listaEmails;
    this.props.dispatch({type: 'ativar-popup-confirmacao', 
    popupConfirmacao: {
        botoes: 'OKCancelar',
        titulo: 'E-mails',
        texto: 'Selecione os endereços de e-mail para os quais você deseja enviar o arquivo.',
        filhos: ( 
          <div style={{maxHeight: '50vh', width: '100%', marginBottom: '2vh', overflow: 'hidden'}}>
            <Carrossel direcao='vertical' tamanhoIcone={50} tamanhoMaximo={'50vh'} 
                       percentualBeirada={0.05} style={{zIndex: '400', width: '50vw'}}>
              <ListaComLoading selecionarEmail={this.selecionarEmail}/>
            </Carrossel>
          </div>
        ),
        callback: () => {
          this.partes = this.getPartesEmail();
          enviarEmail({
            assunto: 'Apresentação de Slides para o Culto', 
            destinatarios: lista.reduce((resultado, email) => {
              resultado.push(email.enderecoEmail);
              return resultado;
            }, []).join(','),
            corpo: this.getCorpoEmail(), 
            corpoHTML: this.getHTMLEmail(),
            [{filename: 'teste.txt',
              content: 'oi' //arquivo
            }]
          })
        }
      }
    })
  }
    // switch (formato) {
    //   case 'pptx':
    //     arquivo.writeFile(nomeArquivo);
    //     break;
    //   case 'html':
    //     // downloadArquivoTexto(nomeArquivo, arquivo);
    //     break;
    //   case 'pdf':
    //     arquivo.save(nomeArquivo);
    //     break;
    //   default:
    //     return;
    // }

  getPartesEmail() {
    const lista = this.state.listaEmails;
    var primeiroNomeDestinatario = lista[0].nomeCompleto.split(' ')[0];
    return {
      saudacao: 'Olá' + (lista.length > 1 ? '' : ', ' + primeiroNomeDestinatario) + '!',
      paragrafo1: this.props.usuario.nomeCompleto + ' te enviou uma apresentação de slides criada pelo sistema Cultue.',
    }
  }

  getCorpoEmail() {
    return this.partes.saudacao + '\n' + this.partes.paragrafo1;
  }

  getHTMLEmail() {
    return '<div style="font-family: Roboto"/><h3>' + this.partes.saudacao + '<h3><p>' + this.partes.paragrafo1 + '</p></div>'
  }

  render() {
      return (
        <BotaoExportador formato='email' onClick={() => this.props.definirMeioExportacao(this.exportarEmail, this.props.posicao)} 
          arrow={this.props.posicaoArrow === this.props.posicao} logo={<IoMdMail size={this.props.tamIcones}/>} rotulo='E-mail'/>
      )
  }

}

const mapState = state => {
  return {usuario: state.usuario}
}

export default connect(mapState)(ExportarEmail);

