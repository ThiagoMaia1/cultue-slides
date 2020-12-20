import React from 'react';
import './Adicionar.css';
import { connect } from 'react-redux';
import { tiposElemento, getNomeInterfaceTipo } from '../../principais/Element';
import useAnimationOutsideClick from '../../principais/Hooks/useAnimationOutsideClick'; 

const tipos = Object.keys(tiposElemento);

const Adicionar = props => {

    const [ref, estilo, fecharQuadro] = useAnimationOutsideClick(
        props.onClick,
        {height: 0},
        {height: '20vh'},
        255
    );

    const abrirPopup = tipo => {
        props.dispatch({
            type: 'ativar-popup-adicionar', 
            popupAdicionar: {tipo}
        });
        fecharQuadro();
    }

    return (
        <div id='div-botoes' style={estilo} ref={ref}>
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
    )
}

export default connect()(Adicionar);