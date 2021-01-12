import { useState } from 'react';
import useClosingAnimation from './useClosingAnimation';
import useOutsideClick from './useOutsideClick';

const useAnimationOutsideClick = (callbackFechar, estiloInicial, estiloFinal, tempo = 200, iniciaAtivo = true) => {
    const [ativo, setAtivo] = useState(iniciaAtivo);
    const toggleQuadro = (bool = false) => setAtivo(bool);
    
    const estilo = useClosingAnimation(
        ativo, 
        callbackFechar, 
        estiloInicial,
        estiloFinal,
        tempo
    );
    let ref = useOutsideClick(toggleQuadro);
    return [ref, estilo, toggleQuadro];
}

export default useAnimationOutsideClick;