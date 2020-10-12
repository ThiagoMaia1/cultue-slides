import React from 'react';
import './style.css';
//import { Element } from '../../index'
import { connect } from 'react-redux';

var placeholder = document.createElement("li",);
placeholder.className = "placeholder";

class Arrastar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {...props, aberto: 'hidden', selecionado: 0};
  }

  dragStart(e) {
    this.dragged = e.currentTarget;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.dragged);
  }

  dragEnd(e) {
    this.dragged.style.display = 'block';
    this.dragged.parentNode.removeChild(placeholder);
    
    // update state
    var novaOrdem = [...this.props.elementos];
    var from = Number(this.dragged.dataset.id)-1;
    var to = Number(this.over.dataset.id);
    if(from < to) to--;
    novaOrdem.splice(to, 0, novaOrdem.splice(from, 1)[0]);
    this.props.dispatch({type:'reordenar', novaOrdemElementos: novaOrdem});
    this.marcarSelecionado(to);
  }
  
  dragOver(e) {
    e.preventDefault();
    this.dragged.style.display = "none";
    if(e.target.className === 'placeholder') return;
    this.over = e.target;
    e.target.parentNode.insertBefore(placeholder, e.target.nextSibling);
  }

  marcarSelecionado (id) {
    this.setState({selecionado: id})
  }

	render() {
    var listItems = this.props.elementos.map((item, i) => {
      return (
          <li 
            identificacaoelemento = {item.id}
            data-id={i+1}
            key={i+1}
            draggable='true'
            className={item.tipo + ' itens ' + (i+1 === this.state.selecionado ? 'selecionado' : '')}
            onDragEnd={this.dragEnd.bind(this)}
            onClick={() => this.marcarSelecionado(i+1)}
            onDragStart={this.dragStart.bind(this)}
            onDragOver={this.dragOver.bind(this)}> <b>{i+1}. {item.tipo}: </b>{item.título}</li>
      )
     });
		return (
			<div>
        <div className="coluna">
          <ol id="ordem-elementos">
            <div id="configuracao-global" className={'itens ' + (this.state.selecionado ? '' : 'selecionado')} data-id={0}
              onClick={() => this.marcarSelecionado(0)}
              onDragOver={this.dragOver.bind(this)}>Configurações Globais
            </div>
            {listItems}
          </ol>
        </div>
      </div>
    )
	}
}

const mapStateToProps = function (state) {
  return {elementos: state.elementos}
}

export default connect(mapStateToProps)(Arrastar);