import React, { Component } from 'react';
import { connect } from 'react-redux';
import BotaoExportador from '../BotaoExportador';
 
class ExportadorOnline extends Component {
    
  constructor (props) {
    super(props);
    this.state = {slidePreviewFake: true, previews: []};
    this.formato = 'online';
    this.logo = (
      <img id='logo-cultue-redondo' src={require('../../Logos/Logo Cultue.svg').default} alt='Logo Cultue'></img>
    )
  }

  exportarOnline = () => {
    return {formato: 'online'};    
  }

  render() {
    if (this.props.autorizacao !== 'editar') return null;
    return (
      <BotaoExportador formato={this.formato} onClick={() => this.props.definirFormatoExportacao(this.exportarOnline, this.formato)} 
        logo={this.logo} rotulo='Online' style={this.props.style}/>
    )
  }
}

const mapState = state => (
  {autorizacao: state.present.apresentacao.autorizacao}
)

export default connect(mapState)(ExportadorOnline);

