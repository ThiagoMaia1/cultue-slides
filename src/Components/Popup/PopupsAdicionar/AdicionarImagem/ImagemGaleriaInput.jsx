import React, { useState, useEffect } from 'react';
import useClosingAnimation from '../../../../principais/Hooks/useClosingAnimation';
import '../LetrasMusica/style.css';
import './style.css';
import { getImgBase64 } from '../../../../principais/FuncoesGerais';

const ImagemGaleriaInput = ({img, indice, apagar, nFiles, setFinalCarrossel = null}) => {
    
    let [image] = useState(img);
    let [background, setBackground] = useState({});
    let [ativo, setAtivo] = useState(true);
    let {maxWidth, opacity, transition} = useClosingAnimation(
        ativo,
        () => apagar(indice),
        {maxWidth: '0', opacity: 0},
        {maxWidth: '12vw', opacity: 1}
    )
    let [callbackCarrossel] = useState(setFinalCarrossel);

    useEffect(() => {
        let bG = {};
        if (image.width) {
            bG.backgroundImage = 'url(' + getImgBase64(image, 300, 200) + ')';
            bG.backgroundPosition = 'center';
            bG.backgroundRepeat = 'no-repeat';
            bG.backgroundSize = 'cover';
        } else {
            bG.backgroundColor = 'var(--vermelho-fraco)';
        }
        setBackground(bG);
    }, [image])

    useEffect(() => {
        if (callbackCarrossel){
            callbackCarrossel();
            setTimeout(() => callbackCarrossel(), 300);
        }
    }, [callbackCarrossel]);

    useEffect(() => {
        document.body.style.cursor = 'progress';
        if (indice + 1 === nFiles) document.body.style.cursor = 'default';
    }, [indice, nFiles])

    const onClick = e => {
        e.stopPropagation();
        setAtivo(false);
    }

    let alt = img.alt + (img.contador ? '-' + img.contador : '');
    return (
        <div className='container-imagem-upload' key={alt}>
            <div className='imagem-invalida previa-imagem-upload' 
                    style={{...background, maxWidth, transition}}>
                {img.width 
                    ? null
                    : <> 
                        <div style={{textAlign: 'center'}}>Arquivo Inválido:<br></br>"{img.nomeComExtensao}"<br></br></div>
                        <div style={{fontSize: '120%'}}>✕</div>
                      </>
                }
            </div>
            <button className='x-apagar-imagem' style={{opacity, transition}} 
                    onClick={onClick}>✕</button>
        </div>
    )
}

export default ImagemGaleriaInput;