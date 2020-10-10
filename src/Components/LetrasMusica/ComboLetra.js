import React, { Component } from 'react';
import { connect } from 'react-redux';
import './style.css';

const url = 'https://api.vagalume.com.br/search.'

class ComboLetra extends Component {

    constructor (props) {
        super(props);
        this.state = {opcoes: [], letra:"", visivel: 'hidden'}
    }
    onKeyUp(e) {
        var termo = e.target.value;
        if (termo.length < 5) return;
        var vagalume = new XMLHttpRequest()
        vagalume.responseType = 'json';
        
        vagalume.addEventListener('load', () => {    
            this.setState({opcoes: vagalume.response.response.docs.map(mus => (
            <div apiKey={mus.id} className='itens sombrear-selecao' onClick={() => this.buscarLetra(mus.id)}>
                <span className='titulo-musica'>{mus.title} - </span>
                <span className='banda-musica'>{mus.band}</span>
            </div>
                
            ))})
            for (var i of vagalume.response.response.docs) {
                if (termo === i.title) {
                    this.setState({visivel: 'visible'})
                    break;
                }
            }
        })
        
        vagalume.open('GET', url + 'excerpt?q=' + encodeURIComponent(termo) + '&limit=5');
        vagalume.send();
             
    }

    buscarLetra(id) {
        console.log(id);
        var vagalume = new XMLHttpRequest()
        vagalume.responseType = 'json';
        
        vagalume.addEventListener('load', () => {
            this.setState({letraMusica: vagalume.response.mus[0].text})
        })
        
        vagalume.open('GET', url + 'php?musid=' + id);
        vagalume.send();
    }

    onClick(e) {
        //Criar evento pra inserir a música
        //Limpar valor do texto
        //this.setState({opcoes: []});
        console.log("Música Incluída!");
        //document.getElementById()
    }

    render () {
        return (
            <>
                <h4>Buscar música por título, artista ou trecho:</h4>
                <input id='combo-musica' type='text' autocomplete='off' onKeyUp={e => this.onKeyUp(e)}/>
                <div>
                    {this.state.opcoes}
                </div>
                <button visibility={this.state.visivel} onClick={this.onClick}>Inserir Música</button>
                <div style={{whiteSpace: 'pre-wrap', overflow:'auto'}}>{this.state.letraMusica}</div>
            </>
        )
    }
}

export default connect()(ComboLetra);