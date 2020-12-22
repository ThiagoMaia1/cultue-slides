import React, { Component } from 'react';
import { connect } from 'react-redux';
import './style.css';
import Carregando from '../../../Basicos/Carregando/Carregando.jsx';
import ItemListaMusica from './ItemListaMusica.jsx';
import Element from '../../../../principais/Element';
import logoVagalume from './Logo Vagalume.png';
import Checkbox from '../../../Basicos/Checkbox/Checkbox';
import Carrossel from '../../../Basicos/Carrossel/Carrossel';
import PesquisaGoogle from './PesquisaGoogle';

const url = 'https://api.vagalume.com.br/';
var vagalumeLetra;

class AdicionarMusica extends Component {

    constructor (props) {
        super(props);
        this.state = {opcoes: [], listaAtiva: false, letraMusica:{}, botoesVisiveis: false, buscandoLetra: false,
                      carregando: null, idBuscarLetra: this.props.input2, divisivel: false,
                      duasColunas: false, multiplicadores: true, omitirRepeticoes: true, input2: this.props.input2
                    }
        this.listaCheckboxes = [{label: 'Omitir Repetições', opcao: 'omitirRepeticoes'},
                                {label: 'Multiplicadores', opcao: 'multiplicadores'}
                                // {label: 'Dividir em Colunas', opcao: 'duasColunas'}
        ];
    }

    onKeyUp(e) {
        clearTimeout(this.timer);
        let termo = e.target.value;
        if (!termo || termo === this.termoPesquisa) return;
        this.toggleCarregador(true);
        this.timer = setTimeout(() => {
            this.termoPesquisa = termo;
            this.pegarMusicas(termo)
        }, 200);
    }
    
    toggleCarregador (estado) {
        this.setState({carregando: estado ? <Carregando tamanho={3} noCanto={true}/> : null});
    }

    pegarMusicas (termo){
        this.pegarMusicasGoogle(termo);
        var vagalume = new XMLHttpRequest()
        vagalume.responseType = 'json';
        
        vagalume.addEventListener('load', () => {    
            var opcoes = vagalume.response.response.docs;
            this.setState({opcoes: opcoes});
            this.setState({listaAtiva: opcoes.length > 0});
            if (this.input2) {
                this.input2 = null;
                this.buscarLetra(this.state.idBuscarLetra);
            }
        });
        
        vagalume.open('GET', url + 'search.excerpt?q=' + encodeURIComponent(termo) + '&limit=15');
        vagalume.send();
    }    

    pegarMusicasGoogle = termo => {
        // var inputGoogle = google.search.cse.element.getElement('pesquisaVagalume');
        // inputGoogle.execute(termo);
        // inputGoogle.execute('"' + termo + '"');
        var inputGoogle = document.querySelectorAll('input.gsc-input')[0];
        var botaoGoogle = document.querySelectorAll('button.gsc-search-button')[0];        
        inputGoogle.value = '"' + termo + '"';
        botaoGoogle.click();
        inputGoogle.value = termo;
        botaoGoogle.click();
    }

    callbackPesquisaGoogle = (termo, trecho) => {
        var vagalumeDeGoogle = new XMLHttpRequest()
        vagalumeDeGoogle.responseType = 'json';
        
        vagalumeDeGoogle.addEventListener('load', () => {    
            var opcao = {...vagalumeDeGoogle.response.response.docs[0], trecho};
            var opcoesFiltrado = this.state.opcoes.filter(o => o.id !== opcao.id);
            this.setState({opcoes: [opcao, ...opcoesFiltrado]});
            this.setState({listaAtiva: this.state.opcoes.length > 0});
            this.toggleCarregador(false);
        });
        
        vagalumeDeGoogle.open('GET', url + 'search.excerpt?q=' + encodeURIComponent(termo) + '&limit=1');
        vagalumeDeGoogle.send();
    }

    buscarLetra = (id, tituloArtista) => {
        if (id === this.state.idBuscarLetra) return;
        if (vagalumeLetra instanceof XMLHttpRequest) {        
            vagalumeLetra.abort();
        }
        this.setState({idBuscarLetra: id, tituloArtista, buscandoLetra: true});
        vagalumeLetra = new XMLHttpRequest();
        vagalumeLetra.responseType = 'json';
            
        vagalumeLetra.addEventListener('load', () => {
            var musica = vagalumeLetra.response.mus[0];
            var letra = musica.text.split(/\n\n/); //Separa em paragrafos
            if (letra.length === 1) {
                var linhas = letra[0].split('\n');
                var metade = Math.floor((linhas.length+2))/2;
                letra[0] = linhas.slice(0, metade).join('\n');
                letra[1] = linhas.slice(metade).join('\n');
            }
            var letraLinhas = letra.map(l => ({paragrafo: l, linhas: l.split('\n').length-1})); //Conta \n no parágrafo.
            var linhasTotais = letraLinhas.reduce((ac, p) => ac + p.linhas, 0) + 2.5;
            var linhasMetade = Math.ceil(linhasTotais/2);
            var [ letraEsquerda, letraDireita, contLinhas ]  = [[], [], 0];
            for (var i = 0; i < letraLinhas.length; i++) {
                contLinhas += letraLinhas[i].linhas;
                
                if (contLinhas <= linhasMetade) {
                    letraEsquerda.push(<div className='paragrafo-musica-esquerda'>{letraLinhas[i].paragrafo}<br></br><br></br></div>);
                } else {
                    letraDireita.push(<div className='paragrafo-musica-direita'>{letraLinhas[i].paragrafo}<br></br><br></br></div>);
                }
            }
            letraDireita.push(
                <div className={'paragrafo-musica-direita link-letra'}>
                    <i><b>Fonte: </b>
                    <a href={musica.url} target="_blank" rel="noopener noreferrer" >
                        {musica.url}
                    </a></i>
                </div>)
            this.setState({letraMusica: {esquerda: letraEsquerda, direita: letraDireita}, botoesVisiveis: true, 
                           listaAtiva: false, buscandoLetra: false,
                           elemento: new Element('Música', vagalumeLetra.response.mus[0].name, letra, null, 
                                     {paragrafo: {...this.getEstiloParagrafo()}}
                           )
            });
        })
            
        vagalumeLetra.open('GET', url + 'search.php?musid=' + id);
        vagalumeLetra.send();
    }

