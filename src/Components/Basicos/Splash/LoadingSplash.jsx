import React from 'react';
import Carregando from '../Carregando/Carregando';

export default function LoadingSplash() {

    return (
        <div id='loading-splash' style={{position: 'relative'}}>
            <Carregando tamanho={20} proporcaoVelocidade={1.3}/>
        </div>
    )
}
