import React, { Component } from 'react';
// import livros from './Livros.json';
import versoes from './Versoes.json';
import './style.css';
import { extrairReferencias, RefInvalida } from "./referenciaBiblica"
import Element from '../../Element'
import { connect } from 'react-redux'
import { formatarVersiculos, formatarVersiculosSlide } from '../Preview/TextoPreview.jsx'
import Carregando from '../LetrasMusica/Carregando.jsx';

const url = 'https://bibleapi.co/api';
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IlR1ZSBPY3QgMDYgMjAyMCAwMzoxMDo1MCBHTVQrMDAwMC50dGhpYWdvcG1haWFAZ21haWwuY29tIiwiaWF0IjoxNjAxOTUzODUwfQ.J9CusTS1g3uJObw6Hb4da0K4ZmXZgeMKG8QUSH0E4sI"
const versaoPadrao = 'nvi'

class TextoBiblico extends Component {

    constructor (props) {
        super(props);
        this.versao = versaoPadrao;
        this.ref = React.createRef();
        this.state = {
            botoesVisiveis: false,
            versiculosPronto: [],
            carregando: null
        }
    }    
    
    buscarReferencia(e) {
        var str = e.target.value
        if (e.key === 'Enter' && !(!str || /^\s*$/.test(str))) { 
            var refer = [...extrairReferencias(str)];
            if (refer != null) {
                if (refer.length === 1 && refer[0].cap === null && refer[0].strInicial.substr(1).match(/[0-9]/g) === null) {
                    if (refer[0].livro !== null) {
                        //alterar opções no input seguinte
                        // this.setState({comboCaps: refer[0].livro.chapters});
                    }
                } else if (refer != null){
                    this.requestVersos(refer);
                }
            }
        }
    }

    requestVersos(ref) {
        this.setState({carregando:<Carregando style={{backgroundColor:'white'}} />})
        this.referenciaLimpa = this.getReferenciaLimpa(ref);
        this.versiculos = []; 
        this.contadorRef = 0;
        for (var i = 0; i < ref.length; i++) {
            if (ref[i].inicial === -1) {
                continue;
            } else if (ref[i].inicial === 1) {
                if (ref[i+1].inicial !== -1) {
                    ref[i].inicial = 0;
                } else {
                    for (var j = ref[i].cap; j <= ref[i+1].cap; j++) {
                        this.montarQuery(ref[i], this.versao, i + j/100, j, [ref[i].cap, ref[i].vers, ref[i+1].cap, ref[i+1].vers]);
                    }
                }
            } else {
                this.montarQuery(ref[i], this.versao, i);
            }
        }
        this.tratarVersiculos()
    }

    getReferenciaLimpa(ref) {
        var r = '';
        for (var i = 0; i < ref.length; i++){
            if (!this.eReferencia(ref[i])) {
                continue;
            }
            if (i === 0 || ref[i].livro !== ref[i-1].livro) {
                r = r + ref[i].livro.name + ' ' + ref[i].cap + (ref[i].vers ? ':' + ref[i].vers : '');
            } else {
                if (ref[i].cap !== ref[i-1].cap) {
                    r = r + ref[i].cap;
                    r = r + (ref[i].vers === null ? '' : ':' + ref[i].vers);
                } else {
                    r = r + ref[i].vers;
                }
            }
            r = r + (ref[i].inicial === 1 ? '-' : i === ref.length-1 ? '' : ', ');
        }
        return r;
    }

    eReferencia(ref) {
        if ('livro' in ref || 'cap' in ref)
            return ref.livro !== null && ref.cap !== null;
        return false;
    }

    montarQuery (ref, versao, ordem, cap = null, filtro = null) {  
        this.contadorRef++;
        if (!this.eReferencia(ref)) {
            this.versiculos.push({versos: new RefInvalida(ref.strInicial), ordem: ordem});
        } else { 
            this.query = [url, "verses",
                    versao,
                    ref.livro.abbrevPt,
                    cap || ref.cap,
                    ref.inicial === 0 && ref.vers !== null ? ref.vers : null,
                    ].join('/')
            this.getVersiculos(this.query, filtro, ordem)
        }
    }
    
