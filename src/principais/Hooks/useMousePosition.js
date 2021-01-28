import { useState, useRef, useEffect } from 'react';

const useMousePosition = (el, iframe) => {
    let base = [0, 0];
    let [coordenadas, setCoordenadas] = useState(base);
    let [deslocamento, setDeslocamento] = useState(base);
    let [antesDeSair, setAntesDeSair] = useState(base);
    let elemento = useRef(el || document.body);
    
    const onMouseMove = e => {
        let center = getOrigem();
        let novasCoordenadas = [
            -(e.clientX - center[0] + deslocamento[0]), 
            -(e.clientY - center[1] + deslocamento[1])
        ];
        setCoordenadas(novasCoordenadas);
    }

    const onMouseLeave = e => setAntesDeSair([e.clientX, e.clientY])

    const onMouseEnter = e => 
        setDeslocamento([
            antesDeSair[0] - e.clientX + deslocamento[0],
            antesDeSair[1] - e.clientY + deslocamento[1]
        ])
    
    const getOrigem = () => [window.innerWidth/2, window.innerHeight/2];

    useEffect(() => { 
        let alvo = elemento.current;
        alvo.addEventListener('mousemove', onMouseMove);
        alvo.addEventListener('mouseenter', onMouseEnter);
        alvo.addEventListener('mouseleave', onMouseLeave);
        return () => {
            let alvo = elemento.current;
            alvo.removeEventListener('mousemove', onMouseMove);
            alvo.removeEventListener('mouseenter', onMouseEnter);
            alvo.removeEventListener('mouseleave', onMouseLeave);
        };
    }, [elemento]);

    
    useEffect(() => {
        if (!iframe) return void 0;
        var bubbleIframe;
        var elIframe;
        var alvo;
        setTimeout(() => {
            elIframe = document.getElementsByTagName('iframe')[0] || null;
            bubbleIframe = (event) => {
                var boundingClientRect = elIframe.getBoundingClientRect();
        
                var evt = new CustomEvent('mousemove', {bubbles: true, cancelable: false})
                evt.clientX = event.clientX*0.54 + boundingClientRect.left;
                evt.clientY = event.clientY*0.54 + boundingClientRect.top;
        
                onMouseMove(evt);
            }
            alvo = elIframe.contentWindow;
            alvo.addEventListener('mousemove', bubbleIframe);
        }, 1000);
        return () => {
            alvo.removeEventListener('mousemove', bubbleIframe);
        }
    }, [])
    return coordenadas;
};

export default useMousePosition;