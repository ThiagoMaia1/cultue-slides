import React from 'react';
import { RefInvalida } from "../TextoBiblico/referenciaBiblica"

// export class Element {
//     constructor(apiKey, tipo, titulo, texto) {
//       idElement++;
//       this.id = idElement;
//       this.apiKey = apiKey;
//       this.tipo = tipo;
//       this.titulo = titulo;
//       this.texto = texto;
//     }
//   }

// function textoPreview (elemento) {
//     var textoDividido = [];
//     switch (elemento.tipo) {
//         case 'Bíblia':
//             formatarVersiculos(elemento.texto);
//         case 'Música':
//             formatarMusica(elemento.texto);
//         case 'Título':

//         case 'Imagem':

//     }
// }

function numSuperscrito(num) {
    var lista = String(num).split('');
    var sup = [];
    for (var n of lista) {
        sup.push("⁰¹²³⁴⁵⁶⁷⁸⁹"[Number(n)]);
    }
    return sup.join('');
}

export function formatarVersiculosSlide(versiculos) {
    return versiculos.map((v, i) => {
        if (v instanceof RefInvalida) 
            return v.texto;
        console.log(v.vers)
        var r = numSuperscrito(v.vers) + ' ' + v.texto + ' ';
        var c = v.cap + ' ';
        var l = v.livro + ' ';
        if (i === 0) {
            r = l + c + r;
        } else {
            if (v.livro !== versiculos[i-1].livro) {
                r = '\n\n' + l + c + r;
            } else if (v.cap !== versiculos[i-1].cap) {
                r = c + r;
            }
        } 
        return r;
    })
}

export function formatarVersiculos(versiculos) {
    return versiculos.map((v, i) => {
        if (v instanceof RefInvalida) {
            return (<><br></br><br></br><div className="itens" style={{backgroundColor:'#ffcccc', color:'red'}}><b>{v.texto}</b></div></>)
        }
        var r = [];
        var l = (<><b>{v.livro} </b></>);
        var c = (<><br></br><br></br><b>{v.cap} </b></>);
        if (i === 0) {
            r.push(l, c);
        } else {
            if (v.livro !== versiculos[i-1].livro) {
                r.push(<><br></br><br></br></>, l, c);
            } else if (v.cap !== versiculos[i-1].cap) {
                r.push(c);
            }
        } 
        r.push(<><b>{numSuperscrito(v.vers)}</b> {v.texto} </>);
        return r;
    })
}