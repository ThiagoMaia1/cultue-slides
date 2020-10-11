import React, { Component } from 'react';
import Button from './Button';
import livros from './Livros.json';
import versoes from './Versoes.json';
import './style.css';
import { extrairReferencias } from "./referenciaBiblica"
import { Element } from '../../index'

const url = 'https://bibleapi.co/api';
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IlR1ZSBPY3QgMDYgMjAyMCAwMzoxMDo1MCBHTVQrMDAwMC50dGhpYWdvcG1haWFAZ21haWwuY29tIiwiaWF0IjoxNjAxOTUzODUwfQ.J9CusTS1g3uJObw6Hb4da0K4ZmXZgeMKG8QUSH0E4sI"

class RefInvalida {
    constructor(str) {
        this.cap = null; 
        this.livro = null; 
        this.vers = null; 
        this.texto = '<p style="color:red"><br><br><i><b>"' + str + '"- Referência Inválida</b></i></p>'
    }
}

class TextoBiblico extends Component {

    constructor (props) {
        super(props);
        this.state = {
            elemento: null,
            comboCaps: 0,
            comboVersos: 0
        }
    }

    requestVersos(ref) {
        
        var query = []
        var versao = versoes.filter(v => (v.nome === document.getElementById('versao').value))[0].version
        var versiculos = [];
        var lastVersiculos = [];
        var contadorRef = 0;
        
        for (var i = 0; i < ref.length; i++) {
            if (ref[i].inicial === -1) {
                continue;
            } else if (ref[i].inicial === 1) {
                if (ref[i+1].inicial !== -1) {
                    ref[i].inicial = 0;
                } else {
                    for (var j = ref[i].cap; j <= ref[i+1].cap; j++) {
                        montarQuery(ref[i], versao, i + j/100, j, [ref[i].cap, ref[i].vers, ref[i+1].cap, ref[i+1].vers]);
                    }
                }
            } else {
                montarQuery(ref[i], versao, i);
            }
        }
        tratarVersiculos();
        
        function getReferenciaLimpa(ref) {
            //Funcionamento ainda não bem testado.
            var [ r, i ] = ['', 0];
            do {
                if (!eReferencia(ref[i])) {
                    delete ref[i];
                    continue;
                }
                if (i === 0 || ref[i].livro !== ref[i-1].livro) {
                    r = r + ref[i].livro.name + ' ' + ref[i].cap + (ref[i].vers ? ':' + ref[i].vers : '');
                } else {
                    r = r + (ref[i].inicial === -1 ? '-' : ', ');
                    if (ref[i].cap !== ref[i-1].cap) {
                        r = r + ref[i].cap;
                        r = r + ref[i].vers === null ? '' : ':' + ref[i].vers;
                    } else {
                        r = r + ref[i].vers;
                    }
                }
                i++;
            } while(i < ref.length)
            return r;
        }

        function eReferencia(ref) {
            return (ref.livro !== null && ref.cap !== null);
        }

        function montarQuery (ref, versao, ordem, cap = null, filtro = null) {  
            contadorRef++;
            if (!eReferencia(ref)) {
                versiculos.push({versos: new RefInvalida(ref.strInicial), ordem: ordem});
            } else { 
                query = [url, "verses",
                        versao,
                        ref.livro.abbrevPt,
                        cap || ref.cap,
                        ref.inicial === 0 && ref.vers !== null ? ref.vers : null,
                        ].join('/')
                getVersiculos(query, filtro, ordem)
            }
        }
        
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
                tratarVersiculos()
            })
            
            bibleApi.open('GET', query);
            bibleApi.setRequestHeader("Authorization", "Bearer " + token)
            bibleApi.send();
        }

        function tratarVersiculos() {
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
                    if (v instanceof RefInvalida) 
                        return v.texto;
                    var r = '<b>' + v.vers + '</b> ' + v.texto + ' ';
                    var c = '<br><br><b>' + v.cap + ':</b>';
                    var l = '<b>' + v.livro + '</b>';
                    if (i === 0) {
                        r = l + c + r;
                    } else {
                        if (v.livro !== versiculos[i-1].livro) {
                            r = '<br><br>' + l + c + r;
                        } else if (v.cap !== versiculos[i-1].cap) {
                            r = c + r;
                        }
                    } 
                    return r;
                }).join('');
                //this.setState
                //    new Element(null, "Bíblia", getReferenciaLimpa(ref), document.getElementById('textoVersiculos').innerHTML)
            }
        }
    }

    onClick() {
        //Criar evento pra inserir o texto bíblico
        //store.dispatch({ type: 'inserir', elemento: document.getElementById('textoVersiculos').elementoCompleto});
        console.log("Texto Incluído!");
    }

    buscarReferencia(e) {
        var str = e.target.value
        if (e.key === 'Enter' && !(!str || /^\s*$/.test(str)) ) {    
            var refer = [...(extrairReferencias(str))];
            if (refer != null) {
                if (refer.length === 1 && refer[0].cap == null && !str.substr(2)===/^[0-9]/g) {
                    if (refer[0].livro !== null) {
                        //alterar opções no input seguinte
                        this.setState({comboCaps: refer[0].cap});
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
    
    render () {
        return (
            <>
                <h4>Buscar texto bíblico:</h4>
                <input id="versao" className='combo-popup' defaultValue="Nova Versão Internacional (NVI)" type="text" list="versoes" />
                <datalist id="versoes">
                    {versoes.map(v => (<option key={v.version} value={v.nome}></option>))}
                </datalist>
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
                <Button onClick={this.onClick}/>
                <div>{this.state.elemento.texto}</div>  
                {/* <Button visibility={this.state.visivel} onClick={this.onClick}/> */}
            </>
        )
    }
}

export default TextoBiblico;