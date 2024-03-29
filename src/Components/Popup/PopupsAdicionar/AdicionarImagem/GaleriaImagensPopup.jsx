import React, { useState } from 'react';
import '../LetrasMusica/style.css';
import './style.css';
import Carrossel from '../../../Basicos/Carrossel/Carrossel';
import ImagemGaleriaInput from './ImagemGaleriaInput';

const ListaImagens = ({imagens, apagar, irFinalCarrossel, onClick, mensagemConfirmarExclusao, fecharPopup}) => {
    if (imagens.length === 0) return null;
    if (imagens.length === 1 && !imagens[0].width && !imagens[0].eLinkFirebase) 
        return (<div className='texto-arquivo-invalido'>Arquivo Inválido: "{imagens[0].alt}"</div>);
    return (
        <div className='container-imagens-previa-upload'>
            {imagens.map((img, i) => 
                <ImagemGaleriaInput key={img.altContador || img.alt} 
                                    img={img} 
                                    indice={i} 
                                    apagar={apagar} 
                                    nFiles={imagens.length}
                                    setFinalCarrossel={irFinalCarrossel}
                                    onClick={onClick}
                                    mensagemConfirmarExclusao={mensagemConfirmarExclusao}
                                    fecharPopup={fecharPopup}
                 />
            )}
        </div>
    )
}

const GaleriaImagensPopup = ({imagens, onClickGaleria, onClickImagem, apagar, mensagemConfirmarExclusao, textoPlaceholder = '', pointerEvents = null, fecharPopup}) => {

    let [finalCarrossel, setFinalCarrossel] = useState(null);

    const getObjetoImagem = img => {
        if(typeof img === 'string') {
            let alt = decodeURI(img.split(/images%2F/)[1].split('.')[0])
            img = {
                src: img,
                alt,
                eLinkFirebase: true
            };
        }
        return img;
    }

    return (
        <div className='container-carrossel combo-popup caixa-input-imagem' style={{pointerEvents}} onClick={onClickGaleria}>
            <Carrossel tamanhoIcone={45} tamanhoMaximo='100%' direcao='vertical' style={{zIndex: '400', width: '100%'}} beiradaFinal={35} 
                        final={finalCarrossel}>
                <div className='file-input-container'>
                    <div className='container-texto-input-file'>
                        <div className='texto-auxiliar' onClick={onClickGaleria}>
                            {textoPlaceholder}
                        </div>
                        <ListaImagens imagens={imagens.map(getObjetoImagem)} 
                                      apagar={indice => apagar(indice)}
                                      irFinalCarrossel={() => setFinalCarrossel(new Date().getTime())}
                                      fecharPopup={fecharPopup}
                                      onClick={onClickImagem}
                                      mensagemConfirmarExclusao={mensagemConfirmarExclusao}/>
                    </div>
                </div>
            </Carrossel>
        </div>
    )
}

export default GaleriaImagensPopup;