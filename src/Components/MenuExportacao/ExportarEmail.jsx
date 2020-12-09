import React, { Component } from 'react';
import { connect } from 'react-redux';
import BotaoExportador from './BotaoExportador';
import { IoMdMail } from 'react-icons/io';
import ListaEmails from '../Perfil/ListaEmails';
import Carrossel from '../Carrossel/Carrossel';
import sobreporSplash from '../Splash/SobreporSplash';
import { ativarPopupConfirmacao } from '../Popup/PopupConfirmacao';
import { enviarEmailTemplate } from './ChamadaEnvioEmail';
import { gerarNovaPermissao, getLinkPermissao } from '../../firestore/apresentacoesBD';

class ExportarEmail extends Component {

  constructor (props) {
    super(props);
    this.state = {listaEmails: []};
    this.meio = 'email';
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

    const ListaComLoading = sobreporSplash('listaEmails', ListaEmails);

    this.filhosPopup = (
      <div style={{maxHeight: '50vh', minHeight:'50vh', width: '100%', marginBottom: '2vh', overflow: 'hidden'}}>
        <Carrossel direcao='vertical' tamanhoIcone={50} tamanhoMaximo={'50vh'} 
                  percentualBeirada={0.05} style={{zIndex: '400', width: '50vw'}}>
          <ListaComLoading selecionarEmail={this.selecionarEmail} height='50vh'/>
        </Carrossel>
      </div>
    )

    ativarPopupConfirmacao(
      'enviarCancelar', 
      'E-mails', 
      'Selecione os endereços de e-mail para os quais você deseja enviar o arquivo.',
      fazer => {if(fazer) {
        this.enviarArquivoEmail(obj);
        document.body.style.cursor = 'progress';
      }},
      this.filhosPopup
    )
  }

  enviarArquivoEmail = async obj => {
    var { nomeArquivo, arquivo, formato } = obj;
    var encoding = {};
    switch (formato) {
      case 'pptx':
        arquivo = await arquivo.write('base64');
        encoding = {encoding: 'base64'};
        break;
      case 'html':
        break;
      case 'pdf':
        arquivo.save(nomeArquivo);
        break;
      default:
        return;
    }

    this.partes = this.getPartesEmail();
    var link = await this.getLinkDownload('baixar', formato);

    enviarEmailTemplate(
      'Apresentação de Slides para o Culto', 
      this.getDestinatarios(), 
      this.getCorpoEmail(), 
      this.getHTMLEmail(),
      [{url: link, rotulo: 'Download Apresentação'}],
      [{
        filename: nomeArquivo,
        content: arquivo,
        ...encoding
      }]
    )
  }

  getLinkDownload = async (autorizacao, formato) => {
    var permissao = await gerarNovaPermissao(
      this.props.idApresentacao,
      autorizacao,
      null,
      formato
    );
    return getLinkPermissao(permissao.id);
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
      paragrafo2: 'Faça o download do anexo, ou clique no botão abaixo para fazer o download.'
    }
  }

  getCorpoEmail() {
    return this.partes.saudacao + '\n' + this.partes.paragrafo1;
  }

  getHTMLEmail() {
    return (
      <div>
          <h3>{this.partes.saudacao}</h3>
          <br></br>
          <p>{this.partes.paragrafo1}</p>
          <p>{this.partes.paragrafo2}</p>
      </div>
    )
  }

  verificarLogin = () => {
    if (!this.props.usuario.uid) {
      ativarPopupConfirmacao(
        'OK',
        'Login Necessário',
        'Para enviar a apresentação por e-mail, faça login, ou cadastre-se gratuitamente.'
      );
    } else {
      this.props.definirMeioExportacao(this.exportarEmail, this.props.posicao, this.meio);
    }
  }

  render() {
      return (
        <BotaoExportador formato={this.meio} onClick={this.verificarLogin} 
          arrow={this.props.posicaoArrow === this.props.posicao} logo={<IoMdMail size={this.props.tamIcones}/>} rotulo='E-mail'/>
      )
  }

}

const mapState = state => {
  return {usuario: state.usuario, idApresentacao: state.present.apresentacao.id}
}

export default connect(mapState)(ExportarEmail);
