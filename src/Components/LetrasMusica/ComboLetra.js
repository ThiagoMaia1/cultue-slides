import React, { Component } from 'react';
import Button from './Button';
// import './style.css';

const url = 'https://api.vagalume.com.br/'

class ComboLetra extends Component {

    constructor (props) {
        super(props);
        this.state = {opcoes: [], letra:"", visivel: false}
    }
    onKeyUp(termo) {
        if (termo.length < 5) return;
        var vagalume = new XMLHttpRequest()
        vagalume.responseType = 'json';
        
        vagalume.addEventListener('load', () => {    
            this.setState({opcoes: vagalume.response.response.docs.map(mus => (
                <option key={mus.id} value={mus.title}>{mus.band}</option>
            ))})
            for (var i of vagalume.response.response.docs) {
                if (termo === i.title) {
                    this.setState({visivel: true})
                    break;
                }
            }
        })
        
        vagalume.open('GET', url + 'search.excerpt?q=' + encodeURIComponent(termo) + '&limit=5');
        vagalume.send();
             
    }

    onClick() {
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
                <input type="text" list="data" onKeyUp={(e) => {this.onKeyUp(e.target.value)}} />
                <datalist id="data">
                    {this.state.opcoes}
                </datalist>
                <Button visibility={this.state.visivel} onClick={this.onClick}/>
            </>
        )
    }
}

export default ComboLetra;