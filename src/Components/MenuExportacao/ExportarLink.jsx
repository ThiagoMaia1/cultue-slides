import React, { Component } from 'react';
import Exportador from './Exportador';
import { BsLink45Deg } from 'react-icons/bs';

class ExportarLink extends Component {
    
    constructor (props) {
      super(props);
      this.state = {slidePreviewFake: true, previews: []};
      this.logo = <BsLink45Deg size={this.props.tamIcones}/>
    }

    exportarLink = previews => {
      
    }

    render() {
        return (
          <Exportador id='exportar-link' callback={this.exportarLink} logo={this.logo} rotulo='Link'/>
        )
    }

}

export default ExportarLink;

