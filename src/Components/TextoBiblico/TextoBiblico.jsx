import React, { Component } from 'react';
//import Button from './Button';
import livros from './Livros.json';
import versoes from './Versoes.json';
// import './style.css';
import { bcv_parser as leitorDeRef } from "bible-passage-reference-parser/js/pt_bcv_parser"

const url = 'https://bibleapi.co/api';
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IlR1ZSBPY3QgMDYgMjAyMCAwMzoxMDo1MCBHTVQrMDAwMC50dGhpYWdvcG1haWFAZ21haWwuY29tIiwiaWF0IjoxNjAxOTUzODUwfQ.J9CusTS1g3uJObw6Hb4da0K4ZmXZgeMKG8QUSH0E4sI"
var leitor = new leitorDeRef;

class TextoBiblico extends Component {

    // constructor (props) {
    //     super(props);
    //     this.state = {opcoes: [], letra:"", visivel: false}
    // }

    // buildQuery(tipo = "verses", versão, livro, cap, verso) {
    //     if (tipo = "verses") {
    //         return "/" + tipo + "/" + "/" + versão + "/" livro + "/" cap
    //     }
    // }

    requestVersos(referencia) {
        if (referencia.capInicial == -1) return;
        if (referencia.capInicial > referencia.livro.chapters || 
            referencia.capFinal > referencia.livro.chapters) {
            alert("Capítulo não existe");
            return;
        }
        if (referencia.livro == null) {
            alert("Livro não encontrado");
            return;
        }

        var bibleApi = new XMLHttpRequest()
        var versao = versoes.filter(v => (v.nome == document.getElementById('versao').value))[0].version
        var versiculos = [];

        bibleApi.responseType = 'json';
        bibleApi.addEventListener('load', () => {
            var arrays = [
                [query[4]],
                bibleApi.response.verses.map(v => (v.number + " " + v.text)).filter(
                    (v, j) => (j >= referencia.versInicial && (j <= referencia.versFinal || referencia.versFinal == -1)))
            ]
            versiculos = versiculos.concat(...arrays.filter(Array.isArray));
            //Mandar esperar requisição.
            console.log(versiculos);
        })
        
        var i = referencia.capInicial;
        do {
            var query = [url, "verses",
                        versao,
                        referencia.livro.abbrevPt,
                        i,
                        referencia.capFinal == -1 && referencia.versFinal == -1 ? referencia.versInicial : null
            ] 

            bibleApi.open('GET', query.join('\/'));
            bibleApi.setRequestHeader("Authorization", "Bearer " + token)
            bibleApi.send();
            i++;
            if (i>10) break;
        } while (i <= referencia.capFinal && referencia.capFinal != -1)       

    }

    onClick() {
        //Criar evento pra inserir o texto bíblico
        console.log("Texto Incluído!");
    }

    buscarReferencia(e) {
        console.log(leitor.parse(e.target.value).entities[0].passages);

        // if (e.key === 'Enter') {
        //     var refer = this.referenciaValida(e.target.value);
        //     if (refer != null) {
        //         this.requestVersos(refer);
        //     }
        // }
    }

    // referenciaValida(referencia) {
        
    //     function capVerso(refStr) {
    //         return refStr.split(":");
    //     };

    //     //Limpa a string da referência.
    //     var livro;     
    //     referencia = referencia.trim().toLowerCase().replace('.',':').replace(';',',');
    //     referencia = referencia.replace(/[^a-z0-9:\-,]/g,"");
    //     referencia = referencia.replace(/[a-z](?=[0-9])/g,'$& ');
    //     var arr = referencia.split(" ");
        
    //     //Encontra o livro
    //     for (var item of livros) {
    //         if (item.abbrev.filter(a=>(arr[0].localeCompare(a)==0)).length > 0) {
    //             livro = item;
    //             break;
    //         }
    //     }
    //     if (livro == null)
    //         return null;
    //     //Se campo é só o nome do livro, retorna o livro.
        
    //     if (arr.length == 1)
    //         return {livro};
        
    //     var inicial = [];
    //     var final = [];

    //     if (arr[1].search("-") > -1) {
    //     //Quebra as referências aos capítulos em inicial e final.
    //         var numeros = arr[1].split('-');
    //         inicial = numeros[0].split(':');
    //         if (numeros[1].search(":") == -1) {
    //             final[0] = inicial[0];
    //             final[1] = numeros[1];
    //         } else {
    //             final = numeros[1].split('-');
    //         }

    //     } else if (!isNaN(arr[1])) {
    //         inicial[0] = arr[1];
    //         inicial[1] = 1;
    //         final = [arr[1], -1];
    //     } else if (arr[1].search(":") > -1) {
    //         inicial = arr[1].split(":");            
    //     }

    //     return {
    //         livro,
    //         capInicial: parseInt(inicial[0]),
    //         capFinal: parseInt(final[0]),
    //         versInicial: parseInt(inicial[1]),
    //         versFinal: parseInt(final[1])
    //     }
    //     //Criar correção de referência para livros de 1 capítulo só.
    // }

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
                <input type="text" list="capitulos" />
                <input type="text" list="versiculos" />                
                
                
                {/* <Button visibility={this.state.visivel} onClick={this.onClick}/> */}
            </>
        )
    }
}

export default TextoBiblico;