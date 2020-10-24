import React from 'react';
import './style.css';

class Popup extends React.Component {
  
  constructor (props) {
    super(props);
    this.state = {...props}
  }

  render() {
    return (
      <>
        <div id="fundo-popup" onClick={() => this.props.ocultarPopup()}>
          <div className='popup' onClick={(e) => e.stopPropagation()}>
            <div className='cabecalho-popup'>
              <button id='fechar' onClick={() => this.props.ocultarPopup()}>✕</button>
            </div>
            {this.props.children}
          </div>
        </div>
      </>
    );
  }
};
  
export default Popup;
  