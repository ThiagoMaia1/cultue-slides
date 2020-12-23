import { useEffect, useState, useRef } from 'react';
import { getNomeCss } from '../FuncoesGerais';

const useClosingAnimation = (ativo, callbackFechar, estiloInicial, estiloFinal, tempo = 200) => {
    let strAnimacao = `${tempo}ms ease-in-out`;
    const getEstiloTransition = estilo => (
        {
            ...estilo, 
            transition: Object.keys(estilo).map(k => getNomeCss(k) + ' ' + strAnimacao).join(',')
        }
    )

    const callback = useRef(callbackFechar)
    const jaAtivou = useRef(false);
    const estInicial = useRef(getEstiloTransition(estiloInicial));
    const estFinal = useRef(getEstiloTransition(estiloFinal));
    const [estilo, setEstilo] = useState(estiloInicial);

    useEffect(() => {
        if(ativo) {
            setTimeout(() => setEstilo(estFinal.current), 0);
            jaAtivou.current = true;
        } else if(jaAtivou.current) {
            setEstilo(estInicial.current);
            setTimeout(callback.current, tempo);
        }
    }, [ativo, callback, estInicial, estFinal, tempo, jaAtivou]);

    return estilo;
};

export default useClosingAnimation;