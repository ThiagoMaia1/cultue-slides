import React, { Component } from 'react';
import store from '../../index';
import QuadroAtalhos from './QuadroAtalhos';
import QuadroEnviar from './QuadroEnviar';
import { QuadroOpcoes } from '../Basicos/MenuBotaoDireito/MenuBotaoDireito';
import { listaTutoriais, keysTutoriais } from '../Tutorial/ListaTutorial';
// import { objetosSaoIguais } from '../../../principais/FuncoesGerais';

const refazerTutorial = itemTutorial => store.dispatch({type: 'definir-item-tutorial', refazer: true, itemTutorial})

const opcoesTutoriais = [
    {rotulo: 'Todos', valor: keysTutoriais},
    ...listaTutoriais].map(t => ({rotulo: t.rotulo, callback: () => refazerTutorial(t.valor)}));

class QuadroAjuda extends Component {

    constructor (props) {
        super(props);
        this.opcoes = [
            {rotulo: 'Atalhos Gerais', submenu: {children: <QuadroAtalhos lista={'listaGeral'}/>}},
            {rotulo: 'Atalhos Apresentação', submenu: {children: <QuadroAtalhos lista={'listaApresentacao'}/>}},
            {rotulo: 'Fale Conosco', submenu: {children: 
                <QuadroEnviar fechar={props.callback} 
                              titulo='Escreva sua Mensagem:'
                              textoBotao='Enviar Mensagem'/>, style: {padding: '3.5vh'}}},
            {rotulo: 'Informar um Problema', submenu: {children: 
                <QuadroEnviar fechar={props.callback} 
                              titulo='Descreva o problema:'
                              textoBotao='Enviar Relatório'
                              incluirRelatorio={true}/>, style: {padding: '3.5vh'}}},
            {rotulo: 'Rever Tutoriais', submenu: {opcoes: opcoesTutoriais}},
            {rotulo: 'Documentação', callback: () => alert('todo')},
            {rotulo: 'Vídeos', callback: () => alert('todo')}
        ]
    }

    render() {
        return (
            <QuadroOpcoes opcoes={this.opcoes} callback={() => this.props.callback()} fecharPai={() => this.props.callback()} style={{left: this.props.left}}/>
        )
    }
};

export default QuadroAjuda;