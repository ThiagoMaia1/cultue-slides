import { useState } from 'react';
import useClosingAnimation from './useClosingAnimation';
import useOutsideClick from './useOutsideClick';

const useAnimationOutsideClick = (callbackFechar, estiloInicial, estiloFinal, tempo = 200) => {
    const [ativo, setAtivo] = useState(true);
    const fecharQuadro = () => setAtivo(false);
    
    const estilo = useClosingAnimation(
        ativo, 
        callbackFechar, 
        estiloInicial,
        estiloFinal,
        tempo
    );
    let ref = useOutsideClick(fecharQuadro);
    return [ref, estilo, fecharQuadro];
}

export default useAnimationOutsideClick;