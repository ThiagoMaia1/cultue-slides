import { useEffect, useState } from 'react';
import { getNomeCss } from '../FuncoesGerais';

const useClosingAnimation = (ativo, callbackFechar, estiloInicial, estiloFinal, tempo = 200) => {
    let strAnimacao = `${tempo}ms ease-in-out`;
    const getEstiloTransition = estilo => (
        {
            ...estilo, 
            transition: Object.keys(estilo).map(k => getNomeCss(k) + ' ' + strAnimacao).join(',')
        }
    )

    const [estInicial] = useState(getEstiloTransition(estiloInicial));
    const [estFinal] = useState(getEstiloTransition(estiloFinal));
    const [estilo, setEstilo] = useState(estiloInicial);

    useEffect(() => {
        if(ativo) {
            setTimeout(() => setEstilo(estFinal), 0);
        } else {
            setEstilo(estInicial);
            setTimeout(callbackFechar, tempo);
        }
    }, [ativo, callbackFechar, estInicial, estFinal, tempo]);

    return estilo;
};

export default useClosingAnimation;