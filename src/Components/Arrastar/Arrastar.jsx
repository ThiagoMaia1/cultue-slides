import React from 'react';
import './style.css';
import { connect } from 'react-redux';
import Adicionar from '../Configurar/Adicionar';
import Carrossel from '../Carrossel/Carrossel';
import Popup from '../Configurar/Popup/Popup';
import ItemListaSlides from './ItemListaSlides';

class Arrastar extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.state = {...props, painelAdicionar: true, posicaoPainelAdicionar: {position: 'relative'}, 
                  selecionado: 0, placeholder: {posicao: -1}, carrosselAtivo: false};
  }

  dragStart = (e) => {
    this.dragged = e.currentTarget;
    this.marcarSelecionado(this.dragged.dataset.id, 0);
    this.setState({placeholder: {
      posicao: this.state.placeholder.posicao, 
      tamanho: this.dragged.offsetHeight
    }}); 
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.dragged);
  }

  dragEnd = (e) =>  {
    this.dragged.style.display = 'block';
    if (!this.over) return;
    var novaOrdem = [...this.props.elementos];
    var from = Number(this.dragged.dataset.id);
    var to = Number(this.over.dataset.id)+1;
    if(from < to) to--;
    novaOrdem.splice(to, 0, novaOrdem.splice(from, 1)[0]);
    this.props.dispatch({type:'reordenar', novaOrdemElementos: novaOrdem, selecionado: {elemento: to, slide: 0}});
    this.setState({placeholder: {posicao: -1}});
    [ this.over, this.dragged ] = [ null, null ];
  }
  
  dragOver = (e) =>  {
    e.preventDefault();
    this.dragged.style.display = "none";
    if(!(e.target.className.substr(0,6) === 'itens ')) {
      if(e.target.parentNode.className.substr(0, 15) === 'bloco-reordenar') {
        this.over = e.target.parentNode;
      } else {
        return;
      }
    } else {
      this.over = e.target;
    }
    this.setState({placeholder: {
      tamanho: this.state.placeholder.tamanho, 
      posicao: Number(this.over.dataset.id)
    }});
  }

  marcarSelecionado = (item, slide) => {
    var sel = this.props.selecionado;
    if (sel.elemento === item && sel.slide === slide) {
      if (slide !== 0) {slide = 0} 
      else if(item !== 0) {item = 0} 
      else {return}
    }
    this.props.dispatch({type: 'definir-selecao', selecionado: {elemento: item, slide: slide}})
  }

  abrirPainelAdicionar = () => {
    this.setState({painelAdicionar: !this.state.painelAdicionar,
                   posicaoPainelAdicionar: this.ref.current.offsetHeight >= 0.6*window.innerHeight ?
                                              {position: 'absolute', top: '-18vh'} :
                                              {position: 'relative'}});
  }

  abrirPopup = ComponenteConteudoPopup => {
    this.setState({popupCompleto: (
        <Popup ocultarPopup={() => this.setState({popupCompleto: null})}>
            <ComponenteConteudoPopup />
        </Popup>
    ), painelAdicionar: false});
  }

	render() {
    return (
      <>
        <div className='coluna-lista-slides'>
          <div className='gradiente-coluna emcima'></div>
          <div className='gradiente-coluna embaixo'></div>
          <Carrossel direcao='vertical' tamanhoIcone={50} refGaleria={this.ref} tamanhoMaximo={'55vh'} style={{zIndex: '20', width: '21vw', height: 'auto'}}>
              <ol ref={this.ref} id="ordem-elementos">
                <div id="slide-mestre" className={'itens ' + (this.props.selecionado.elemento === 0 ? 'selecionado' : '')} data-id={0}
                  onClick={() => this.marcarSelecionado(0, 0)}
                  onDragOver={this.dragOver.bind(this)}
                  style={{marginBottom: this.state.placeholder.posicao === 0 ? this.state.placeholder.tamanho + 'px' : '', 
                  display: this.props.elementos.length === 1 ? 'none' : ''}}>Slide-Mestre
                </div>
                {this.props.elementos.map((elemento, i) => {
                  if (i === 0) return null;
                  return(<ItemListaSlides elemento={elemento} ordem={i} placeholder={this.state.placeholder} ultimo={i === this.props.elementos.length - 1}
                          dragStart={this.dragStart} dragEnd={this.dragEnd} dragOver={this.dragOver} marcarSelecionado={this.marcarSelecionado}/>)
                })}
              </ol>
          </Carrossel>
          <div className='tampao-do-overflow'>
            <div id="adicionar-slide" onClick={this.abrirPainelAdicionar} 
                  className='botao-azul itens lista-slides'>Adicionar Slide</div>
            {this.state.painelAdicionar ? 
              <div className='container-adicionar' style={this.state.posicaoPainelAdicionar}><Adicionar callback={this.abrirPopup} /></div> : null} 
          </div>
        </div>
        {this.state.popupCompleto}
      </>
    )
  }
}

const mapStateToProps = function (state) {
  state = state.present;
  return {elementos: state.elementos, selecionado: state.selecionado}
}

export default connect(mapStateToProps)(Arrastar);