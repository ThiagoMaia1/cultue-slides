import React from 'react';
//import './style.css';
import { connect } from 'react-redux';
import Adicionar from './Adicionar';
import ConfigurarSlides from './ConfigurarSlides';

class Configurar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {...props, aberto: 'hidden'};
  }

	render() {
		return (
      <div className="coluna" >
        <Adicionar />
        <ConfigurarSlides />
      </div>
    )   
	}
}

const mapStateToProps = function (state) {
  return {elementos: state.elementos}
}

export default connect(mapStateToProps)(Configurar);