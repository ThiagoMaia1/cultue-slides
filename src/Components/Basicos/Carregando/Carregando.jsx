import React from 'react';
import './Carregando.css';

const estiloNaoClique = {userSelect: 'none', clickEvents: 'none'}

const CarregandoNoCanto = (props) => (
    <div style={{width:'100%', padding: '1.8vh 0.9vw', position: 'absolute', display: 'flex', justifyContent: 'flex-end', ...estiloNaoClique}}>
        {props.children}
    </div>
)

const CirculoCarregando = ({tamanho, alternarCor, style, corFundo}) => {
   return (
        <div class="wraper" 
            style={{
                '--tamanho-loading': tamanho, 
                '--cor-fundo': corFundo || 'white',
                zIndex: 20, 
                ...estiloNaoClique, 
                borderColor: alternarCor ? '' : 'var(--azul-forte)',
                ...style
            }}>
            <div className='container-arc'>
                <div class="arc arc_start"></div>    
                <div class="arc arc_end"></div>
                <div class="arc arc_end2"></div>
                <div class="arc arc_end3"></div>
                <div class="arc arc_tampar"></div>
            </div> 
        </div>
   )
}

export default function Carregando (props) {
    if(props.noCanto) {
        return (
            <CarregandoNoCanto>
                <CirculoCarregando {...props}/>
            </CarregandoNoCanto>
        )
    } else {
        return (
            <CirculoCarregando {...props}/>
        )
    }
};