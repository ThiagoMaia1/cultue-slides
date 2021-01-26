import React, {useState, useEffect} from 'react';
import LogoCultue from './LogoCultue';
import './LogoComPalavra.css';

const palavra = 'ultue Slides';

const LogoComPalavra = ({rotate}) => {

    let [letras, setLetras] = useState('');
    let [frente, setFrente] = useState(true);
    useEffect(() => {
        setTimeout(() => {
            if (letras !== palavra || !frente)
                setLetras(palavra.substr(0, letras.length + (frente ? 1 : -1)));
            // else 
            //     setFrente(false);
    }, frente ? (letras ? 80 : 1000) : 40)}, [letras, frente]);

    return (
        <div className='container-logo-com-nome'>
            <div className='container-quadrados-logo'>
                <LogoCultue semC={true} rotate={rotate}/>
            </div>
            <span className='ultue'>
                <span className='branco'>C</span>
                {letras}
                {letras === palavra ? null :
                    <span className='caret'></span>
                }
                <span className='pontinho branco'>.</span>
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