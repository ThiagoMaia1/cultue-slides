import React from 'react';
import './style.css';
//import { Element } from '../../index'
import { connect } from 'react-redux';

var placeholder = document.createElement("li",);
placeholder.className = "placeholder";

class Arrastar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {...props, aberto: 'hidden'};
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
    var data = this.props.elementos;
    var from = Number(this.dragged.dataset.id);
    var to = Number(this.over.dataset.id);
    if(from < to) to--;
    this.marcarSelecionado(document.getElementById("ordem-elementos").children[to]);
    data.splice(to, 0, data.splice(from, 1)[0]);
    this.setState({elementos: data});
  }
  
  dragOver(e) {
    e.preventDefault();
    //if (e.parentNode.id !== "ordem-elementos") return;
    this.dragged.style.display = "none";
    if(e.target.className === 'placeholder') return;
    this.over = e.target;
    e.target.parentNode.insertBefore(placeholder, e.target);
  }

  marcarSelecionado(e) {
    var el = document.getElementById("elemento-selecionado");
    if (el != null) el.removeAttribute("id");
    e.id = "elemento-selecionado";
  }

  toggleAdicionar(e, visivel) {
    if (!document.getElementById('popup')) {
      this.setState({aberto: visivel});
    }
  }

	render() {
    var listItems = this.props.elementos.map((item, i) => {
      return (
          <li 
            identificacaoelemento = {item.id}
            data-id={i}
            key={i}
            draggable='true'
            className={item.tipo + ' itens'}
            onDragEnd={this.dragEnd.bind(this)}
            onClick={e => (this.marcarSelecionado(e.target))}
            onDragStart={this.dragStart.bind(this)}
            onDragOver={this.dragOver.bind(this)}> {item.tipo + ": " + item.título}</li>
      )
     });
		return (
			<div>
        <div className="coluna" onMouseLeave={e => (this.toggleAdicionar(e, 'hidden'))}>
          <ul id="ordem-elementos">
            {listItems}
            <li className='itens' 
              data-id={this.props.elementos.length}
              onDragOver={this.dragOver.bind(this)} 
              onMouseOver={e => (this.toggleAdicionar(e, 'visible'))}
              style={{visibility: (this.state.aberto === 'visible' ? 'hidden' : 'visible'), position:(this.state.aberto === 'visible' ? 'absolute' : '')}}>Adicionar Elemento
            </li>
          </ul>
        </div>
      </div>
    )
	}
}

const mapStateToProps = function (state) {
  return {elementos: state.elementos}
}

export default connect(mapStateToProps)(Arrastar);