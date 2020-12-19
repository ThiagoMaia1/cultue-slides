import React from 'react';
import useAnimationOutsideClick from '../../../principais/Hooks/useAnimationOutsideClick';

const QuadroMenu = props => {
    
    const [ref, estilo, fecharQuadro] = useAnimationOutsideClick(
        () => props.callback(false), 
        {maxWidth: 0, maxHeight: 0},
        {maxWidth: '100vw', maxHeight: '100vh'}
    )

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
  