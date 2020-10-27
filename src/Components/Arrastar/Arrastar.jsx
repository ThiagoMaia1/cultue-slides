import React from 'react';
import './style.css';
import { connect } from 'react-redux';
import { reverterSuperscrito } from '../Preview/TextoPreview.jsx';
import Adicionar from '../Configurar/Adicionar';
import Carrossel from '../Carrossel/Carrossel';
import Popup from '../Configurar/Popup/Popup';

class Arrastar extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.state = {...props, painelAdicionar: true, posicaoPainelAdicionar: {position: 'relative'}, 
                  selecionado: 0, placeholder: -1, carrosselAtivo: false};
  }

  dragStart(e) {
    this.dragged = e.currentTarget;
    this.marcarSelecionado(this.dragged.dataset.id, 0);
    this.tamanhoPlaceholder = this.dragged.offsetHeight;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.dragged);
  }

  dragEnd(e) {
    this.dragged.style.display = 'block';
    if (!this.over) return;
    var novaOrdem = [...this.props.elementos];
    var from = Number(this.dragged.dataset.id);
    var to = Number(this.over.dataset.id)+1;
    if(from < to) to--;
    novaOrdem.splice(to, 0, novaOrdem.splice(from, 1)[0]);
    this.props.dispatch({type:'reordenar', novaOrdemElementos: novaOrdem, selecionado: {elemento: to, slide: 0}});
    this.setState({placeholder: -1});
    [ this.over, this.dragged ] = [ null, null ];
  }
  
  dragOver(e) {
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
    this.setState({placeholder: Number(this.over.dataset.id)})
  }

  marcarSelecionado (item, slide) {
    var sel = this.props.selecionado
    if (sel.elemento === item && sel.slide === slide) {
      if (slide !== 0) {slide = 0} 
      else if(item !== 0) {item = 0} 
      else {return}
    }
    this.props.dispatch({type: 'definir-selecao', selecionado: {elemento: item, slide: slide}})
  }

  excluirElemento = (e) => {
    var elemento = this.props.elementos[e.target.dataset.id];
    var resposta = window.confirm("Deseja excluir " + (elemento.tipo.slice(-1) === 'o' ? 'o ' : 'a ') 
                                  + elemento.tipo.toLowerCase().replace('-',' ') + " '" + elemento.titulo + "'?" );
    if (resposta)
      this.props.dispatch({type: 'deletar', elemento: e.target.dataset.id});
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

    var listItems = this.props.elementos.map((item, i) => {
      if (i === 0) return null;
      //Se item tem múltiplos slides, cria subdivisão ol.
      if (item.slides.length > 1) { 
        var listSlides = (<ol className='sublista'>
          {item.slides.map((slide, j) => {
            if (j === 0) return null; //Pula o slide 0, pois se tem múltiplos slides, o slide 0 é o mestre.
            var conteudo = item.tipo !== 'Imagem' ? slide.texto.substr(0, 50) : (item.titulo || slide.imagem.alt);
            if (item.tipo === 'Texto-Bíblico') { //Se for da bíblia, pega o número do verso.
              var n = 0;
              var palavras = slide.texto.split(' ');
              do {
                var verso = reverterSuperscrito(palavras[n]);
                n++;
              } while (isNaN(verso))
              conteudo = 'v. ' + verso.padStart(2, 0);
            }
            return (
              <li className={'item-sublista ' + (this.props.selecionado.elemento === i && this.props.selecionado.slide === j ? 'selecionado' : '') + ' ' + item.tipo}
                  onClick={() => this.marcarSelecionado(i, j)} key={j}>
                  {conteudo}
              </li>
            )
          })
          }
        </ol>
        );
      }
      //Cria os li da lista de elementos.
      return (            
          <li 
            identificacaoelemento = {item.id}
            data-id={i}
            key={i}
            draggable='true'
            className={'bloco-reordenar ' + (this.props.selecionado.elemento === i && !this.props.selecionado.slide ? 'selecionado' : '')}
            onDragEnd={this.dragEnd.bind(this)}
            onDragStart={this.dragStart.bind(this)}
            onDragOver={this.dragOver.bind(this)}
            style={{marginBottom: this.state.placeholder === i ? this.tamanhoPlaceholder + 'px' : (i === this.props.elementos.length-1 ? '0': '')}}>
            <div className='div-excluir'>
              <div data-id={i} className='excluir-elemento' onClick={e => this.excluirElemento(e)}>✕</div>
            </div>
            <div data-id={i} className='itens lista-slides'
                 onClick={() => this.marcarSelecionado(i, 0)}>
              <b>{i}. {item.tipo}: </b>{(item.tipo === 'Imagem' && !item.titulo) ? item.imagens[0].alt : item.titulo}
            </div>
            {listSlides}
          </li>
      )
    });
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
                  style={{marginBottom: this.state.placeholder === 0 ? this.tamanhoPlaceholder + 'px' : '', 
                  display: this.props.elementos.length === 1 ? 'none' : ''}}>Slide-Mestre
                </div>
                {listItems}
              </ol>
          </Carrossel>
          <div className='tampao-do-overflow'>
            <div id="adicionar-slide" onClick={this.abrirPainelAdicionar} 
                  className={'botao-azul itens lista-slides ' + (this.props.elementos.length > 1 ? '' : 'selecionado')}>Adicionar Slide</div>
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
  return {elementos: state.elementos, selecionado: state.selecionado}
}

export default connect(mapStateToProps)(Arrastar);