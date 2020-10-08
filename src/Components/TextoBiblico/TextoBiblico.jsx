import React, { Component } from 'react';
import Button from './Button';
import livros from './Livros.json';
import versoes from './Versoes.json';
import './style.css';
import { extrairReferencias } from "./referenciaBiblica"

const url = 'https://bibleapi.co/api';
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IlR1ZSBPY3QgMDYgMjAyMCAwMzoxMDo1MCBHTVQrMDAwMC50dGhpYWdvcG1haWFAZ21haWwuY29tIiwiaWF0IjoxNjAxOTUzODUwfQ.J9CusTS1g3uJObw6Hb4da0K4ZmXZgeMKG8QUSH0E4sI"

class TextoBiblico extends Component {

    constructor (props) {
        super(props);
        this.state = {
            textoVersiculos: 'texto de teste',
            comboCaps: 0,
            comboVersos: 0
        }
    }

    // buildQuery(tipo = "verses", versão, livro, cap, verso) {
    //     if (tipo = "verses") {
    //         return "/" + tipo + "/" + "/" + versão + "/" livro + "/" cap
    //     }
    // }

    requestVersos(ref) {
        
        var query = []
        var versao = versoes.filter(v => (v.nome === document.getElementById('versao').value))[0].version
        var versiculos = [];
        var lastVersiculos = [];
        var contadorRef = 0;
        var refInvalida = {cap: null, livro: "Referência Inválida", vers: null, texto: null}

        function getVersiculos(query, filtro, ordem) {
            var bibleApi = new XMLHttpRequest()
            bibleApi.filtro = filtro;
            bibleApi.responseType = 'json';
            bibleApi.addEventListener('load', () => {
                if (bibleApi.response.hasOwnProperty('verses')) {
                    lastVersiculos = bibleApi.response.verses.map(v => ({vers: v.number, texto: v.text}))
                    for (var x of lastVersiculos) {
                        x.cap = bibleApi.response.chapter.number ;
                        x.livro = bibleApi.response.book.name;
                    }
                    if (bibleApi.filtro !== null) {
                        lastVersiculos = lastVersiculos.filter(
                            v => (((v.cap > bibleApi.filtro[0] || v.vers >= bibleApi.filtro[1]) || (v.cap >= bibleApi.filtro[0] && bibleApi.filtro[1] == null)) &&
                            ((v.cap < bibleApi.filtro[2] || v.vers <= bibleApi.filtro[3]) || (v.cap <= bibleApi.filtro[2] && bibleApi.filtro[3] == null)))
                        )
                    }
                } else {
                    lastVersiculos.push({cap: bibleApi.response.chapter, livro: bibleApi.response.book.name, vers: bibleApi.response.number, texto: bibleApi.response.text});
                }
                
                versiculos.push({versos: lastVersiculos, ordem: ordem});
                if (versiculos.length === contadorRef) {
                    versiculos = versiculos.sort((a, b) => {
                        if(a.ordem < b.ordem) {
                            return -1;
                        } else if(a.ordem > b.ordem) {
                            return 1;
                        } else {
                            return 0;
                        }
                    })
                    versiculos = versiculos.flatMap(v => v.versos);
                    var textoVersiculos = versiculos.map((v, i) => {
                        if (v === refInvalida) 
                            return v.texto;
                        var r = '<b>' + v.vers + '</b> ' + v.texto + ' ';
                        if (i === 0) {
                            r = '<b>' + v.livro + '</b> <b>' + v.cap + '</b> ' + r;
                        } else {
                            if (v.cap !== versiculos[i-1].cap)
                                r = '<b>' + v.cap + '</b> ' + r;
                            if (v.livro !== versiculos[i-1].livro)
                                r = '<br><br> <b>' + v.livro + '</b> ' + r;
                        } 
                        return r;
                    }).join('');
                    document.getElementById('textoVersiculos').innerHTML = textoVersiculos;
                }
            })
            
            bibleApi.open('GET', query);
            bibleApi.setRequestHeader("Authorization", "Bearer " + token)
            bibleApi.send();
        }

        for (var i = 0; i < ref.length; i++) {
            if (ref[i].inicial === -1) {
                continue;
            } else if (ref[i].inicial === 1) {
                if (ref[i+1].inicial !== -1) {
                    ref[i].inicial = 0;
                } else {
                    for (var j = ref[i].cap; j <= ref[i+1].cap; j++) {
                        montarQuery(ref[i], versao, i, j, [ref[i].cap, ref[i].vers, ref[i+1].cap, ref[i+1].vers]);
                    }
                }
            } else {
                montarQuery(ref[i], versao, i);
            }
        }

        function montarQuery (ref, versao, ordem, cap = null, filtro = null) { 
            if (ref.cap === null || ref.livro === null) {
                versiculos.push({versos: refInvalida, ordem: ordem});
            } else { 
                query = [url, "verses",
                        versao,
                        ref.livro.abbrevPt,
                        cap || ref.cap,
                        ref.inicial === 0 && ref.vers !== null ? ref.vers : null,
                        ].join('/')
                contadorRef++;
                getVersiculos(query, filtro, ordem)
            }
        }

    }

    onClick() {
        //Criar evento pra inserir o texto bíblico
        console.log("Texto Incluído!");
    }

    buscarReferencia(e) {
        if (e.key === 'Enter') {    
            var refer = [...(extrairReferencias(e.target.value))];
            if (refer != null) {
                if (refer.length === 1 && refer[0].cap == null) {
                    if (refer[0].livro !== null) {
                        //alterar opções no input seguinte
                        this.setState({comboCaps: refer[0].cap});
                    }
                } else if (refer != null){
                    //algum problema relacionado a execução assíncrona
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
    render () {
        return (
            <>
                <input id="versao" defaultValue="Nova Versão Internacional (NVI)" type="text" list="versoes" />
                <datalist id="versoes">
                    {versoes.map(v => (<option key={v.version} value={v.nome}></option>))}
                </datalist>
                <input type="text" list="livros" onKeyDown={e => this.buscarReferencia(e)}/>
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
                <Button onClick={this.onClick}/>
                <p id='textoVersiculos'></p>  
                {/* <Button visibility={this.state.visivel} onClick={this.onClick}/> */}
            </>
        )
    }
}

export default TextoBiblico;