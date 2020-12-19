import React, { Component } from 'react';
import './Adicionar.css';
import { connect } from 'react-redux';
import { tiposElemento, getNomeInterfaceTipo } from '../../principais/Element';

const tipos = Object.keys(tiposElemento);
const idPai = 'div-botoes';

class Adicionar extends Component {
    
    constructor(props) {
        super(props);
        this.estadoInicial = {height: 0};
        this.state = this.estadoInicial;
    }

    abrirPopup = tipo => {
        this.props.dispatch({
            type: 'ativar-popup-adicionar', 
            popupAdicionar: {tipo}
        });
        this.fechar();
    }

    clickFora = e => {
        let elem = document.getElementById(idPai);
        if(!elem) return;
        if(!(e.target.id === idPai || elem.contains(e.target)))
            this.fechar();
    }

    fechar = () => {
        this.setState(this.estadoInicial)
        setTimeout(this.props.onClick, 255);
    }

    componentDidMount = () => {
        setTimeout(() => {
            this.setState({height: '20vh'});
            window.addEventListener('click', this.clickFora);
        }, 10);
    }

    componentWillUnmount = () => {
        window.removeEventListener('click', this.clickFora);
    }
    
    render() {
        let { height } = this.state;
        return (
            <div id={idPai} style={{height}}>
                <div id='container-botoes-adicionar'>
                    {tipos.map(t =>
                        <button key={t} 
                                className="botao-azul itens" 
                                onClick={() => this.abrirPopup(t)}>
                            {getNomeInterfaceTipo(t)}
                        </button>
                    )}
                </div>
            </div>
        )
    }
}

export default connect()(Adicionar);