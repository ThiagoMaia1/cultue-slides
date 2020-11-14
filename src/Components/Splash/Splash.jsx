import React from 'react';
import './Splash.css';
import Carregando from '../Carregando/Carregando'

class Popup extends React.Component {
  
  render() {
    return (
        <div id="fundo-splash">
          <img id='logo-splash' src={require('./LogoCultue.svg')} alt='Logo Cultue'/>
          <div id='loading-splash'>
              <Carregando tamanho={20} proporcaoVelocidade={1.3}/>
          </div>
        </div>
    );
  }
};
  
export default Popup;
  