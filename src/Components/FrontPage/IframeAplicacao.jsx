import React, { useRef, useEffect, useState } from 'react';
import useTilt from '../../principais/Hooks/useTilt';
import history, { mensagemHistory } from '../../principais/history';

const mensagem = 'tela-cheia-iframe';
const HOME = '/home';
const MAIN = '/main';

export const sairDoIframe = () => {
    if (window.self !== window.top) {
        window.parent.postMessage({type: mensagem});
        return true;
    }
}

export default function IframeAplicacao () {
    let ref = useRef();
    let rect = ref.current ? ref.current.getBoundingClientRect() : null;
    let chegou = rect ? rect.top - rect.height < 0 : false;
    let transform = useTilt(ref, 0.15, true);
    let [telaCheia, setTelaCheia] = useState(false);
    let telaCheiaPermanente = useRef();
    telaCheiaPermanente.current = telaCheia;
    
    const srcIframe = window.location.origin + MAIN;
    let [src, setSrc] = useState(srcIframe);

    const setTelaCheiaTrue = e => {
        let telaCheia = telaCheiaPermanente.current;
        let {type, pathname} = e.data;
        let [eHistory, eClick] = [type === mensagemHistory, type === mensagem];
        if (!eHistory && !eClick) return;
        if (!telaCheia && eHistory && pathname === HOME) {
            document.getElementById('fundo-front-page').scrollTo({top: 0, behavior: 'smooth'});
            setTimeout(() => {
                setSrc('');
                setTimeout(() => setSrc(srcIframe), 10);
            }, 500);
            return;
        }
        if(!telaCheia) setTelaCheia(true);
        else if (eHistory) {
            history.push(e.data.pathname);
            window.removeEventListener('message', setTelaCheiaTrue);
        }
    }

    useEffect(() => {
        window.addEventListener('message', setTelaCheiaTrue);
        return () => window.removeEventListener('message', setTelaCheiaTrue);
    }, [])
    
    if(telaCheia && window.location.pathname === HOME)
        window.history.replaceState(undefined, undefined, MAIN);
    if (!chegou || telaCheia) transform = '';
    return (
        <div className={!telaCheia ? 'wraper-iframe' : 'container-iframe-tela-cheia'} 
            style={{transform}} 
            ref={ref}>
            <iframe title='preview-pagina' className='print-site' src={src} frameBorder={0} scrolling='no'/>
        </div>
    )
}
