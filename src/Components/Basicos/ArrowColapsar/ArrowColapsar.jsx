import React from 'react';
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from 'react-icons/md';
import './ArrowColapsar.css';

export default function ArrowColapsar(props) {
    
    var tamanho = props.tamanhoIcone || 20;
    return (
        <div className='container-icone-colapsar' style={props.style}>
            <div className='icone-colapsar' onClick={props.onClick}>
                {props.colapsado 
                    ? <MdKeyboardArrowDown size={tamanho}/>
                    : <MdKeyboardArrowUp size={tamanho}/> 
                }
            </div>
        </div>
    )
}