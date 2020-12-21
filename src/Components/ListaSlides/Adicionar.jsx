import React, { useState, useRef } from 'react';
import { connect } from 'react-redux';
import BotoesAdicionar from './BotoesAdicionar';

const Adicionar = props => {

    let [ativo, setAtivo] = useState(false);
    let ref = useRef();
    let acima;
    if(ref.current) acima = ref.current.getBoundingClientRect().y >= 0.5*window.innerHeight;

    const BotaoGrande = () =>
        <div id="adicionar-slide" 
            className='botao-azul itens lista-slides'
            onClick={() => {if(!ativo) setAtivo(true)}}>
            Adicionar Slide
        </div>

    const DivBotoes = () => (ativo || props.tutorialAtivo) ? <BotoesAdicionar onClick={() => setAtivo(false)}/> : null;

    return (
        <div className={'container-adicionar ' + (acima ? 'acima' : '')} ref={ref}>
            {acima ? <DivBotoes/> : null}
            <BotaoGrande/>
            {!acima ? <DivBotoes/> : null}
        </div>
    )
}

const mapState = state => (
    {tutorialAtivo: state.itensTutorial.includes('painelAdicionar')}
)

export default connect(mapState)(Adicionar);