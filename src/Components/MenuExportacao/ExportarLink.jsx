import React, { Component } from 'react';
import { connect } from 'react-redux';
import BotaoExportador from './BotaoExportador';
import { BsLink45Deg } from 'react-icons/bs';
import { ativarPopupConfirmacao } from '../Popup/PopupConfirmacao';
import { urlSite } from '../../index';
import { BiCopy } from 'react-icons/bi';
import { gerarNovaPermissao } from '../../firestore/apresentacoesBD';

class ExportarLink extends Component {

  constructor (props) {
    super(props);
    this.state = {autorizacao: null, idPermissao: null};
    this.tamIcones = window.innerHeight*0.022 + 'px';
    this.formato = 'online';
  }

  exportarLink = obj => {
    this.formato = obj.formato;
    var online = this.formato === 'online';
    if (!online) this.gerarLink('baixar');
    ativarPopupConfirmacao(
      'OK',
      'Compartilhamento por Link',
      '',
      null,
      <div className='gerador-link-compartilhamento'>
        <div className='linha-flex'>
          <label to='selecionar-autorizacao-link'>{online ? 'Qualquer pessoa com o link pode' : 'Link para download em ' + this.formato + ':'}</label>
          { online
            ? <select id='selecionar-autorizacao-link' className='combo-popup' onChange={this.changeAutorizacao}>
                <option value='Ver'>Ver</option>
                <option value='Exportar'>Exportar</option>
                <option value='Editar'>Editar</option>
              </select>        
            : null
          }
        </div>
        <div className='linha-flex'>
          <input type='text' className='link-copiavel' readOnly value={this.getLinkPermissao(this.state.idPermissao)}/>
          <div className='botao-configuracao bool' onClick={() => this.copiarLinkAreaDeTransferencia(this.state.idPermissao)}>
            <BiCopy size={this.tamIcones}/>
          </div>
        </div>
      </div>
    )
  }

  changeAutorizacao = e => {
    this.gerarLink(e.target.value)
  }

  gerarLink = async (autorizacao) => {
    var idPermissao = await gerarNovaPermissao(
      this.props.apresentacao.id,
      autorizacao,
      null,
      this.formato
    )
    this.setState({
      autorizacao: autorizacao,
      idPermissao: idPermissao
    })
  }

  copiarLinkAreaDeTransferencia = idPermissao => {
    var inputTemporario = document.createElement('input');
    inputTemporario.type = 'text';
    inputTemporario.value =  this.getLinkPermissao(idPermissao);
    document.body.appendChild(inputTemporario);
    inputTemporario.select();
    document.execCommand('Copy');
    document.body.removeChild(inputTemporario);
    this.props.dispatch({type: 'inserir-notificacao', conteudo: 'Link copiado para a área de transferência'});
  }

  getLinkPermissao = idPermissao => {
    return urlSite + '#/' + this.state.idPermissao
  }

  render() {
      return (
        <BotaoExportador formato='link' onClick={() => this.props.definirMeioExportacao(this.exportarLink, this.props.posicao)} 
          arrow={this.props.posicaoArrow === this.props.posicao} logo={<BsLink45Deg size={this.props.tamIcones}/>} rotulo='Link'/>
      )
  }
}

const mapState = state => (
  {apresentacao: state.present.apresentacao}
)

export default connect(mapState)(ExportarLink);

