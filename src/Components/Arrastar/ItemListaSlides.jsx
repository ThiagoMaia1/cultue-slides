import React, { Component } from 'react';
import SublistaSlides from './SublistaSlides';
import { connect } from 'react-redux';
import { MdKeyboardArrowUp, MdKeyboardArrowDown, MdEdit } from 'react-icons/md';
import { ativarPopupConfirmacao } from '../Popup/PopupConfirmacao';
import { getNomeInterfaceTipo, Estilo, getDadosMensagem } from '../../Element';

const estiloVazio = JSON.stringify(new Estilo());

class ItemListaSlides extends Component {

    constructor (props) {
        super(props);
        this.state = {
            colapsa: this.props.elemento.slides.length > 1,
            tamanhoIcone: window.innerHeight*0.029
        };
    }

    toggleColapsar = e => {
        if (this.props.selecionado.elemento === this.props.ordem && !this.props.selecionado.slide) 
            e.stopPropagation();
        this.props.dispatch({type: 'toggle-colapsar', selecionado: {elemento: this.props.ordem, slide: 0}});
    }

    excluirElemento = (e) => {
        e.stopPropagation();
        var elemento = this.props.elemento;
        var dadosMensagem = getDadosMensagem(elemento); 
        var pergunta = "Deseja excluir " + dadosMensagem.genero + ' ' + dadosMensagem.elemento + '?';
        const callback = fazer => {
        if (fazer)
            this.props.dispatch({type: 'deletar', elemento: this.props.ordem});
        }
        ativarPopupConfirmacao('simNao', 'Atenção', pergunta, callback);         
    }

    editarElemento = (e) => {
        e.stopPropagation();
        var elemento = this.props.elemento;
        this.props.dispatch({type: 'ativar-popup-adicionar',
                             popupAdicionar: {
                                tipo: elemento.tipo,
                                input1: elemento.input1,
                                input2: elemento.input2,
                                elementoASubstituir: this.props.selecionado.elemento
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

    render () {
        var elemento = this.props.elemento;
        var i = this.props.ordem;
        var editavel = this.props.autorizacao === 'editar';
        return (            
            <>
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
                    <div data-id={i} className='itens lista-slides' onClick={() => this.props.marcarSelecionado(i, (editavel ? 0 : 0 + (elemento.slides.length > 1)))} ref={this.props.selecionado.slide ? null : this.props.objRef.slide}>
                        {editavel
                            ? <div className='quadradinho-canto'>
                                  <div data-id={i} className='botao-quadradinho' onClick={e => this.excluirElemento(e)}>✕</div>
                                  <div data-id={i} className='botao-quadradinho' onClick={e => this.editarElemento(e)}>
                                      <MdEdit size={this.state.tamanhoIcone*0.5}/>
                                  </div>
                              </div>
                            : null
                        }
                        <div className={'fade-estilizado ' + (JSON.stringify(elemento.slides[0].estilo) !== estiloVazio ? 'elemento-slide-estilizado' : '')}>
                            <b> {i}. {getNomeInterfaceTipo(elemento.tipo)}: </b>{(elemento.tipo === 'Imagem' && !elemento.titulo) ? elemento.imagens[0].alt : elemento.titulo}
                        </div>
                        {this.state.colapsa ? 
                            (<div className='container-icone-colapsar'>
                                <div className='icone-colapsar' onClick={this.toggleColapsar}>
                                    {this.props.elemento.colapsado ? 
                                        <MdKeyboardArrowDown size={this.state.tamanhoIcone}/> :
                                        <MdKeyboardArrowUp size={this.state.tamanhoIcone}/> }
                                </div>
                            </div>) : null
                        }
                    </div>
                    {elemento.slides.length > 1 ? 
                        <SublistaSlides elemento={this.props.elemento} ordem={i} marcarSelecionado={this.props.marcarSelecionado} refSlide={this.props.objRef.slide}/> 
                    : null}
                </li>
            </>
        )
    }
}

const mapState = function (state) {
    var sP = state.present;
    return {selecionado: sP.selecionado, autorizacao: sP.apresentacao.autorizacao}
}
  
export default connect(mapState)(ItemListaSlides);