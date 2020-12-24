import React from 'react';
import './ListaSlides.css';
import { connect } from 'react-redux';
import Adicionar from './Adicionar';
import Carrossel from '../Basicos/Carrossel/Carrossel';
import ItemListaSlides from './ItemListaSlides';
import { zerarApresentacao } from '../../principais/firestore/apresentacoesBD';

class Arrastar extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.refElemento = React.createRef();
    this.refSlide = React.createRef();
    this.state = {painelAdicionar: props.elementos.length < 2, adicionarAcima: false, lElementos: props.elementos.length,
                  placeholder: {posicao: -1}, carrosselAtivo: false};
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

  componentDidUpdate = (prevProps) => {
    if(this.state.painelAdicionar && prevProps.elementos.length <= 1 && this.props.elementos.length > 1)
      this.setState({painelAdicionar: false});
  }

  componentDidMount = () => this.props.dispatch({type: 'definir-item-tutorial', itemTutorial: 'painelAdicionar'});

  static getDerivedStateFromProps = (props, state) => {
    var lAntes = state.lElementos;
    var lDepois = props.elementos.length;
    if (lAntes === 1 && lDepois > 1) props.dispatch({type: 'definir-item-tutorial', itemTutorial: 'slides'});
    if (lAntes <= 2 && lDepois > 2) props.dispatch({type: 'definir-item-tutorial', itemTutorial: 'arrastar'});
    return {lElementos: lDepois};
  }

	render() {
    var editavel = this.props.apresentacao.autorizacao === 'editar';
    var sel = this.props.selecionado;
    return (
      <div className='coluna-lista-slides'>
        <div className='gradiente-coluna emcima'></div>
        <div className='gradiente-coluna embaixo'></div>
        <Carrossel direcao='vertical' tamanhoIcone={50} tamanhoMaximo={'60vh'} 
                   style={{width: '21vw', overflow: 'hidden', ...(this.props.elementos.length < 2 ? {height: '3vh'} : {})}} 
                   refElemento={this.refElemento} refSlide={this.refSlide} beiradaFinal={8}>
            <ol ref={this.ref} id="ordem-elementos">
              { editavel 
                ? <div id="slide-mestre" className={'itens ' + (sel.elemento === 0 ? 'selecionado' : '')} data-id={0}
                    onClick={() => this.marcarSelecionado(0, 0)}
                    onDragOver={this.dragOver.bind(this)}
                    style={{marginBottom: this.state.placeholder.posicao === 0 ? this.state.placeholder.tamanho + 'px' : '', 
                    display: this.props.elementos.length === 1 ? 'none' : ''}}
                    ref={sel.elemento === 0 ? this.refElemento : null}>
                    <div data-id={0} id='criar-nova-apresentacao' className='botao-quadradinho quadradinho-canto' onClick={() => zerarApresentacao(this.props.usuario, this.props.apresentacao)}>*</div>
                    Slide-Mestre
                  </div>
                : null
              }
              {this.props.elementos.map((elemento, i) => {
                if (i === 0) return null;
                return(<ItemListaSlides elemento={elemento} ordem={i} key={i} placeholder={this.state.placeholder} 
                                        ultimo={i === this.props.elementos.length - 1}
                                        dragStart={this.dragStart} dragEnd={this.dragEnd} 
                                        dragOver={this.dragOver} 
                                        marcarSelecionado={this.marcarSelecionado} 
                                        objRef={sel.elemento === i ? {elemento: this.refElemento, slide: this.refSlide} : {}}/>)
              })}
            </ol>
        </Carrossel>
        { editavel
          ? <Adicionar/>
          : null
        }
      </div>
    )
  }
}

const mapState = function (state) {
  return {
    elementos: state.present.elementos, 
    selecionado: state.present.selecionado, 
    popupAdicionar: state.present.popupAdicionar,
    apresentacao: state.present.apresentacao,
    usuario: state.usuario,
  }
}

export default connect(mapState)(Arrastar);