    getEstiloParagrafo = () => (
        this.listaCheckboxes.reduce((resultado, c) => {
            var obj = {};
            obj[c.opcao] = this.state[c.opcao];
            return {...resultado, ...obj};
        }, {})
    )
    
    onClick = () => {
        var popupAdicionar = {input1: this.termoPesquisa, input2: this.state.idBuscarLetra};                           
        this.props.dispatch({type: 'inserir', 
                             elemento: this.state.elemento,
                             popupAdicionar: popupAdicionar,
                             elementoASubstituir: this.props.elementoASubstituir
        });
    }

    limparInput = () => {
        this.refCombo.value = '';
        this.setState({letraMusica: {}, botoesVisiveis: false, opcoes: [], carregando: null, buscandoLetra: false})
        setTimeout(() => this.refCombo.focus(), 1);
    }

    toggleCheckbox = opcao => {
        const obj = {};
        obj[opcao] = !this.state[opcao];
        this.setState(obj);
    }

    componentDidMount() {
        if (this.refCombo) this.refCombo.focus();
    }

    render () {
        if (this.props.input1) setTimeout(() => this.pegarMusicas(this.props.input1), 0);
        return (
            <div className='conteudo-popup'>
                <PesquisaGoogle callback={this.callbackPesquisaGoogle}/>
                <div className='wraper-popup'>
                    <div>
                        <h4 className='titulo-popup'>Pesquisa de Música</h4>
                        <div className='wraper-popup'>
                            {this.state.carregando}
                            <input ref={el => this.refCombo = el} 
                                   className={'combo-popup' + (this.state.carregando ? ' input-com-carregando' : '')} 
                                   type='text' 
                                   autoComplete='off'
                                   onKeyUp={e => this.onKeyUp(e)}
                                   onFocus={() => this.setState({listaAtiva: this.state.opcoes.length > 0})}
                                   defaultValue={this.props.input1} 
                                   placeholder='Pesquise por nome, artista ou trecho'/>
                        </div>
                    </div>
                    <div className='container-opcoes-musica container-carrossel' 
                         style={this.state.listaAtiva ? null : {display: 'none'}}>
                        <Carrossel tamanhoIcone={45} tamanhoMaximo='30vh' direcao='vertical' style={{zIndex: '400'}} beiradaFinal={10}>
                            <div className='opcoes-musica'>
                                {this.state.opcoes.map(mus => 
                                    <ItemListaMusica musica={mus} buscarLetra={this.buscarLetra} idBuscarLetra={this.state.idBuscarLetra} 
                                                     buscandoLetra={this.state.buscandoLetra}/>
                                )}
                            </div>
                        </Carrossel>
                    </div>
                </div>
                <div id='preview-musica' className='container-preview combo-popup container-carrossel'>
                    {JSON.stringify(this.state.letraMusica) === '{}'
                        ? <div className='wraper-popup'>
                            <div id='div-logo-vagalume'>
                                <a href='https://www.vagalume.com.br/' target="_blank" rel="noopener noreferrer">
                                    <img id='logo-vagalume' src={logoVagalume} alt='Logo Vagalume'/>
                                </a>
                            </div>
                        </div>                    
                        : <Carrossel tamanhoIcone={45} tamanhoMaximo='100%' direcao='vertical' style={{zIndex: '400'}} beiradaFinal={10}>
                            <div>
                                <div className='titulo-artista'>{this.state.tituloArtista}</div>
                                <div className='texto-inserir'>
                                    <div className='paragrafos-esquerda'>
                                        {this.state.letraMusica.esquerda}
                                    </div>
                                    <div className='paragrafos-direita'>
                                        {this.state.letraMusica.direita}
                                    </div>
                                </div>
                            </div>
                        </Carrossel>
                    }
                </div>
                <div className='container-divisao-popup'>
                    <div className='checkboxes-popup'>
                        {this.listaCheckboxes.map(c => 
                            <Checkbox label={c.label} checked={this.state[c.opcao]} disabled={c.disabled}
                                      onClick={() => this.toggleCheckbox(c.opcao)}/>
                        )}
                    </div>
                    <div className='container-botoes-popup'>
                        <button className='botao' onClick={e => this.onClick(e)} 
                                style={this.state.botoesVisiveis ? null : {visibility: 'hidden'}}>
                                    Inserir Música
                        </button>
                        <button className='botao limpar-input' onClick={this.limparInput}>✕ Limpar</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect()(AdicionarMusica);

// const apiKey = 'a15ff8771c7c1a484b2c0fcfed2d3289'
// var generoMusica = [];
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
    
//     generoMusica[generoMusica.length - 1].open('POST', url + encodeURIComponent(vagalume[index].url.split('/')[1]) + '/index.js&apikey=' + apiKey);
//     generoMusica[generoMusica.length - 1].setRequestHeader('Access-Control-Allow-Origin', '*');
//     generoMusica[generoMusica.length - 1].setRequestHeader('Access-Control-Allow-Credentials', 'true');
//     generoMusica[generoMusica.length - 1].send();
//     this.filtrarGenero(vagalume, index + 1)
// }


