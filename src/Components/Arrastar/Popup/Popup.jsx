import React from 'react';
import './style.css';

class Popup extends React.Component {
  
  constructor (props) {
    super(props);
    this.state = {...props}
  }
  togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup
    });
  }
  // componentDidUpdate(prevState){
  //   //Por algum motivo precisa disso pra ficar visível novamente após ter sido fechado uma vez.
  //   if (this.state.showPopup == false) {
  //     this.setState({showPopup: true});
  //   }
  // }

    render() {
    if (this.state.showPopup) {
      return (
        <div className='popup' id="popup">
          <div className='popup_inner'>
            <button id='fechar' onClick={this.togglePopup.bind(this)}>x</button>
            <p>{this.props.text}</p>
            {this.props.children}            
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
};
  
export default Popup;
  