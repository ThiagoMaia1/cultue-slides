import React, { Component } from 'react';
import { connect } from 'react-redux';
// import './style.css';
import Carregando from '../Carregando/Carregando.jsx';
import ItemListaVideo from './ItemListaVideo';
import Element from '../../Element'

const url = 'https://api.vagalume.com.br/'
var vagalumeLetra;
let timer = 0;

class AdicionarVideo extends Component {

    constructor (props) {
        super(props);
        this.state = {opcoes: [], listaAtiva: false, letraMusica:{}, botaoVisivel: 'hidden', 
                      carregando: null, idBuscarLetra: this.props.input2}
    }
    onKeyUp(e) {
        clearTimeout(timer);
        this.toggleCarregador(true);
        var termo = e.target.value        
        timer = setTimeout(() => this.pegarMusicas(termo), 200);
    }
    
    toggleCarregador (estado) {
        this.setState({carregando: estado ? <Carregando tamanho={3} noCanto={true}/> : null});
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
            var musica = vagalumeLetra.response.mus[0];
            var letra = musica.text.split(/(?=\n\n)/); //Separa em paragrafos
            var letraLinhas = letra.map(l => ({paragrafo: l.replace('\n\n','\n'), linhas: l.split('\n').length-1})); //Conta \n no parágrafo.
            var linhasTotais = letraLinhas.reduce((ac, p) => ac + p.linhas, 0) + 2.5;
            var linhasMetade = Math.ceil(linhasTotais/2);
            var [ letraEsquerda, letraDireita, contLinhas ]  = [[], [], 0];
            for (var i = 0; i < letraLinhas.length; i++) {
                contLinhas += letraLinhas[i].linhas;
                
                if (contLinhas <= linhasMetade) {
                    letraEsquerda.push(<div className={'paragrafo-musica-esquerda'}>{letraLinhas[i].paragrafo}</div>);
                } else {
                    letraDireita.push(<div className={'paragrafo-musica-direita'}>{letraLinhas[i].paragrafo}</div>);
                }
            }
            letraDireita.push(
                <div className={'paragrafo-musica-direita link-letra'}>
                    <i><b><br></br>Fonte: </b>
                    <a href={musica.url} target="_blank" rel="noopener noreferrer" >
                        {musica.url}
                    </a></i>
                </div>)
            this.setState({letraMusica: {esquerda: letraEsquerda, direita: letraDireita}, idBuscarLetra: null, botaoVisivel: 'visible', 
                            elemento: new Element('Música', vagalumeLetra.response.mus[0].name, letra)})
            })
            
        vagalumeLetra.open('GET', url + 'search.php?musid=' + id);
        vagalumeLetra.send();
    }

    onClick(e) {
        // popupAdicionar: popupAdicionar,
        // elementoASubstituir: this.props.elementoASubstituir
        this.props.dispatch({type: 'inserir', elemento: this.state.elemento});
    }

    render () {
        return (
            <div className='conteudo-popup'>
                <div style={{width: '100%'}}>
                    <div>
                        <h4 className='titulo-popup'>Incorporar Vídeo do Youtube</h4>
                        <div style={{position: 'relative'}}>
                            {this.state.carregando}
                            <input className='combo-popup' type='text' autoComplete='off' defaultValue={this.props.input1} 
                                   placeholder='Pesquise por nome, artista ou trecho' onKeyUp={e => this.onKeyUp(e)} />
                        </div>
                    </div>
                    <div className='container-opcoes-musica'>
                        <div className='opcoes-musica'>
                            {this.state.opcoes.map(mus => 
                                <ItemListaVideo musica={mus} buscarLetra={this.buscarLetra} idBuscarLetra={this.state.idBuscarLetra}/>
                            )}
                        </div>
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
                    <div>
                        <button className='botao' style={{visibility: String(this.state.botaoVisivel)}} onClick={e => this.onClick(e)}>Inserir Música</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect()(AdicionarVideo);