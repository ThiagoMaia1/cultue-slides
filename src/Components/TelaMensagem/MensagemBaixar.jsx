import React from 'react';
import './TelaMensagem.css';
import TelaMensagem from './TelaMensagem';
import MenuExportacao from '../MenuExportacao/MenuExportacao';

class MensagemBaixar extends React.Component {

    onClick = () => {
        //todo
    }

    render() {
        return (
            <TelaMensagem mensagem={'Seu download será efetuado automaticamente. \n\n Se isso não acontecer, clique no botão abaixo.'}>
                <button className='botao botao-azul' style={{marginTop: '7vh'}} onClick={this.onClick}>
                    {'Baixar Arquivo ' + this.props.formatoExportacao}
                </button>
                <div style={{display: 'none'}}>
                    <MenuExportacao formatoExportacao={this.props.formatoExportacao}/>
                </div>
            </TelaMensagem>
        );
    }
};

export default MensagemBaixar;