import React from 'react';
import './style.css';

class Popup extends React.Component {
  
  constructor (props) {
    super(props);
    this.state = {...props}
  }

  render() {
    return (
      <div className='popup' id="popup">
        <div className='popup_inner'>
          <div style={{margin: '1vw'}}>
            <button id='fechar' onClick={() => this.props.ocultarPopup()}>x</button>
            <p>{this.props.text}</p>
            {this.props.children}
          </div>            
        </div>
      </div>
    );
  }
};
  
export default Popup;
  