    getVersiculos(query, filtro, ordem) {
        var bibleApi = new XMLHttpRequest()
        bibleApi.filtro = filtro;
        bibleApi.responseType = 'json';
        bibleApi.addEventListener('load', () => {
            var resp = bibleApi.response;
            var filtro = bibleApi.filtro;
            if (resp.hasOwnProperty('verses')) {
                var lastVersiculos = resp.verses.map(v => ({vers: v.number, texto: v.text}))
                for (var x of lastVersiculos) {
                    x.cap = resp.chapter.number ;
                    x.livro = resp.book.name;
                }
                if (filtro !== null) {
                    lastVersiculos = lastVersiculos.filter(
                        v => (((v.cap > filtro[0] || v.vers >= filtro[1]) || (v.cap >= filtro[0] && filtro[1] == null)) &&
                        ((v.cap < filtro[2] || v.vers <= filtro[3]) || (v.cap <= filtro[2] && filtro[3] == null)))
                    )
                }
            } else {
                lastVersiculos = {cap: resp.chapter, livro: resp.book.name, vers: resp.number, texto: resp.text};
            }
            
            this.versiculos.push({versos: lastVersiculos, ordem: ordem});
            this.tratarVersiculos()
        })
        
        bibleApi.open('GET', query);
        bibleApi.setRequestHeader("Authorization", "Bearer " + token)
        bibleApi.send();
    }

    tratarVersiculos() {
        if (this.versiculos.length !== this.contadorRef) return;
        this.versiculos = this.versiculos.sort((a, b) => {
            if(a.ordem < b.ordem) {
                return -1;
            } else if(a.ordem > b.ordem) {
                return 1;
            } else {
                return 0;
            }
        })
        this.versiculos = this.versiculos.flatMap(v => v.versos);
        this.setState({versiculosPronto: this.versiculos, carregando: null, 
                       botoesVisiveis: !!this.versiculosValidos(this.versiculos).length
        });
    }
    
    versiculosValidos(versiculos) {
        var validos = []
        for (var v of versiculos) {
            if (v instanceof RefInvalida) continue;
            validos.push(v);
        }
        return validos;
    }

    onClick() {
        this.props.dispatch({ type: 'inserir', 
            elemento: new Element('Texto-Bíblico', this.referenciaLimpa, 
                                  formatarVersiculosSlide(this.versiculosValidos(this.state.versiculosPronto)))});
    }

    getVersao(termo) {
        var arrNomes = versoes.filter(v => (v.version === termo))
        var nome = arrNomes.length === 0 ? null : arrNomes[0].nome;
        var arrVersions = versoes.filter(v => (v.nome === termo))
        var version = arrVersions.length === 0 ? null : arrVersions[0].version;
        return nome || version;
    }

    mudarVersao (e) {
        this.versao = this.getVersao(e.target.value);
    }
    
    limparInput = () => {
        var combo = this.ref.current;
        combo.value = '';
        combo.focus();
        this.setState({versiculosPronto: [], botoesVisiveis: false})
    }

    componentDidMount() {
        setTimeout(() => {this.ref.current.focus();}, 1)
    }

    render () {
        return (
            <div className='conteudo-popup'>
                <div>
                    <h4 className='titulo-popup'>Buscar texto bíblico:</h4>
                    <div style={{position: 'relative'}}> 
                        <select className='combo-popup' defaultValue={this.getVersao(versaoPadrao)} type="text" list="versoes" 
                            onChange={e => this.mudarVersao(e)}>
                            {versoes.map(v => (<option key={v.version} value={v.nome}>{v.nome}</option>))}
                        </select>
                        {this.state.carregando}
                        <input ref={this.ref} className='combo-popup' type='text' onKeyDown={e => this.buscarReferencia(e)} 
                            placeholder='Digite uma ou mais referências separadas por vírgula. (Ex: "Jo3:16, mc10")' />
                        {/* <datalist id="livros">
                            {livros.map(l => (<option key={l.abbrevPt} value={l.name}></option>))}
                        </datalist> */}
                    </div>
                </div>
                {/* Seleção por capítulo e versículo tem funções salvas no módulo ComboCapVers.jsx */}
                <div className='container-versiculos'>
                    {formatarVersiculos(this.state.versiculosPronto)}
                    {/* <div className='texto-inserir'>
                    </div> */}
                </div>
                {this.state.botoesVisiveis ? <div className='container-botoes-popup'>
                    <button className='botao' style={{visibility: this.state.botoesVisiveis}} onClick={() => this.onClick()}>
                        Inserir Texto Bíblico
                    </button>
                    <button className='botao limpar-input' onClick={this.limparInput}>
                        ✕ Limpar
                    </button>
                </div> : null}
            </div>
        )
    }
}

export default connect()(TextoBiblico);