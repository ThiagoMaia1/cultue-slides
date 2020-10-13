import React, { Component } from 'react';
import livros from './Livros.json';
import versoes from './Versoes.json';
import './style.css';
import { extrairReferencias, RefInvalida } from "./referenciaBiblica"
import { Element } from '../../index'
import { connect } from 'react-redux'
import { formatarVersiculos } from '../Preview/TextoPreview.js'

const url = 'https://bibleapi.co/api';
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IlR1ZSBPY3QgMDYgMjAyMCAwMzoxMDo1MCBHTVQrMDAwMC50dGhpYWdvcG1haWFAZ21haWwuY29tIiwiaWF0IjoxNjAxOTUzODUwfQ.J9CusTS1g3uJObw6Hb4da0K4ZmXZgeMKG8QUSH0E4sI"
const versaoPadrao = 'nvi'

class TextoBiblico extends Component {

    constructor (props) {
        super(props);
        this.state = {
            botaoValidosVisivel: 'hidden',
            comboCaps: 0,
            comboVersos: 0,
            versiculos: []
        }
        this.versao = versaoPadrao;
    }    

    requestVersos(ref) {
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
                    r = r + ref[i].vers === null ? '' : ':' + ref[i].vers;
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
            if (bibleApi.response.hasOwnProperty('verses')) {
                this.lastVersiculos = bibleApi.response.verses.map(v => ({vers: v.number, texto: v.text}))
                for (var x of this.lastVersiculos) {
                    x.cap = bibleApi.response.chapter.number ;
                    x.livro = bibleApi.response.book.name;
                }
                if (bibleApi.filtro !== null) {
                    this.lastVersiculos = this.lastVersiculos.filter(
                        v => (((v.cap > bibleApi.filtro[0] || v.vers >= bibleApi.filtro[1]) || (v.cap >= bibleApi.filtro[0] && bibleApi.filtro[1] == null)) &&
                        ((v.cap < bibleApi.filtro[2] || v.vers <= bibleApi.filtro[3]) || (v.cap <= bibleApi.filtro[2] && bibleApi.filtro[3] == null)))
                    )
                }
            } else {
                this.lastVersiculos.push({cap: bibleApi.response.chapter, livro: bibleApi.response.book.name, vers: bibleApi.response.number, texto: bibleApi.response.text});
            }
            
            this.versiculos.push({versos: this.lastVersiculos, ordem: ordem});
            this.tratarVersiculos()
        })
        
        bibleApi.open('GET', query);
        bibleApi.setRequestHeader("Authorization", "Bearer " + token)
        bibleApi.send();
    }

    tratarVersiculos() {
        if (this.versiculos.length === this.contadorRef) {
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
            this.setState({versiculos: this.versiculos, 
                           botaoValidosVisivel: this.versiculosValidos(this.versiculos).length > 0 ? 'visible' : 'hidden'
            });
        }
    }
    
    versiculosValidos(versiculos) {
        var validos = []
        for (var v in versiculos) {
            if (v instanceof RefInvalida) continue;
            validos.push(v);
        }
        return validos;
    }

    onClick() {
        this.props.dispatch({ type: 'inserir', elemento: new Element("Bíblia", this.referenciaLimpa, formatarVersiculos(this.versiculosValidos(this.versiculos)))});
        // console.log("Texto Incluído!");
    }

    buscarReferencia(e) {
        var str = e.target.value
        if (e.key === 'Enter' && !(!str || /^\s*$/.test(str))) { 
            var refer = [...(extrairReferencias(str))];
            if (refer != null) {
                if (refer.length === 1 && refer[0].cap === null && refer[0].strInicial.substr(1).match(/[0-9]/g) === null) {
                    if (refer[0].livro !== null) {
                        //alterar opções no input seguinte
                        this.setState({comboCaps: refer[0].livro.chapters});
                    }
                } else if (refer != null){
                    this.requestVersos(refer);
                }
            }
        }
    }

    criarLista(num, incluirZero = false){
        var r = []
        for (var i = 1 - incluirZero; i<=num; i++) {
            r.push(<option key={i} value={i}></option>);
        }
        return r;
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
    
    render () {
        return (
            <div style={{height:'100%'}}>
                <h4>Buscar texto bíblico:</h4>
                <select className='combo-popup' defaultValue={this.getVersao(versaoPadrao)} type="text" list="versoes" 
                    onChange={e => this.mudarVersao(e)}>
                    {versoes.map(v => (<option className='combo-popup' key={v.version} value={v.nome}>{v.nome}</option>))}
                </select>
                <input className='combo-popup' type='text' list="livros" onKeyDown={e => this.buscarReferencia(e)} style={{width:'300px'}}/>
                <datalist id="livros">
                    {livros.map(l => (<option key={l.abbrevPt} value={l.name}></option>))}
                </datalist>
                {/* <input type="text" list="capitulos" />
                <datalist id='capitulos'>
                    {this.criarLista(this.state.comboCaps)}
                </datalist>
                <input type="text" list="versiculos" />
                <datalist id='versiculos'>
                    {this.criarLista(this.state.comboVersos)}
                </datalist>                      */}
                <button className='botao' style={{visibility: String(this.state.botaoValidosVisivel)}} onClick={() => this.onClick()}>Inserir Texto Bíblico</button>
                <div className='texto-inserir'>
                    {formatarVersiculos(this.state.versiculos)}
                </div>
            </div>
        )
    }
}

export default connect()(TextoBiblico);