import React, { Component } from 'react';
import { connect } from 'react-redux';
import { tiposElemento, getNomeInterfaceTipo } from '../../Element';

const tipos = Object.keys(tiposElemento);

class Adicionar extends Component {
    
    constructor(props) {
        super(props);
        this.state = {...props};
        this.listaBotoes = [];
        for (var i = 0; i < tipos.length; i++) {
            this.listaBotoes.push(
                <button key={i} data-id={i} className="botao-azul itens" onClick={e => this.abrirPopup(e)}>
                    {getNomeInterfaceTipo(tipos[i])}
                </button>
            ) 
        }
    }

    abrirPopup = e => {
        var i = e.target.dataset.id;
        var tipo = tipos[i];
        this.props.onClick();
        this.props.dispatch({
            type: 'ativar-popup-adicionar', 
            popupAdicionar: {tipo: tipo}
        });
    }
    
    render() {
        return (
            <div id="div-botoes">
                {this.listaBotoes}
            </div>
        )
    }
}

export default connect()(Adicionar);