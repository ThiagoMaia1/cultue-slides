import React from 'react';
import store from '../../index';
import QuadroAtalhos from './QuadroAtalhos';
import QuadroEnviar from './QuadroEnviar';
import { QuadroOpcoes } from '../Basicos/MenuBotaoDireito/MenuBotaoDireito';
import { listaTutoriais, keysTutoriais } from '../Tutorial/ListaTutorial';

const refazerTutorial = itemTutorial => store.dispatch({type: 'definir-item-tutorial', refazer: true, itemTutorial})

const opcoesTutoriais = [
    {rotulo: 'Todos', valor: keysTutoriais},
    ...listaTutoriais].map(t => ({rotulo: t.rotulo, callback: () => refazerTutorial(t.valor)}));

const estiloQuadoEnviar = {padding: '3.5vh'};

const QuadroAjuda = props => {
    
    let { callback } = props;
    let opcoes = [
        {rotulo: 'Atalhos Gerais', submenu: {children: <QuadroAtalhos lista={'listaGeral'}/>}},
        {rotulo: 'Atalhos Apresentação', submenu: {children: <QuadroAtalhos lista={'listaApresentacao'}/>}},
        {rotulo: 'Fale Conosco', submenu: {children: 
            <QuadroEnviar fechar={callback} 
                            titulo='Escreva sua Mensagem:'
                            textoBotao='Enviar Mensagem'/>, style: estiloQuadoEnviar}},
        {rotulo: 'Informar um Problema', submenu: {children: 
            <QuadroEnviar fechar={callback} 
                          titulo='Descreva o problema:'
                          textoBotao='Enviar Relatório'
                          incluirRelatorio={true}/>, style: estiloQuadoEnviar}},
        {rotulo: 'Rever Tutoriais', submenu: {opcoes: opcoesTutoriais}}
        // ,
        // {rotulo: 'Documentação', callback: () => alert('todo')},
        // {rotulo: 'Vídeos', callback: () => alert('todo')}
    ]
    
    return (
        <QuadroOpcoes opcoes={opcoes} fecharPai={callback} {...props}/>
    )
};

export default QuadroAjuda;