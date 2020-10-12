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
        <div className='popup'>
          <div className='cabecalho-popup'>
            <button id='fechar' onClick={() => this.props.ocultarPopup()}>x</button>
          </div>
          {this.props.children}
        </div>
        <div id="fundo-popup" onClick={() => this.props.ocultarPopup()}></div>
      </>
    );
  }
};
  
export default Popup;
  