import React, { Component } from 'react';
import store from '../../index';
import { enviarEmailTemplate } from '../MenuExportacao/ChamadaEnvioEmail';
import { connect } from 'react-redux';
import { ativarPopupLoginNecessario } from '../Popup/PopupConfirmacao';
// import { objetosSaoIguais } from '../../../principais/FuncoesGerais';

class QuadroEnviar extends Component {

    enviarEmail = e => {
        let usuario = this.props.usuario;
        let dados = {
            mensagem: e.target.value,
            usuario
        };
        if (this.props.incluirRelatorio) dados.relatorio = store.getState();
        let corpo = JSON.stringify(dados)
        let nome = this.props.titulo + ' ' + new Date().toString();
        enviarEmailTemplate(
            nome,
            undefined,
            undefined,
            'Arquivo em anexo com comunicação do usuário: ' + usuario.nomeCompleto + '\n' + usuario.email,
            undefined,
            {
                filename: nome + '.json',
                content: corpo
            },
            (fazer) => {
                if(fazer) this.props.fechar();
            }
        )
    }

    render() {
        if (!this.props.usuario.uid) {
            ativarPopupLoginNecessario('entrar em contato conosco');
            this.props.fechar();
            return null;
        }
        return(
            <div className='quadro-enviar'>
                <div>{this.props.titulo}</div> 
                <textarea className='combo-popup inserir-lista-express'/>
                <div className='linha-flex'>
                    <button className='botao' onClick={this.enviarEmail}>
                        {this.props.textoBotao}
                    </button>
                    <div style={{minWidth: '2vw'}}></div>
                    <button className='botao limpar-input' onClick={() => this.props.fechar()}>✕ Cancelar</button>
                </div>
            </div>
        )
    }
}

const mapState = ({usuario}) => {
    let { nomeCompleto, email, uid } = usuario;
    return {usuario: {nomeCompleto, email, uid}};
}

export default connect(mapState)(QuadroEnviar);
