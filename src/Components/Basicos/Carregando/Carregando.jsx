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
        <div className="wraper" 
            style={{
                '--tamanho-loading': tamanho, 
                '--cor-fundo': corFundo || 'white',
                '--largura-borda': tamanho < 0.2 ? 1.5 : 0.7,
                '--animacao-mudar-cor': alternarCor ? 'mudarCor' : '',
                zIndex: 20, 
                ...estiloNaoClique, 
                ...style
            }}>
            <div className='container-arc'>
                <div className="arc arc_start"></div>    
                <div className="arc arc_end"></div>
                <div className="arc arc_end2"></div>
                <div className="arc arc_end3"></div>
                <div className="arc arc_tampar"></div>
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