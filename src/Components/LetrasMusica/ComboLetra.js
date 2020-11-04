import React, { Component } from 'react';
import { connect } from 'react-redux';
import './style.css';
import Carregando from './Carregando.jsx';
import ItemListaMusica from './ItemListaMusica.jsx';
import Element from '../../Element';
import logoVagalume from './Logo Vagalume.png';
import Checkbox from '../Checkbox/Checkbox';
import Carrossel from '../Carrossel/Carrossel'

const url = 'https://api.vagalume.com.br/';
var vagalumeLetra;

class ComboLetra extends Component {

    constructor (props) {
        super(props);
        this.state = {opcoes: [], listaAtiva: false, letraMusica:{}, botoesVisiveis: false, 
                      carregando: null, idBuscarLetra: null, divisivel: false,
                      duasColunas: false, multiplicadores: true, omitirRepeticoes: true
                    }
        this.listaCheckboxes = [{label: 'Omitir Repetições', opcao: 'omitirRepeticoes'},
                                {label: 'Multiplicadores', opcao: 'multiplicadores'},
                                {label: 'Dividir em Colunas', opcao: 'duasColunas'}
        ];
    }

    onKeyUp(e) {
        clearTimeout(this.timer);
        this.toggleCarregador(true);
        var termo = e.target.value        
        this.timer = setTimeout(() => this.pegarMusicas(termo), 200);
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
        
        vagalume.open('GET', url + 'search.excerpt?q=' + encodeURIComponent(termo) + '&limit=15');
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
            this.setState({letraMusica: {esquerda: letraEsquerda, direita: letraDireita}, idBuscarLetra: null, botoesVisiveis: true, 
                           listaAtiva: false, 
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
    
    onClick(e) {
        this.props.dispatch({type: 'inserir', elemento: this.state.elemento});
    }

    limparInput = () => {
        this.refCombo.value = '';
        this.refCombo.focus();
        this.setState({listaAtiva: true, letraMusica: {}, botoesVisiveis: false, opcoes: []})
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
        return (
            <div className='conteudo-popup'>
                <div className='wraper-popup'>
                    <div>
                        <h4 className='titulo-popup'>Pesquisa de Música</h4>
                        <div className='wraper-popup'>
                            {this.state.carregando}
                            <input ref={el => this.refCombo = el} className='combo-popup' type='text' autoComplete='off'
                                   onFocus={() => this.setState({listaAtiva: true})} onKeyUp={e => this.onKeyUp(e)}
                                   placeholder='Pesquise por nome, artista ou trecho'/>
                        </div>
                    </div>
                    <div className='wraper-popup'>
                        <div id='div-logo-vagalume'>
                            <a href='https://www.vagalume.com.br/' target="_blank" rel="noopener noreferrer">
                                <img id='logo-vagalume' src={logoVagalume} alt='Logo Vagalume'/>
                            </a>
                        </div>
                    </div>
                    <div className='container-opcoes-musica container-carrossel' style={this.state.listaAtiva ? null : {display: 'none'}}>
                        <Carrossel tamanhoIcone={45} tamanhoMaximo='100%' direcao='vertical' style={{zIndex: '400'}} percentualBeirada={0.08}>
                            <div className='opcoes-musica'>
                                {this.state.opcoes.map(mus => 
                                    <ItemListaMusica musica={mus} buscarLetra={this.buscarLetra} idBuscarLetra={this.state.idBuscarLetra}/>
                                )}
                            </div>
                        </Carrossel>
                    </div>
                </div>
                <div className='container-preview combo-popup container-carrossel'>
                    <Carrossel tamanhoIcone={45} tamanhoMaximo='100%' direcao='vertical' style={{zIndex: '400'}} percentualBeirada={0.08}>
                        <div>
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

export default connect()(ComboLetra);

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
    
//     console.log(url + encodeURIComponent(vagalume[index].url.split('/')[1]) + '/index.js&apikey=' + apiKey);
//     generoMusica[generoMusica.length - 1].open('POST', url + encodeURIComponent(vagalume[index].url.split('/')[1]) + '/index.js&apikey=' + apiKey);
//     generoMusica[generoMusica.length - 1].setRequestHeader('Access-Control-Allow-Origin', '*');
//     generoMusica[generoMusica.length - 1].setRequestHeader('Access-Control-Allow-Credentials', 'true');
//     generoMusica[generoMusica.length - 1].send();
//     this.filtrarGenero(vagalume, index + 1)
// }


