import React, { Component } from 'react';
import { connect } from 'react-redux';
import './style.css';
import Carregando from './Carregando.jsx';
import ItemListaMusica from './ItemListaMusica.jsx';
import { Element } from '../../index'

const url = 'https://api.vagalume.com.br/'
// const apiKey = 'a15ff8771c7c1a484b2c0fcfed2d3289'
var vagalumeLetra;
let timer = 0;
// var generoMusica = [];

class ComboLetra extends Component {

    constructor (props) {
        super(props);
        this.state = {opcoes: [], listaAtiva: false, letraMusica:{}, botaoVisivel: 'hidden', 
                      carregando: null, idBuscarLetra: null}
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
            this.setState({opcoes: vagalume.response.response.docs});
            this.toggleCarregador(false);
        });
        
        vagalume.open('GET', url + 'search.excerpt?q=' + encodeURIComponent(termo) + '&limit=4');
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
            var letra = vagalumeLetra.response.mus[0].text.split(/(?=\n\n)/);
            var letraEsquerda = [];
            var letraDireita = [];
            for (var i = 0; i < letra.length; i++) {
                if (i < Math.ceil(letra.length / 2)) {
                    letraEsquerda.push(<div className={'paragrafo-musica-esquerda'}>{letra[i]}</div>);
                } else {
                    letraDireita.push(<div className={'paragrafo-musica-direita'}>{letra[i]}</div>);
                }
            }
            this.setState({letraMusica: {esquerda: letraEsquerda, direita: letraDireita}, idBuscarLetra: null, botaoVisivel: 'visible', 
                            elemento: new Element('Música', vagalumeLetra.response.mus[0].name, letra)})
            })
            
        vagalumeLetra.open('GET', url + 'search.php?musid=' + id);
        vagalumeLetra.send();
    }

    onClick(e) {
        this.props.dispatch({type: 'inserir', elemento: this.state.elemento});
    }

    render () {
        return (
            <div className='conteudo-popup'>
                <div>
                    <div>
                        <h4>Pesquisa de Música</h4>
                        {this.state.carregando}
                        <input className='combo-popup' type='text' autoComplete='off' placeholder='Pesquise por nome, artista ou trecho' onKeyUp={e => this.onKeyUp(e)} />
                    </div>
                    <div className='opcoes-musica'>
                        {this.state.opcoes.map(mus => 
                            <ItemListaMusica musica={mus} buscarLetra={this.buscarLetra} idBuscarLetra={this.state.idBuscarLetra}/>
                        )}
                    </div>
                </div>
                <div className='container-divisao-popup'>
                    <div className='container-preview'>
                        <div className='texto-inserir'>
                            <div className='paragrafos-esquerda'>
                                {this.state.letraMusica.esquerda}
                            </div>
                            <div className='paragrafos-direita'>
                                {this.state.letraMusica.direita}
                            </div>
                        </div>
                    </div>
                    <button className='botao' style={{visibility: String(this.state.botaoVisivel)}} onClick={e => this.onClick(e)}>Inserir Música</button>
                </div>
            </div>
        )
    }
}

export default connect()(ComboLetra);

    //Filtrar apenas músicas gospel (requisições demais, e requisição está com problema, API do vagalume foi descontinuado)
    // filtrarGenero(vagalume, index) {
    //     if (index >= vagalume.length || this.state.opcoes.length >= 5) {
    //         this.toggleCarregador(false);
    //         return;
    //     }
    //     generoMusica.push(new XMLHttpRequest())
    //     generoMusica[generoMusica.length - 1].responseType = 'json';
        
    //     generoMusica[generoMusica.length - 1].addEventListener('load', () => {
    //         for (var i in generoMusica[generoMusica.length - 1].response.artist.genre) {
    //             if (i.name = /gospel/g) {
    //                 this.setState({opcoes: [...this.state.opcoes, vagalume[index]]});
    //             }
    //         }    
    //         this.toggleCarregador(false);
    //     })
        
    //     console.log(url + encodeURIComponent(vagalume[index].url.split('/')[1]) + '/index.js&apikey=' + apiKey);
    //     generoMusica[generoMusica.length - 1].open('POST', url + encodeURIComponent(vagalume[index].url.split('/')[1]) + '/index.js&apikey=' + apiKey);
    //     generoMusica[generoMusica.length - 1].setRequestHeader('Access-Control-Allow-Origin', '*');
    //     generoMusica[generoMusica.length - 1].setRequestHeader('Access-Control-Allow-Credentials', 'true');
    //     generoMusica[generoMusica.length - 1].send();
    //     this.filtrarGenero(vagalume, index + 1)
    // }