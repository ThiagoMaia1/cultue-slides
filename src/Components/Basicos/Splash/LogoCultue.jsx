import React from 'react';
import './Splash.css';

class LogoCultue extends React.Component {

  constructor(props) {
    super(props);
    this.rotate = 15;
    this.escalaPequena = props.escala || 1;
    this.escalaGrande = this.escalaPequena * 1.1;
    this.state = {scale: this.escalaGrande, rotate: props.animado ? 0 : -15};
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
      this.timeout = setTimeout(() => this.animacaoLogo(), 1);
      this.intervalo = setInterval(this.animacaoLogo, 800);
    }
  }

  componentWillUnmount = () => {
    clearTimeout(this.timeout);
    clearInterval(this.intervalo);
  }

  render() {
    let {rotate} = this.props.rotate !== undefined ? this.props : this.state; 
    return (
      <div id='logo-splash' 
           className={this.props.animado ? 'animado' : ''} 
           style={{...this.props.style, transform: 'scale(' + this.state.scale + ')'}}>
        <div className='quadrado-logo cinza' style={{transform: 'rotate(' + rotate*2 + 'deg)'}}></div>
        <div className='quadrado-logo azul-claro' style={{transform: 'rotate(' + rotate + 'deg)'}}></div>
        {this.props.semC 
          ? <div className='quadrado-logo azul-forte'/> 
          : <img className='quadrado-logo azul-forte' src={require('./QuadradoC.svg').default} alt='Logo Cultue'/>
        }
      </div>
    );
  }
};
  
export default LogoCultue;
  