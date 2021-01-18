import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import './Galeria.css';
import useAnimationOutsideClick from '../../principais/Hooks/useAnimationOutsideClick';
import { listaDirecoes } from '../../principais/Constantes';
import Galeria from './Galeria';

const MenuGaleria = ({tutorialAtivo}) => {

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
        false,
        true
    )

    let [ ativo, setAtivo ] = useState(false);
    let [ clicavel, setClicavel ] = useState(true);

    const toggle = bool => {
        if(bool === ativo) return;
        setClicavel(false);
        toggleQuadro(bool);
        setTimeout(() => setClicavel(true), tempo);
    }

    let aberto = Number(estilo.top.replace('vh', '')) === coordenadasGaleria[0];
    if (aberto !== ativo) setTimeout(() => setAtivo(aberto), tempo*0.6);

    useEffect(
        () => tutorialAtivo ? toggle(true) : void 0, 
        [tutorialAtivo]
    )

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

const mapState = state => ({
    tutorialAtivo: state.itensTutorial.includes('galeriaFundos')
});

export default connect(mapState)(MenuGaleria);

