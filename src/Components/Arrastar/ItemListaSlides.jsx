import React, { Component } from 'react';
import SublistaSlides from './SublistaSlides';
import { connect } from 'react-redux';
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from 'react-icons/md';
import PopupConfirmacao from '../Configurar/Popup/PopupConfirmacao';

class ItemListaSlides extends Component {

    constructor (props) {
        super(props);
        this.state = {
            colapsa: this.props.elemento.slides.length > 1,
            colapsado: false,
            tamanhoIcone: window.innerHeight*0.029 + 'px',
            popupConfirmacao: null
        };
    }

    toggleColapsar = e => {
        if (this.props.selecionado.elemento === this.props.ordem && !this.props.selecionado.slide) 
            e.stopPropagation();
        this.setState({colapsado: !this.state.colapsado})
    }

    
    excluirElemento = (e) => {
        e.stopPropagation();
        var elemento = this.props.elemento;
        var pergunta = "Deseja excluir " + (elemento.tipo.slice(-1) === 'o' ? 'o ' : 'a ') 
                        + elemento.tipo.toLowerCase().replace('-',' ') + " '" + elemento.titulo + "'?";
        const callback = fazer => {
          if(fazer) this.props.dispatch({type: 'deletar', elemento: this.props.ordem});
          this.setState({popupConfirmacao: null});
        }
        this.setState({popupConfirmacao: (<PopupConfirmacao titulo='Atenção' pergunta={pergunta} callback={callback}/>)});         
    }

    render () {
        var elemento = this.props.elemento;
        var i = this.props.ordem;
        return (            
            <>
                <li 
                    data-id={i}
                    key={i}
                    draggable='true'
                    className={'bloco-reordenar ' + (this.props.selecionado.elemento === i && !this.props.selecionado.slide ? 'selecionado' : '')}
                    onDragEnd={this.props.dragEnd}
                    onDragStart={this.props.dragStart}
                    onDragOver={this.props.dragOver}
                    style={{marginBottom: this.props.placeholder.posicao === i ? this.props.placeholder.tamanho + 'px' : (this.props.ultimo ? '0': '')}}>
                    <div data-id={i} className='itens lista-slides' onClick={() => this.props.marcarSelecionado(i, 0)}>
                        <div data-id={i} className='excluir-elemento' onClick={e => this.excluirElemento(e)}>✕</div>
                        <div><b> {i}. {elemento.tipo}: </b>{(elemento.tipo === 'Imagem' && !elemento.titulo) ? elemento.imagens[0].alt : elemento.titulo}</div>
                        {this.state.colapsa ? 
                            (<div className='container-icone-colapsar'>
                                <div className='icone-colapsar' onClick={this.toggleColapsar}>
                                    {this.state.colapsado ? 
                                        <MdKeyboardArrowDown size={this.state.tamanhoIcone}/> :
                                        <MdKeyboardArrowUp size={this.state.tamanhoIcone}/> }
                                </div>
                            </div>) : null
                        }
                    </div>
                    {elemento.slides.length > 1 && !this.state.colapsado ? 
                        <SublistaSlides elemento={this.props.elemento} ordem={i} marcarSelecionado={this.props.marcarSelecionado} /> 
                    : null}
                </li>
                {this.state.popupConfirmacao}
            </>
        )
    }
}

const mapStateToProps = function (state) {
    state = state.present;
    return {selecionado: state.selecionado, elementos: state.elementos}
}
  
export default connect(mapStateToProps)(ItemListaSlides);