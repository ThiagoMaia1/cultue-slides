import React from 'react';
import './TelaMensagem.css';
import TelaMensagem from './TelaMensagem';
import MenuExportacao from '../MenuExportacao/MenuExportacao';
import { capitalize } from '../../principais/FuncoesGerais';
import Preview from '../Preview/Preview';
import store from '../../index';

class MensagemBaixar extends React.Component {

    constructor (props) {
        super(props);
        this.state = {formatoExportacao: this.props.formatoExportacao};
    }

    baixar = () => {
        this.setState({formatoExportacao: null});
        setTimeout(() => this.setState({formatoExportacao: this.props.formatoExportacao}), 10);
    }

    visualizarOnline = () => {
        store.dispatch({type: 'alterar-autorizacao', autorizacao: 'ver'});
    }

    render() {
        return (
            <TelaMensagem mensagem={'Seu download será efetuado automaticamente. \n\n Se isso não acontecer, clique no botão abaixo.'}>
                <div className='container-botoes-download'>
                    <button className='botao botao-azul'  onClick={this.baixar}>
                        {'Baixar Arquivo ' + capitalize(this.props.formatoExportacao, 'Primeira Maiúscula')}
                    </button>
                    <button className='botao neutro' onClick={this.visualizarOnline}>
                        Visualizar On-line
                    </button>
                </div>
                <div style={{display: 'none'}}>
                    <MenuExportacao formatoExportacao={this.state.formatoExportacao}/>
                    <Preview/>
                </div>
            </TelaMensagem>
        );
    }
};

export default MensagemBaixar;