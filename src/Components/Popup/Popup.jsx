import React from 'react';
import './style.css';

class Popup extends React.Component {
  
  constructor (props) {
    super(props);
    if (props.tamanho !== 'pequeno') this.tamanho = {height: '65%', width: '50%'};
  }

  render() {
    return (
      <>
        <div id="fundo-popup" onClick={() => this.props.ocultarPopup(-1)}>
          <div className='popup' onClick={(e) => e.stopPropagation()} style={{...this.tamanho, ...this.props.style}}>
            <button id='fechar' onClick={() => this.props.ocultarPopup(-1)}>✕</button>
            {this.props.children}
          </div>
        </div>
      </>
    );
  }
};
  
export default Popup;
  