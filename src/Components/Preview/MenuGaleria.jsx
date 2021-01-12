import React, { useState } from 'react';
import './Galeria.css';
import useAnimationOutsideClick from '../../principais/Hooks/useAnimationOutsideClick';
import { listaDirecoes } from '../../principais/Constantes';
import Galeria from './Galeria';

const MenuGaleria = () => {

    const coordenadasBotao = [ 86, 89, 6, 3];
    const coordenadasGaleria = [ 73, 2, 3, 2];
    const tempo = 200;

    const getDirecoes = coordenadas => 
        listaDirecoes.reduce((resultado, d, i) => {
            resultado[d] = coordenadas[i] + (i % 2 === 0 ? 'vh' : 'vw'); 
            return resultado;
        }, {})

    let [ref, estilo, toggleQuadro] = useAnimationOutsideClick(
        undefined,
        getDirecoes(coordenadasBotao),
        getDirecoes(coordenadasGaleria),
        tempo,
        false
    )

    let [ ativo, setAtivo ] = useState(false);
    let [ clicavel, setClicavel ] = useState(true);

    const toggle = bool => {
        console.log(bool, ativo);
        if(bool === ativo) return;
        setClicavel(false);
        toggleQuadro(bool);
        setTimeout(() => setClicavel(true), tempo);
    }

    let aberto = Number(estilo.top.replace('vh', '')) === coordenadasGaleria[0];
    if (aberto !== ativo) setTimeout(() => setAtivo(aberto), tempo*0.6);

    return (
        <div id='botao-mostrar-galeria' 
             className={'botao-azul' + (ativo ? ' menu-aberto' : ' menu-fechado') + (clicavel ? '' : ' em-transicao')} 
             onClick={() => toggle(true)} 
             style={estilo} ref={ref}>
            <Galeria/>     
            <div className='colapsar-menu galeria' 
                onClick={() => toggle(false)}>◣
            </div>
            <div id='rotulo-menu-galeria'>Galeria de Fundos</div>
        </div>
    )
}

export default MenuGaleria;
