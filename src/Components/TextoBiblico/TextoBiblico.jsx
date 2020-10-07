import React, { Component } from 'react';
import Button from './Button';
import livros from './Livros.json';
import versoes from './Versoes.json';
// import './style.css';
import { extrairReferencias, referenciaBiblica } from "./referenciaBiblica"

const url = 'https://bibleapi.co/api';
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IlR1ZSBPY3QgMDYgMjAyMCAwMzoxMDo1MCBHTVQrMDAwMC50dGhpYWdvcG1haWFAZ21haWwuY29tIiwiaWF0IjoxNjAxOTUzODUwfQ.J9CusTS1g3uJObw6Hb4da0K4ZmXZgeMKG8QUSH0E4sI"

class TextoBiblico extends Component {

    // constructor (props) {
    //     super(props);
    //     this.state = {capsBox: 1, }
    // }

    // buildQuery(tipo = "verses", versão, livro, cap, verso) {
    //     if (tipo = "verses") {
    //         return "/" + tipo + "/" + "/" + versão + "/" livro + "/" cap
    //     }
    // }

    requestVersos(referencias) {
        
        console.log(referencias);

        // if (referencias.cap == null) return;
        // if (referencias.capInicial > referencias.livro.chapters || 
        //     referencia.capFinal > referencia.livro.chapters) {
        //     alert("Capítulo não existe");
        //     return;
        // }
        // if (referencia.livro == null) {
        //     alert("Livro não encontrado");
        //     return;
        // }

        // var bibleApi = new XMLHttpRequest()
        // var versao = versoes.filter(v => (v.nome == document.getElementById('versao').value))[0].version
        // var versiculos = [];

        // bibleApi.responseType = 'json';
        // bibleApi.addEventListener('load', () => {
        //     var arrays = [
        //         [query[4]],
        //         bibleApi.response.verses.map(v => (v.number + " " + v.text)).filter(
        //             (v, j) => (j >= referencia.versInicial && (j <= referencia.versFinal || referencia.versFinal == -1)))
        //     ]
        //     versiculos = versiculos.concat(...arrays.filter(Array.isArray));
        //     //Mandar esperar requisição.
        //     console.log(versiculos);
        // })
        
        // var i = referencia.capInicial;
        // do {
        //     var query = [url, "verses",
        //                 versao,
        //                 referencia.livro.abbrevPt,
        //                 i,
        //                 referencia.capFinal == -1 && referencia.versFinal == -1 ? referencia.versInicial : null
        //     ] 

        //     bibleApi.open('GET', query.join('\/'));
        //     bibleApi.setRequestHeader("Authorization", "Bearer " + token)
        //     bibleApi.send();
        //     i++;
        //     if (i>10) break;
        // } while (i <= referencia.capFinal && referencia.capFinal != -1)       

    }

    onClick() {
        //Criar evento pra inserir o texto bíblico
        console.log("Texto Incluído!");
    }

    buscarReferencia(e) {
        if (e.key === 'Enter') {    
            var refer = extrairReferencias(e.target.value);
            if (refer != null) {
                if (refer.length = 1 && refer[0].cap == null) {
                    //alterar opções no input seguinte
                    console.log(refer[0].livro.chapters);
                } else {
                    //algum problema relacionado a execução assíncrona
                    setTimeout(() => (this.requestVersos(refer)),2000);
                }
            }
        }
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
                <input type="text" list="capitulos" />
                <input type="text" list="versiculos" />                     
                <Button onClick={this.onClick}/>           
                {/* <Button visibility={this.state.visivel} onClick={this.onClick}/> */}
            </>
        )
    }
}

export default TextoBiblico;