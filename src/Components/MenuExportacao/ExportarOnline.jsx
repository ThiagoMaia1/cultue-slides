import React, { Component } from 'react';
import { connect } from 'react-redux';
import BotaoExportador from './BotaoExportador';
 
class ExportadorPDF extends Component {
    
  constructor (props) {
    super(props);
    this.state = {slidePreviewFake: true, previews: []};
    this.formato = 'online';
    this.logo = (
      <img id='logo-cultue-redondo' src={require('./Logos/Logo Cultue.svg')} alt='Logo Cultue'></img>
    )
  }

  exportarOnline = () => {
    return {formato: 'online'};    
  }

  render() {
    if (this.props.autorizacao !== 'editar') return null;
    return (
      <BotaoExportador formato={this.formato} onClick={() => this.props.definirCallback(this.exportarOnline)} 
        logo={this.logo} rotulo='Online'/>
    )
  }
}

const mapState = state => (
  {autorizacao: state.present.apresentacao.autorizacao}
)

export default connect(mapState)(ExportadorPDF);

