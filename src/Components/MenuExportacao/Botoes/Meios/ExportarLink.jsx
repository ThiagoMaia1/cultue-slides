import React, { Component } from 'react';
import { connect } from 'react-redux';
import BotaoExportador from '../BotaoExportador';
import { BsLink45Deg } from 'react-icons/bs';
import { ativarPopupConfirmacao } from '../../../Popup/PopupConfirmacao';
import { BiCopy } from 'react-icons/bi';
import { gerarNovaPermissao, getLinkPermissao } from '../../../../principais/firestore/apresentacoesBD';

class ExportarLink extends Component {

  constructor (props) {
    super(props);
    this.autorizacaoPadrao = 'ver';
    this.tamIcones = window.innerHeight*0.022 + 'px';
    this.formato = 'online';
  }

  exportarLink = async (obj, autorizacao = 'ver') => {
    this.formato = obj.formato;
    var online = this.formato === 'online';
    if (!online) autorizacao = 'baixar';
    var idPermissao = await this.gerarLink(autorizacao);
    ativarPopupConfirmacao(
      'OK',
      'Compartilhamento por Link',
      '',
      null,
      <div className='gerador-link-compartilhamento'>
        <div className='linha-flex'>
          <label to='selecionar-autorizacao-link'>{online ? 'Qualquer pessoa com o link pode' : 'Link para download em ' + this.formato + ':'}</label>
          { online
            ? <select id='selecionar-autorizacao-link' className='combo-popup' defaultValue={this.autorizacaoPadrao} onChange={this.changeAutorizacao}>
                <option value='ver'>Ver</option>
                <option value='editar'>Editar</option>
              </select>        
            : null
          }
        </div>
        <div className='linha-flex'>
          <input type='text' id='link-copiavel' readOnly value={getLinkPermissao(idPermissao)}/>
          <div className='botao-configuracao bool' onClick={() => this.copiarLinkAreaDeTransferencia()}>
            <BiCopy size={this.tamIcones}/>
          </div>
        </div>
      </div>
    )
  }

  changeAutorizacao = e => {
    this.exportarLink({formato: this.formato}, e.target.value);
  }

  gerarLink = async (autorizacao) => {
    var permissao = await gerarNovaPermissao(
      this.props.apresentacao.id,
      autorizacao,
      null,
      this.formato
    );
    var idPermissao = permissao.id;
    return idPermissao;
  }

  copiarLinkAreaDeTransferencia = () => {
    const link = document.getElementById('link-copiavel');
    link.select();
    document.execCommand('Copy');
    this.props.dispatch({type: 'inserir-notificacao', conteudo: 'Link copiado para a área de transferência'});
  }

  render() {
    const meio = 'link'
    return (
      <BotaoExportador formato={meio} onClick={() => this.props.definirMeioExportacao(this.exportarLink, this.props.posicao, meio)} 
        arrow={this.props.posicaoArrow === this.props.posicao} logo={<BsLink45Deg size={this.props.tamIcones}/>} rotulo='Link'/>
    )
  }
}

const mapState = state => (
  {apresentacao: state.present.apresentacao}
)

export default connect(mapState)(ExportarLink);

