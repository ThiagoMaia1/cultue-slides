import React from 'react';
import './Adicionar.css';
import { connect } from 'react-redux';
import { tiposElemento, getNomeInterfaceTipo } from '../../principais/Element';
import useAnimationOutsideClick from '../../principais/Hooks/useAnimationOutsideClick'; 

const tipos = Object.keys(tiposElemento);

const BotoesAdicionar = props => {

    const [ref, estilo, fecharQuadro] = useAnimationOutsideClick(
        props.onClick,
        {height: 0},
        {height: '20.5vh'},
        255
    );

    const abrirPopup = tipo => {
        props.dispatch({
            type: 'ativar-popup-adicionar', 
            popupAdicionar: {tipo}
        });
    }

    return (
        <div id='div-botoes' ref={ref} onClick={() => fecharQuadro()}>
            <div id='movedor-botoes-adicionar' style={estilo}>
                <div id='container-botoes-adicionar'>
                    {tipos.map(t =>
                        <button key={t} 
                                className="botao-azul itens" 
                                onClick={() => abrirPopup(t)}>
                            {getNomeInterfaceTipo(t)}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default connect()(BotoesAdicionar);