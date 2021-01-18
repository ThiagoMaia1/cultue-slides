import React from 'react';
import './Splash.css';
import '../Carregando/Carregando.css';
import LoadingSplash from './LoadingSplash';
import LogoCultue from './LogoCultue';

const Splash = () =>
  <div id="fundo-splash">
    <LogoCultue animado={true}/>
    <div className='wraper-loading-splash'>
      <LoadingSplash/>
    </div>
  </div>
  
export default Splash;
  