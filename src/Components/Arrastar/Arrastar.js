import React from 'react';
import './style.css';
import Adicionar from './Adicionar';

var placeholder = document.createElement("li",);
placeholder.className = "placeholder";

class Element {
  constructor(id, apiKey, tipo, título, texto) {
    this.id = id;
    this.apiKey = apiKey;
    this.tipo = tipo;
    this.título = título;
    this.texto = texto;  
  }
}

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {...props};
    this.atualizarLista = this.atualizarLista.bind(this);
  }
  atualizarLista(novoValor) {
      this.setState([...this.state.lista, novoValor]);
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
    var data = this.state.lista;
    var from = Number(this.dragged.dataset.id);
    var to = Number(this.over.dataset.id);
    if(from < to) to--;
    this.marcarSelecionado(document.getElementById("ordem-elementos").children[to]);
    data.splice(to, 0, data.splice(from, 1)[0]);
    this.setState({lista: data});
  }
  
  dragOver(e) {
    e.preventDefault();
    this.dragged.style.display = "none";
    if(e.target.className === 'placeholder') return;
    this.over = e.target;
    e.target.parentNode.insertBefore(placeholder, e.target);
  }

  onClick() {
    this.setState({aberto: true});
  }

  marcarSelecionado(e) {
    var el = document.getElementById("selecionado");
    if (el != null) el.removeAttribute("id");
    e.id = "selecionado";
  }

	render() {
    var listItems = this.state.lista.map((item, i) => {
      return (
          <li 
            data-id={i}
            key={i}
            draggable='true'
            className={item.tipo}
            onDragEnd={this.dragEnd.bind(this)}
            onClick={e => (this.marcarSelecionado(e.target))}
            onDragStart={this.dragStart.bind(this)}>{item.tipo + ": " + item.titulo}</li>
      )
     });
		return (
			<div>
        <ul id="ordem-elementos" onDragOver={this.dragOver.bind(this)}>
          {listItems}
          <li data-id={this.state.lista.length} onClick={this.onClick.bind(this)}>Adicionar Elemento</li>
        </ul>
          <Adicionar visibility={this.state.aberto} atualizarLista={this.atualizarLista} />
      </div>
    )
	}
}

class Arrastar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
      lista: [1,2,3]
      
      // lista: [new Element(1,null,"Bíblia","João 3:16","Porque Deus amou o mundo de tal maneira"),
      // new Element(2,null,"Bíblia","João 3:16","Porque Deus amou o mundo de tal maneira"),
      // new Element(3,null,"Bíblia","João 3:16","Porque Deus amou o mundo de tal maneira"),
      // new Element(4,null,"Bíblia","João 3:16","Porque Deus amou o mundo de tal maneira"),
      // new Element(5,null,"Bíblia","João 3:16","Porque Deus amou o mundo de tal maneira"),
      // new Element(6,null,"Bíblia","João 3:16","Porque Deus amou o mundo de tal maneira"),
      // ]
    }
  }
	render() {
		return (
			<div>
        <List lista={this.state.lista} />	
			</div>
		)
	}
}

export default Arrastar;