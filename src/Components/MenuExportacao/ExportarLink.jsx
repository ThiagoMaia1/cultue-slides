import React, { Component } from 'react';
import Exportador from './Exportador';
import { BsLink45Deg } from 'react-icons/bs';

class ExportarLink extends Component {
    
  constructor (props) {
    super(props);
    this.state = {slidePreviewFake: true, previews: []};
  }

  exportarLink = previews => {
      
  }

  render() {
      return (
        <Exportador formato='link' callback={this.exportarLink} 
          logo={<BsLink45Deg size={this.props.tamIcones}/>} rotulo='Link'/>
      )
  }

}

export default ExportarLink;

