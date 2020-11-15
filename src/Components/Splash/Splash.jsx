import React from 'react';
import './Splash.css';
import LoadingSplash from './LoadingSplash';

class Popup extends React.Component {

  constructor(props) {
    super(props);
    this.rotate = 15;
    this.escalaGrande = 1.05;
    this.escalaPequena = 0.95;
    this.state = {scale: this.escalaPequena, rotate: 15};
  }

  animacaoLogo = () => {
    if (this.state.scale === this.escalaPequena) {
      this.setState({scale: this.escalaGrande, rotate: 0});
    } else {
      this.rotate = -this.rotate;
      this.setState({scale: this.escalaPequena, rotate: this.rotate});
    }
  }
  
  componentDidMount = () => {
    this.animacaoLogo();
    setInterval(this.animacaoLogo, 1050);
  }

  render() {
    return (
        <div id="fundo-splash">
          <div id='logo-splash' style={{transform: 'scale(' + this.state.scale + ')'}}>
            <div className='quadrado-logo cinza' style={{transform: 'rotate(' + this.state.rotate*2 + 'deg)'}}></div>
            <div className='quadrado-logo azul-claro' style={{transform: 'rotate(' + this.state.rotate + 'deg)'}}></div>
            <img className='quadrado-logo azul' src={require('./QuadradoC.svg')} alt='Logo Cultue'/>
          </div>
          <LoadingSplash/>
        </div>
    );
  }
};
  
export default Popup;
  