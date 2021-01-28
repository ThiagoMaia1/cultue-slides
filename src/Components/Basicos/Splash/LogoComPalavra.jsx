import React, {useState, useEffect, useRef} from 'react';
import LogoCultue from './LogoCultue';
import './LogoComPalavra.css';

const palavra = 'ultue Slides';

const LogoComPalavra = ({rotate}) => {

    let [letras, setLetras] = useState('');
    let [frente, setFrente] = useState(true);
    let [largura, setLargura] = useState(0);
    const definirLargura = () => setLargura(
        ref.current 
        ? ref.current.offsetWidth*0.9 + 'px'
        : 0
    )
    let ref = useRef();
    useEffect(() => {
        setTimeout(() => {
            if (letras !== palavra)
                setLetras(palavra.substr(0, letras.length + (frente ? 1 : -1)));
            else 
                setFrente(false);
    }, frente ? (letras ? 80 : 500) : 40)}, [letras, frente]);

    useEffect(definirLargura)

    let span = (
        <>
            <span className='branco'>C</span>
                {letras}
                {letras === palavra ? null :
                    <span className='caret'></span>
                }
            <span className='pontinho branco'>{'.'}</span>
        </>
    )

    // definirLargura()
    
    return (
        <div className='container-logo-com-nome' style={{width: largura}}>
            <div className='container-quadrados-logo'>
                <LogoCultue semC={true} rotate={rotate}/>
            </div>
            <span className='ultue' ref={ref}>
                {span}
            </span>  
        </div>
    )
}

export default LogoComPalavra;

// useEffect(() => 
// setTimeout(() => {
//     if (letras !== palavra) {
//         setLetras(palavra.substr(0, letras.length + 1));
//     }
// }, 1000));