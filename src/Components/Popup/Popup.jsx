import React from 'react';
import { useHotkeysFilter } from '../../principais/atalhos';
import './style.css';

const Popup = ({tamanho, ocultarPopup, children, style}) => {
  
  useHotkeysFilter((e, resultadoFiltroInicial) => {
    return e.key === 'Escape' || resultadoFiltroInicial;
  })

  let estiloTamanho = {};
  if (tamanho !== 'pequeno')
    estiloTamanho = {height: '65%', width: '50%'};

  return (
    <>
      <div id="fundo-popup" onClick={() => ocultarPopup(-1)}>
        <div className='popup' onClick={(e) => e.stopPropagation()} style={{...estiloTamanho, ...style}}>
          <button id='fechar' onClick={() => ocultarPopup(-1)}>✕</button>
          {children}
        </div>
      </div>
    </>
  );
}
  
export default Popup;
  