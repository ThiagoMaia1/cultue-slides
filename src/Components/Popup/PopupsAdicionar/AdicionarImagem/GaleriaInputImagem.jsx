import React, { Component, useState } from 'react';
import '../LetrasMusica/style.css';
import './style.css';
import Carrossel from '../../../Basicos/Carrossel/Carrossel';
import ImagemGaleriaInput from './ImagemGaleriaInput';

const ListaImagens = ({imagens, apagar, irFinalCarrossel}) => {
    if (imagens.length === 0) return;
    if (imagens.length === 1 && !imagens[0].width) 
        return (<div className='texto-arquivo-invalido'>Arquivo Inválido: "{imagens[0].alt}"</div>);
    return (
        <div className='container-imagens-previa-upload'>
            {imagens.map((img, i) => 
                <ImagemGaleriaInput key={img.alt + '-' + img.contador} 
                             img={img} 
                             indice={i} 
                             apagar={apagar} 
                             nFiles={imagens.length}
                             setFinalCarrossel={irFinalCarrossel}
                />)
            }
        </div>
    )
}

const GaleriaInputImagem = ({imagens, onClick, apagar, textoPlaceholder}) => {

    let [pointerEvents, setPointerEvents] = useState('none');
    let [finalCarrossel, setFinalCarrossel] = useState(null);

    return (
        <div className='container-carrossel' style={{pointerEvents}} onClick={onClick} onDragOver={() => setPointerEvents('all')}>
            <Carrossel tamanhoIcone={45} tamanhoMaximo='100%' direcao='vertical' style={{zIndex: '400', width: '100%'}} beiradaFinal={15} 
                        final={finalCarrossel}>
                <div className='file-input-container'>
                    <div className='container-texto-input-file'>
                        <div className='texto-auxiliar' onClick={onClick}>
                            {textoPlaceholder}
                        </div>
                        <ListaImagens imagens={imagens} 
                                        apagar={indice => apagar(indice)}
                                        irFinalCarrossel={() => setFinalCarrossel(new Date().getTime())}/>
                    </div>
                </div>
            </Carrossel>
        </div>
    )
}

export default GaleriaInputImagem;