import React from 'react';
import './style.css';

class Popup extends React.Component {
  
  constructor (props) {
    super(props);
    console.log(props.tamanho)
    if (props.tamanho !== 'pequeno') this.tamanho = {height: '65%', width: '50%'};
  }

  render() {
    return (
      <>
        <div id="fundo-popup" onClick={() => this.props.ocultarPopup()}>
          <div className='popup' onClick={(e) => e.stopPropagation()} style={this.tamanho}>
            <button id='fechar' onClick={() => this.props.ocultarPopup()}>✕</button>
            {this.props.children}
          </div>
        </div>
      </>
    );
  }
};
  
export default Popup;
  