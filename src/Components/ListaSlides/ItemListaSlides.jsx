import React, { Component } from 'react';
import SublistaSlides, { eEstiloVazio } from './SublistaSlides';
import { connect } from 'react-redux';
import { ativarPopupConfirmacao } from '../Popup/PopupConfirmacao';
import { MdEdit } from 'react-icons/md';
import { getNomeInterfaceTipo, getDadosMensagem } from '../../principais/Element';
import ArrowColapsar from '../Basicos/ArrowColapsar/ArrowColapsar';
import MenuBotaoDireito from '../Basicos/MenuBotaoDireito/MenuBotaoDireito';

class ItemListaSlides extends Component {

    constructor (props) {
        super(props);
        this.state = {
            colapsa: this.props.elemento.slides.length > 1,
            tamanhoIcone: window.innerHeight*0.029
        };
    }

    toggleColapsar = () => {
        this.props.dispatch({type: 'toggle-colapsar', selecionado: {elemento: this.props.ordem, slide: 0}});
    }

    clickColapsar = e => {
        if (this.props.selecionado.elemento === this.props.ordem && !this.props.selecionado.slide) 
            e.stopPropagation();
        this.toggleColapsar();
    }

    botaoExcluirElemento = e => {
        e.stopPropagation();
        this.excluirElemento();
    }

    excluirElemento = () => {
        var elemento = this.props.elemento;
        var dadosMensagem = getDadosMensagem(elemento); 
        var pergunta = "Deseja excluir " + dadosMensagem.genero + ' ' + dadosMensagem.elemento + '?';
        const callback = fazer => {
        if (fazer)
            this.props.dispatch({type: 'deletar', elemento: this.props.ordem});
        }
        ativarPopupConfirmacao('simNao', 'Atenção', pergunta, callback);         
    }

    editarElemento = () => {
        var elemento = this.props.elemento;
        this.selecionar();
        this.props.dispatch({type: 'ativar-popup-adicionar',
                             popupAdicionar: {
                                tipo: elemento.tipo,
                                input1: elemento.input1,
                                input2: elemento.input2,
                                elementoASubstituir: this.props.ordem
                             }
        })
    }

    static getDerivedStateFromProps(props, state) {
        if ((props.elemento.slides.length > 1) !== state.colapsa) {
            return {colapsa: (props.elemento.slides.length > 1)}
        }
        return null;
    }

    eSelecionado = i => (this.props.selecionado.elemento === i && !this.props.selecionado.slide);

    getMargin = elemento => {
        var slidesPorLinha = 3;
        var proporcao = this.props.elemento.colapsado ? 0 : 0.2;
        var base = 1.5;
        return base + proporcao*(elemento.slides.length-1)/slidesPorLinha
    }

    getOpcoesMenu = () => {
        let strTipo = ' ' + (this.state.colapsa ? 'Grupo' : 'Slide')
        let opcoes = [
            {rotulo: 'Excluir' + strTipo, callback: this.excluirElemento},
            {rotulo: 'Duplicar' + strTipo, callback: () => this.props.dispatch({type: 'duplicar-slide', selecionado: {elemento: this.props.ordem, slide: 0}})},
            {rotulo: 'Editar' + strTipo, callback: this.editarElemento}
        ]
        if(this.state.colapsa) opcoes.push(
            {rotulo: this.props.elemento.colapsado ? 'Exibir Sublista' : 'Esconder Sublista', callback: this.toggleColapsar}
        )
        return opcoes;
    }

    selecionar = () => this.props.marcarSelecionado(this.props.ordem, (this.eEditavel() ? 0 : 0 + (this.props.elemento.slides.length > 1)))

    eEditavel = () => this.props.autorizacao === 'editar';

    render () {
        var elemento = this.props.elemento;
        var i = this.props.ordem;
        var editavel = this.eEditavel();
        return (            
            <MenuBotaoDireito opcoes={this.getOpcoesMenu()}>
                <li 
                    data-id={i}
                    key={i}
                    draggable={editavel}
                    className={'bloco-reordenar ' + (this.eSelecionado(i) ? 'selecionado' : '')}
                    onDragEnd={this.props.dragEnd}
                    onDragStart={this.props.dragStart}
                    onDragOver={this.props.dragOver}
                    ref={this.props.objRef.elemento} 
                    style={{marginTop: (this.eSelecionado(i) ? this.getMargin(elemento) + 'vh' : ''),
                            marginBottom: this.props.placeholder.posicao === i 
                            ? this.props.placeholder.tamanho + 'px' 
                            : (this.eSelecionado(i) ? this.getMargin(elemento) + (this.props.ultimo ? -2 : 0.4) + 'vh' : (this.props.ultimo ? '-1.5vh': ''))}}>
                    <div data-id={i} 
                         className={'itens lista-slides fade-estilizado ' + (!eEstiloVazio(elemento.slides[0].estilo) ? 'elemento-slide-estilizado' : '')} 
                         onClick={this.selecionar} ref={this.props.selecionado.slide ? null : this.props.objRef.slide}>
                        {editavel
                            ? <div className='quadradinho-canto'>
                                  <div data-id={i} className='botao-quadradinho' onClick={e => this.botaoExcluirElemento(e)}>✕</div>
                                  <div data-id={i} className='botao-quadradinho' onClick={e => this.editarElemento()}>
                                      <MdEdit size={this.state.tamanhoIcone*0.5}/>
                                  </div>
                              </div>
                            : null
                        }
                        <div className='texto-lista-slides'>
                            <b> {i}. {getNomeInterfaceTipo(elemento.tipo)}: </b>{(elemento.tipo === 'Imagem' && !elemento.titulo) ? elemento.imagens[0].alt : elemento.titulo}
                        </div>
                        {!this.state.colapsa ? null :
                            <ArrowColapsar tamanhoIcone={this.state.tamanhoIcone} colapsado={this.props.elemento.colapsado} onClick={this.clickColapsar}/>
                        }
                    </div>
                    {elemento.slides.length > 1 ? 
                        <SublistaSlides elemento={this.props.elemento} ordem={i} marcarSelecionado={this.props.marcarSelecionado} refSlide={this.props.objRef.slide}/> 
                    : null}
                </li>
            </MenuBotaoDireito>
        )
    }
}

const mapState = function (state) {
    var sP = state.present;
    return {selecionado: sP.selecionado, autorizacao: sP.apresentacao.autorizacao}
}
  
export default connect(mapState)(ItemListaSlides);