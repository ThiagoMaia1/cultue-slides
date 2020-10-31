import React, { Component } from 'react';
import Exportador from './Exportador';
import { IoMdMail } from 'react-icons/io';

class ExportarEmail extends Component {
    
  constructor (props) {
    super(props);
    this.state = {slidePreviewFake: true, previews: []};
  }

  exportarEmail = previews => {
    
  }

  render() {
      return (
        <Exportador formato='email' callback={this.exportarEmail} 
          logo={<IoMdMail size={this.props.tamIcones}/>} rotulo='E-mail'/>
      )
  }

}

export default ExportarEmail;

