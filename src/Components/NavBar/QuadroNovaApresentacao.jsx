import React from 'react';
import { zerarApresentacao } from '../../principais/firestore/apresentacoesBD';
import { QuadroOpcoes } from '../Basicos/MenuBotaoDireito/MenuBotaoDireito';
import store from '../../index';

const QuadroNovaApresentacao = props => {
    
    let {usuario, apresentacao, callback} = props;
    const novaVazia = () => zerarApresentacao({uid: 0}, apresentacao);
    
    let opcoes;
    if (usuario.uid) 
        opcoes = [
            {rotulo: 'Vazia', callback: novaVazia},
            {rotulo: 'Apenas Estilo', callback: () => zerarApresentacao(usuario, apresentacao, false)},
            {rotulo: 'Todos os Slides', callback: () => zerarApresentacao(usuario, apresentacao)},
            {rotulo: 'Limpar Estilo da Apresentação Atual',
                callback: () => store.dispatch({type: 'limpar-estilo', selecionado: {elemento: 0, slide: 0}})}
        ]

    if (!opcoes) {
        novaVazia();
        callback();
        return null;
    }
    return (
        <QuadroOpcoes opcoes={opcoes} fecharPai={callback} {...props}/>
    )
};

export default QuadroNovaApresentacao;