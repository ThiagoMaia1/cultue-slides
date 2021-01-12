import React from 'react';
import { MdCloudUpload } from 'react-icons/md';
import { imagemEstaNoBD } from '../../principais/Element';

const BotaoReupload = ({callbackReupload, src, inativo}) => {
    if (imagemEstaNoBD(src) || inativo) return null;
    return (
        <button className='botao-reupload' onClick={callbackReupload}>
            <MdCloudUpload size={window.innerHeight*0.1}/>
            <div>Imagem não foi salva no banco de dados (ela se perderá se a página for atualizada), clique para refazer o upload.</div>
        </button>
    )
}

export default BotaoReupload;