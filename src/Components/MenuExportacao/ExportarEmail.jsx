import React, { Component } from 'react';
import Exportador from './Exportador';
import { IoMdMail } from 'react-icons/io';

class ExportarEmail extends Component {
    
    constructor (props) {
      super(props);
      this.state = {slidePreviewFake: true, previews: []};
      this.logo = <IoMdMail size={this.props.tamIcones}/>
    }

    exportarEmail = previews => {
      
    }

    render() {
        return (
          <Exportador id='exportar-email' callback={this.exportarEmail} logo={this.logo} rotulo='E-mail'/>
        )
    }

}

export default ExportarEmail;

