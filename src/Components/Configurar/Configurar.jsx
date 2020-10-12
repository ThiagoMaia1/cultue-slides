import React from 'react';
//import './style.css';
import { connect } from 'react-redux';
import Adicionar from './Adicionar';
import { CompactPicker } from 'react-color';

class Configurar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {...props, aberto: 'hidden'};
  }

	render() {
		return (
      <div className="coluna" >
        <Adicionar />
        <CompactPicker />
      </div>
    )   
	}
}

const mapStateToProps = function (state) {
  return {elementos: state.elementos}
}

export default connect(mapStateToProps)(Configurar);