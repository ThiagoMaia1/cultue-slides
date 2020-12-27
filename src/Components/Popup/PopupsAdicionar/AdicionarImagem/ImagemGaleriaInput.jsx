import React, { useState, useEffect, useRef } from 'react';
import useClosingAnimation from '../../../../principais/Hooks/useClosingAnimation';
import { ativarPopupConfirmacao } from '../../PopupConfirmacao';
import '../LetrasMusica/style.css';
import './style.css';
import { getImgBase64 } from '../../../../principais/FuncoesGerais';

const ImagemGaleriaInput = ({img, indice, apagar, nFiles, setFinalCarrossel = null, onClick = null, mensagemConfirmarExclusao = '', fecharPopup}) => {

    let imgRef = useRef(img);
    let [image, setImage] = useState({});
    let [background, setBackground] = useState({});
    let [ativo, setAtivo] = useState(false);
    let {maxWidth, opacity, transition} = useClosingAnimation(
        ativo,
        () => apagar(indice),
        {maxWidth: '0', opacity: 0},
        {maxWidth: '12vw', opacity: 1}
    )
    let callbackCarrossel = useRef(setFinalCarrossel);

    useEffect(() => {
        let cImg = imgRef.current;
        if(ativo) return;
        const onLoad = ({target}) => {
            setImage({
                src: getImgBase64(target, 300, 200),
                alt: cImg.eLinkFirebase ? cImg.src : cImg.altContador,
                invalida: !cImg.eLinkFirebase && !cImg.width
            })
            setAtivo(true);
        }
        if(cImg.eLinkFirebase) {
            let imagem = new Image();
            imagem.crossOrigin = 'Anonymous';
            imagem.onload = onLoad;
            imagem.src = cImg.src;
        } else {
            onLoad({target: cImg});
        }
    }, [imgRef, ativo])

    useEffect(() => {
        let bG = {};
        if (image.invalida)
            bG.backgroundColor = 'var(--vermelho-fraco)';
        else {
            bG.backgroundImage = 'url(' + image.src + ')';
            bG.backgroundPosition = 'center';
            bG.backgroundRepeat = 'no-repeat';
            bG.backgroundSize = 'cover';
        }
        setBackground(bG);
    }, [image])

    useEffect(() => {
        let funcao = callbackCarrossel.current;
        if (funcao){
            funcao();
            setTimeout(() => funcao(), 300);
        }
    }, [callbackCarrossel]);

    useEffect(() => {
        document.body.style.cursor = 'progress';
        if (indice + 1 >= nFiles) document.body.style.cursor = 'default';
    }, [indice, nFiles])

    const confirmarExclusao = () => {
        if (mensagemConfirmarExclusao) 
            ativarPopupConfirmacao(
                'OKCancelar',
                'Confirmar Exclusão',
                mensagemConfirmarExclusao,
                fazer => {
                    if(fazer) setAtivo(false);
                },
                <ImagemGaleriaInput img={img} indice={0} nFiles={1}/>
            );
        else setAtivo(false);
    }

    const clickApagar = e => {
        e.stopPropagation();
        confirmarExclusao();
    }

    return (
        <div className={'container-imagem-upload' + (onClick ? ' clicavel' : '')} key={image.alt} 
             onClick={() => {
                if(onClick) {
                    onClick(img);
                    fecharPopup();
                }
             }}>
            <div className='imagem-invalida previa-imagem-upload' 
                 style={{...background, maxWidth, transition}}>
                {!image.invalida ? null
                    : <> 
                        <div style={{textAlign: 'center'}}>Arquivo Inválido:<br></br>"{image.alt}"<br></br></div>
                        <div style={{fontSize: '120%'}}>✕</div>
                      </>
                }
            </div>
            {!apagar ? null : 
                <button className='x-apagar-imagem' style={{opacity, transition}} 
                    onClick={clickApagar}>✕</button>
            }
        </div>
    )
}

export default ImagemGaleriaInput;