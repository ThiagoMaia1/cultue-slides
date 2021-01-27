import React, { useRef } from 'react';
import useTilt from '../../principais/Hooks/useTilt';

// let docIframe = require('./PrintHTML.js');
// let strStyles = [...document.querySelectorAll('style')]
//                 .map(n => n.outerHTML)
//                 .join('');
// let htmlIframe = docIframe.srcdoc.replace(docIframe.substituicao, strStyles);

export const sairDoIframe = path => {
    if (window.self !== window.top) {
        window.top.location.href = window.top.location.origin + '/' + path;
        return true;
    }
}

export default function IframeAplicacao ({acessarApp}) {
    let ref = useRef();
    let rect = ref.current ? ref.current.getBoundingClientRect() : null;
    let chegou = rect ? rect.top - rect.height < 0 : false;
    let transform = useTilt(ref, 0.15, true);
    if (!chegou) transform = '';



    return (
        <div className='wraper-iframe' style={{transform}} ref={ref} onClick={acessarApp}>
            {/* <img alt='Print Aplicação' className='print-site' src={'' + require('./Imagens/Print Site.jpg')}/> */}
            {/* <iframe title='preview-pagina' className='print-site' srcdoc={htmlIframe} frameborder={0} scrolling='no'/> */}
            <iframe title='preview-pagina' className='print-site' src={window.location.origin + '/main'} frameborder={0} scrolling='no'/>
        </div>
    )
}
