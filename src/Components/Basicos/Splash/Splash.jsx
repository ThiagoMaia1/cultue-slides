import React from 'react';
import './Splash.css';
import LoadingSplash from './LoadingSplash';
import LogoCultue from './LogoCultue';

const Splash = props =>
  <div id="fundo-splash">
    <LogoCultue animado={true}/>
    <LoadingSplash/>
  </div>
  
export default Splash;
  