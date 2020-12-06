import React from 'react';
import './Splash.css';

class LogoCultue extends React.Component {

  constructor(props) {
    super(props);
    this.rotate = (props.animado ? 1 : -1) * 15;
    this.escalaPequena = props.escala || 1;
    this.escalaGrande = this.escalaPequena * 1.1;
    this.state = {scale: this.escalaGrande, rotate: 0};
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
    if (this.props.animado) {
      setTimeout(() => this.animacaoLogo(), 1);
      this.intervalo = setInterval(this.animacaoLogo, 1050);
    }
  }

  componentWillUnmount = () => {
    clearInterval(this.intervalo);
  }

  render() {
    return (
      <div id='logo-splash' style={{transform: 'scale(' + this.state.scale + ')'}}>
        <div className='quadrado-logo cinza' style={{transform: 'rotate(' + this.state.rotate*2 + 'deg)'}}></div>
        <div className='quadrado-logo azul-claro' style={{transform: 'rotate(' + this.state.rotate + 'deg)'}}></div>
        <img className='quadrado-logo azul' src={require('./QuadradoC.svg')} alt='Logo Cultue'/>
      </div>
    );
  }
};
  
export default LogoCultue;
  