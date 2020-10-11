import React, { Component } from 'react';
import { connect } from 'react-redux';
import './style.css';
import Carregando from './Carregando.jsx';
import ItemListaMusica from './ItemListaMusica.jsx';
import { Element } from '../../index'

const url = 'https://api.vagalume.com.br/search.'
var vagalumeLetra;
let timer = 0;

class ComboLetra extends Component {

    constructor (props) {
        super(props);
        this.state = {opcoes: [], letraMusica:"", visivel: 'hidden', carregando: null, idBuscarLetra: null}
    }
    onKeyUp(e) {
        clearTimeout(timer);
        this.toggleCarregador(true);
        var termo = e.target.value        
        timer = setTimeout(() => this.pegarMusicas(termo), 200);
    }
    
    toggleCarregador (estado) {
        this.setState({carregando: estado ? <Carregando /> : null});
    }

    pegarMusicas (termo){
        var vagalume = new XMLHttpRequest()
        vagalume.responseType = 'json';
        
        vagalume.addEventListener('load', () => {    
            this.setState({opcoes: vagalume.response.response.docs})
            this.toggleCarregador(false);
        })
        
        vagalume.open('GET', url + 'excerpt?q=' + encodeURIComponent(termo) + '&limit=5');
        vagalume.send();
    }    

    buscarLetra = id => {
        if (vagalumeLetra instanceof XMLHttpRequest) {        
            vagalumeLetra.abort();
        }
        this.setState({idBuscarLetra: id});
        vagalumeLetra = new XMLHttpRequest()
        vagalumeLetra.responseType = 'json';
            
        vagalumeLetra.addEventListener('load', () => {
                this.setState({letraMusica: vagalumeLetra.response.mus[0].text});
                this.setState({idBuscarLetra: null, visivel: 'visible', elemento: new Element(id, 'Música', vagalumeLetra.response.mus[0].name, this.state.letraMusica)})
            })
            
        vagalumeLetra.open('GET', url + 'php?musid=' + id);
        vagalumeLetra.send();
    }

    onClick(e) {
        this.props.dispatch({type: 'inserir', elemento: this.state.elemento});
    }

    render () {
        return (
            <>
                <h4>Pesquisa de Música</h4>
                {this.state.carregando}
                <input className='combo-popup' type='text' autoComplete='off' placeholder='Pesquise por nome, artista ou trecho' onKeyUp={e => this.onKeyUp(e)} />
                <div>
                    {this.state.opcoes.map(mus => 
                         <ItemListaMusica musica={mus} buscarLetra={this.buscarLetra} idBuscarLetra={this.state.idBuscarLetra}/>
                    )}
                </div>
                <div style={{height: '200px'}}>
                    <div style={{whiteSpace: 'pre-wrap', overflow:'auto'}}>{this.state.letraMusica}</div>
                    <button visibility={this.state.visivel} onClick={e => this.onClick(e)}>Inserir Música</button>
                </div>
            </>
        )
    }
}

export default connect()(ComboLetra);