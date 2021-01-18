import React, { Component } from 'react';
import { connect } from 'react-redux';
import BotaoExportador from '../BotaoExportador';
import { IoMdMail } from 'react-icons/io';
import ListaEmails from '../../../Perfil/PaginasPerfil/ListaEmails/ListaEmails';
import Carrossel from '../../../Basicos/Carrossel/Carrossel';
import sobreporSplash from '../../../Basicos/Splash/SobreporSplash';
import Popup from '../../../Popup/Popup';
import { ativarPopupLoginNecessario } from '../../../Popup/PopupConfirmacao';
import { enviarEmailTemplate } from '../../ChamadaEnvioEmail';
import { gerarNovaPermissao, getLinkPermissao } from '../../../../principais/firestore/apresentacoesBD';
import { getFontesUsadas, getZipFontes } from '../../ModulosFontes';
import { getPreviews } from '../../Exportador';

class ExportarEmail extends Component {

  constructor (props) {
    super(props);
    this.state = {listaEmails: [], popup: null};
    this.meio = 'email';
  }

  selecionarEmail = (email, novoStatus) => {
    let { listaEmails } = this.state;
    if (novoStatus) {
      listaEmails.push(email);
    } else {
      listaEmails = listaEmails.filter(e => e.enderecoEmail !== email.enderecoEmail);
    }
    this.setState({listaEmails});
  }

  desativarPopup = () => this.setState({popup: null})

  exportarEmail = obj => {

    const ListaComLoading = sobreporSplash('listaEmails', ListaEmails);

    this.setState({popup: () =>
      <Popup tamanho='pequeno' ocultarPopup={this.desativarPopup}>
        <div className='popup-confirmacao'>
          <div>
            <h4>E-mails</h4>
            <div style={{marginLeft: '2vw', marginBottom: '2vh'}}>Selecione os endereços de e-mail para os quais você deseja enviar o arquivo.</div>
            <div style={{maxHeight: '50vh', minHeight:'50vh', width: '100%', marginBottom: '2vh', overflow: 'hidden'}}>
              <Carrossel direcao='vertical' tamanhoIcone={50} tamanhoMaximo={'50vh'} 
                        beiradaFinal={15} style={{zIndex: '400', width: '50vw'}}>
                <ListaComLoading selecionarEmail={this.selecionarEmail} height='50vh'/>
              </Carrossel>
            </div>
          </div>
          <div className='container-botoes-popup'>
              <button className='botao' 
                    onClick={() => {
                      if (this.state.listaEmails.length) {
                        this.enviarArquivoEmail(obj);
                        document.body.style.cursor = 'progress';
                        this.desativarPopup();
                      }
                    }}
                    style={this.state.listaEmails.length ? null : {visibility: 'hidden'}}
                  >Enviar</button>
              <button className='botao neutro' onClick={this.desativarPopup}>Cancelar</button>  
            </div>
        </div>
      </Popup>,
      listaEmails: []
    })
  }

  enviarArquivoEmail = async obj => {
    var { nomeArquivo, arquivo, formato } = obj;
    var encoding = {};
    switch (formato) {
      case 'html':
        break;
      case 'pptx':
        arquivo = await arquivo.write('base64');
        encoding = {encoding: 'base64'};
        break;
      case 'pdf':
        arquivo.save(nomeArquivo);
        break;
      default:
        return;
    }

    this.partes = this.getPartesEmail();
    var link = await this.getLinkDownload('baixar', formato);

    let attachments = [{
      filename: nomeArquivo,
      content: arquivo,
      ...encoding
    }]

    const enviar = () => this.enviar(attachments, link)
    
    if (formato === 'pptx') {
      let previews = getPreviews(this.props.elementos);
      let fontesEspeciais = getFontesUsadas(previews).google;
      if (fontesEspeciais.length) {
        getZipFontes(
          fontesEspeciais || [], 
          blob => {
            attachments.push({
              filename: 'Fontes Especiais.zip',
              streamSource: blob.stream()
            });
            enviar();
          }
        ); 
        return;
      }
    }
    enviar();
  }

  enviar = (attachments, link) => {
    enviarEmailTemplate(
      'Apresentação de Slides para o Culto', 
      this.getDestinatarios(), 
      this.getCorpoEmail(), 
      this.getHTMLEmail(),
      [{url: link, rotulo: 'Baixar Apresentação'}],
      attachments
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
      ativarPopupLoginNecessario('enviar a apresentação por e-mail');
    } else {
      this.props.definirMeioExportacao(this.exportarEmail, this.props.posicao, this.meio);
    }
  }

  render() {
    let ComponentePopup = this.state.popup;
    return (
      <>
        {this.state.popup ? <ComponentePopup/> : null}
        <BotaoExportador formato={this.meio} onClick={this.verificarLogin} 
          arrow={this.props.posicaoArrow === this.props.posicao} logo={<IoMdMail size={this.props.tamIcones}/>} rotulo='E-mail'/>
      </>
    )
  }

}

const mapState = state => {
  return {
    usuario: state.usuario, 
    idApresentacao: state.present.apresentacao.id,
    elementos: state.present.elementos  
  }
}

export default connect(mapState)(ExportarEmail);
