import React from 'react';
import './SetaVoltar.css';
import { BsArrowLeft } from 'react-icons/bs';

export default function SetaVoltar (props) {

    return (
        <div className='container-seta-voltar' title={props.title} style={props.style}>
            <div id='seta-voltar' onClick={props.callback} style={{padding: props.tamanhoIcone/2}}>
                <BsArrowLeft size={props.tamanhoIcone}/>
            </div>
        </div>
    )
}