import React, { useState } from 'react';
import useOutsideClick from '../../../principais/Hooks/useOutsideClick';
import useClosingAnimation from '../../../principais/Hooks/useClosingAnimation';

const QuadroMenu = props => {
    
    const [ativo, setAtivo] = useState(true);
    const fecharQuadro = () => setAtivo(false);
    
    const estilo = useClosingAnimation(
        ativo, 
        () => props.callback(false), 
        {maxWidth: 0, maxHeight: 0},
        {maxWidth: '100vw', maxHeight: '100vh'}
    );
    let ref = useOutsideClick(fecharQuadro);    

    let estiloLado = props.esquerda ? {right: '0'} : {left: '0'}
    return (
        <div id='quadro-menu' 
                className='quadro-navbar' 
                style={{position: 'absolute', top: '6vh', ...estiloLado, ...estilo, ...props.style}} 
                onKeyUp={() => {if(props.onKeyUp) fecharQuadro()}}
                tabIndex='0' ref={ref}>
                {props.children}
        </div>
    );
};

export default QuadroMenu;
  