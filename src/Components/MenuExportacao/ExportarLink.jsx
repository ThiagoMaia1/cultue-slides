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
    if (this.formato === 'online') {
      ativarPopupConfirmacao(
        'OKCancelar',
        'Compartilhar Link',
        'Selecione a forma de compartilhamento:',
        null,
        <div className='gerador-link-compartilhamento'>
          <div className='linha-flex'>
            <label to='selecionar-autorizacao-link'>Qualquer pessoa com o link pode </label>
            <select id='selecionar-autorizacao-link' className='combo-popup' onChange={this.gerarLink}>
              <option value='Ver'>Ver</option>
              <option value='Exportar'>Exportar</option>
              <option value='Editar'>Editar</option>
            </select>        
          </div>
          <div className='linha-flex'>
            <div className='link-copiavel'>{this.getLinkPermissao(this.state.idPermissao)}</div>
            <div className='botao-configuracao bool' onClick={this.copiarLinkAreaDeTransferencia(this.state.idPermissao)}>
              <BiCopy size={this.tamIcones}/>
            </div>
          </div>
        </div>
      )
    } else {
      this.gerarLink('baixar')
    }
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
    this.copiarLinkAreaDeTransferencia(idPermissao);
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

