import React from 'react';
import './style.css';
import { connect } from 'react-redux';
import { reverterSuperscrito } from '../Preview/TextoPreview.jsx';

class Arrastar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {...props, aberto: 'hidden', selecionado: 0, placeholder: -1};
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
    if (!this.over.className) return;
    var novaOrdem = [...this.props.elementos];
    var from = Number(this.dragged.dataset.id);
    var to = Number(this.over.dataset.id)+1;
    if(from < to) to--;
    novaOrdem.splice(to, 0, novaOrdem.splice(from, 1)[0]);
    this.props.dispatch({type:'reordenar', novaOrdemElementos: novaOrdem, novaSelecao: {elemento: to, slide: 0}});
    this.setState({placeholder: -1});
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
    this.props.dispatch({type: 'definir-selecao', novaSelecao: {elemento: item, slide: slide}})
  }

  excluirElemento = (e) => {
    var elemento = this.props.elementos[e.target.dataset.id];
    var resposta = window.confirm("Deseja excluir " + (elemento.tipo.slice(-1) === 'o' ? 'o ' : 'a ') 
                                  + elemento.tipo.toLowerCase().replace('-',' ') + " '" + elemento.titulo + "'?" );
    if (resposta)
      this.props.dispatch({type: 'deletar', elemento: e.target.dataset.id});
  }

	render() {

    var listItems = this.props.elementos.map((item, i) => {
      if (i === 0) return null;
      //Se item tem múltiplos slides, cria subdivisão ol.
      if (item.slides.length > 1) { 
        var listSlides = (<ol className='sublista'>
          {item.slides.map((slide, j) => {
            if (j === 0) return null; //Pula o slide 0, pois se tem múltiplos slides, o slide 0 é o mestre.
            var conteudo = slide.texto.substr(0, 50);
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
            style={{marginBottom: i === this.state.placeholder ? this.tamanhoPlaceholder + 'px' : ''}}>
            <div className='div-excluir'>
              <div data-id={i} className='excluir-elemento' onClick={e => this.excluirElemento(e)}>x</div>
            </div>
            <div data-id={i} className={'itens ' + item.tipo}
                 onClick={() => this.marcarSelecionado(i, 0)}>
              <b>{i}. {item.tipo}: </b>{item.titulo}
            </div>
            {listSlides}
          </li>
      )
    });
    return (
      <div>
        <div className="coluna arrastar">
          <div className='gradiente-coluna emcima'></div>
          <div className='gradiente-coluna embaixo'></div>
          <ol id="ordem-elementos">
            <div id="slide-mestre" className={'itens ' + (this.props.selecionado.elemento ? '' : 'selecionado')} data-id={0}
              onClick={() => this.marcarSelecionado(0, 0)}
              onDragOver={this.dragOver.bind(this)}
              style={{marginBottom: 0 === this.state.placeholder ? this.tamanhoPlaceholder + 'px' : ''}}>Slide-Mestre
            </div>
            {listItems}
          </ol>
        </div>
      </div>
    )
  }
}

const mapStateToProps = function (state) {
  return {elementos: state.elementos, selecionado: state.selecionado}
}

export default connect(mapStateToProps)(Arrastar);