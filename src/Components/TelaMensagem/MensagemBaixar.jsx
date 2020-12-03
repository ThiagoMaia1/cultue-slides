import React from 'react';
import './TelaMensagem.css';
import TelaMensagem from './TelaMensagem';
import MenuExportacao from '../MenuExportacao/MenuExportacao';
import { capitalize } from '../../FuncoesGerais';
import Preview from '../Preview/Preview';

class MensagemBaixar extends React.Component {

    constructor (props) {
        super(props);
        this.state = {formatoExportacao: this.props.formatoExportacao};
    }

    onClick = () => {
        this.setState({formatoExportacao: null});
        setTimeout(() => this.setState({formatoExportacao: this.props.formatoExportacao}), 10);
    }

    render() {
        return (
            <TelaMensagem mensagem={'Seu download será efetuado automaticamente. \n\n Se isso não acontecer, clique no botão abaixo.'}>
                <button className='botao botao-azul' style={{marginTop: '7vh'}} onClick={this.onClick}>
                    {'Baixar Arquivo ' + capitalize(this.props.formatoExportacao, 'Primeira Maiúscula')}
                </button>
                <div style={{display: 'none'}}>
                    <MenuExportacao formatoExportacao={this.state.formatoExportacao}/>
                    <Preview/>
                </div>
            </TelaMensagem>
        );
    }
};

export default MensagemBaixar;