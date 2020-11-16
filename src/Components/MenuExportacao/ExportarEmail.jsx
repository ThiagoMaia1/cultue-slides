import React, { Component } from 'react';
import { connect } from 'react-redux';
import BotaoExportador from './BotaoExportador';
import { IoMdMail } from 'react-icons/io';
import { firebaseFunctions } from '../../firebase';
import ListaEmails from '../Perfil/ListaEmails';
import Carrossel from '../Carrossel/Carrossel';
import sobreporSplash from '../Splash/SobreporSplash';
import { ativarPopupConfirmacao } from '../Popup/PopupConfirmacao';
import ReactDOMServer from 'react-dom/server';
import { urlSite } from '../../index';

const enviarEmail = firebaseFunctions.httpsCallable('enviarEmail');

class ExportarEmail extends Component {

  constructor (props) {
    super(props);
    this.state = {listaEmails: []};
    this.cidLogo = 'logo';

    const ListaComLoading = sobreporSplash(ListaEmails);

    this.filhosPopup = (
      <div style={{maxHeight: '50vh', minHeight:'50vh', width: '100%', marginBottom: '2vh', overflow: 'hidden'}}>
        <Carrossel direcao='vertical' tamanhoIcone={50} tamanhoMaximo={'50vh'} 
                  percentualBeirada={0.05} style={{zIndex: '400', width: '50vw'}}>
          <ListaComLoading selecionarEmail={this.selecionarEmail} height='50vh'/>
        </Carrossel>
      </div>
    )
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
    ativarPopupConfirmacao(
      'enviarCancelar', 
      'E-mails', 
      'Selecione os endereços de e-mail para os quais você deseja enviar o arquivo.',
      () => this.enviarArquivoEmail(obj),
      this.filhosPopup
    )
  }

  enviarArquivoEmail = obj => {
    var { nomeArquivo, arquivo, formato } = obj;
    console.log(arquivo);
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

    this.partes = this.getPartesEmail();
    var objEmail = {
      assunto: 'Apresentação de Slides para o Culto', 
      destinatarios: this.getDestinatarios(),
      corpo: this.getCorpoEmail(), 
      corpoHTML: this.getHTMLEmail(),
      anexos: [
        {
          filename: nomeArquivo,
          content: arquivo
        // },
        // {
        //   filename: 'LogoCultue.svg',
        //   path: '/LogoCultue.svg',
        //   cid: this.cidLogo
        }  
    ]}
    const inserirNotificacao = conteudo => this.props.dispatch({type: 'inserir-notificacao', conteudo: conteudo})
    enviarEmail(objEmail).then(
      () => inserirNotificacao('E-mail enviado com sucesso'), 
      error => {
        inserirNotificacao('Erro ao enviar e-mail');
        console.log(error);
      }
    );
  }

  getDestinatarios() { 
    return this.state.listaEmails.reduce((resultado, email) => {
      resultado.push(email.enderecoEmail);
      return resultado;
    }, []).join(',')
  }

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
    return ReactDOMServer.renderToStaticMarkup(
      <div style={{fontFamily: 'Roboto'}}>
        <div style={{backgroundColor: ' #3757A9', height: '70px', width: '100%'}}></div>
        <div style={{padding: '25px'}}>
          <h3>{this.partes.saudacao}</h3>
          <br></br>
          <p>{this.partes.paragrafo1}</p>
        </div>
        <a href={urlSite} target="_blank" rel="noopener noreferrer">
          <div style={{backgroundColor: ' #3757A9', height: '150px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            {/* <img src={'cid:' + this.cidLogo} style={{width: '200px', objectFit: 'cover'}} alt='Logotipo Cultue'></img> */}
          </div>
        </a>
      </div>
    )
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

